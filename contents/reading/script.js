/* Загружает выбранный материал, применяет тему, строит навигацию и сохраняет дальнюю позицию чтения. */
(() => {
  const materials = Array.isArray(window.PSS_MATERIALS) ? window.PSS_MATERIALS : [];
  const themes = window.PSS_SIN_THEMES || {};
  const PROGRESS_KEY = 'pss_reading_furthest_v1';
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const title = document.getElementById('reader-title');
  const subtitle = document.getElementById('reader-subtitle');
  const kicker = document.getElementById('reader-kicker');
  const content = document.getElementById('reader-content');
  const meta = document.getElementById('reader-meta');
  const actions = document.getElementById('reader-actions');
  const prev = document.getElementById('previous-material');
  const next = document.getElementById('next-material');

  // Подставляет CSS-переменные выбранной темы.
  function applySinTheme(sin) {
    const theme = themes[sin];
    if (!theme) return;
    const variables = {
      '--bg': theme.background,
      '--panel': theme.panel,
      '--panel-hover': theme.panelLight,
      '--border': theme.border,
      '--border-bright': theme.accent,
      '--text': theme.text,
      '--muted': theme.muted,
      '--dim': theme.muted,
      '--accent': theme.accent,
      '--accent-soft': theme.glow,
      '--pss-surface': theme.surface,
      '--pss-field-bg': theme.fieldBg
    };
    Object.entries(variables).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.background);
  }

  // Читает сохранённый материал, до которого пользователь дошёл дальше всего.
  function getProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null');
      return value && typeof value.id === 'string' ? value : null;
    } catch {
      return null;
    }
  }

  // Не позволяет повторному открытию старой главы откатить прогресс.
  function saveFurthest(material, index, validMaterials) {
    try {
      const saved = getProgress();
      const savedIndex = saved ? validMaterials.findIndex(item => item.id === saved.id) : -1;
      if (!saved || savedIndex < 0 || index > savedIndex) {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify({ id: material.id }));
      }
    } catch (error) {
      console.warn('Не удалось сохранить прогресс чтения:', error);
    }
  }

  // Экранирует текст перед преобразованием разметки главы в HTML.
  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // Преобразует встроенную wiki-разметку: жирный текст, курсив и ссылки.
  function parseInline(value) {
    let text = escapeHtml(value);
    text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, url, label) => {
      const safeUrl = url.trim();
      if (!/^(https?:\/\/|mailto:)/i.test(safeUrl)) return label;
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\/\/([^/]+)\/\//g, '<em>$1</em>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    return text;
  }

  // Преобразует текст главы в HTML, включая декоративные блоки.
  function parseChapter(source) {
    const lines = String(source || '').replace(/\r/g, '').split('\n');
    const output = [];
    let paragraph = [];
    let listType = null;
    let quote = [];

    const flushParagraph = () => {
      if (paragraph.length) output.push(`<p>${parseInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    };
    const flushList = () => {
      if (listType) output.push(`</${listType}>`);
      listType = null;
    };
    const flushQuote = () => {
      if (quote.length) output.push(`<blockquote><p>${quote.map(parseInline).join('<br>')}</p></blockquote>`);
      quote = [];
    };
    const flushText = () => {
      flushParagraph();
      flushList();
      flushQuote();
    };

    // Собирает содержимое декоративного блока до закрывающей строки :::.
    function readBlock(startIndex) {
      const header = lines[startIndex].trim().match(/^:::\s*(dark|light|frame|file|dossier)\s*$/i);
      if (!header) return null;
      const type = header[1].toLowerCase();
      const blockLines = [];
      let endIndex = startIndex + 1;
      while (endIndex < lines.length && lines[endIndex].trim() !== ':::') {
        blockLines.push(lines[endIndex]);
        endIndex++;
      }
      return { type, lines: blockLines, nextIndex: endIndex < lines.length ? endIndex + 1 : endIndex };
    }

    // Проверяет, что путь изображения локальный и не выходит за пределы сайта.
    function safeImagePath(value) {
      const path = String(value || '').trim();
      if (!path || /^(?:[a-z]+:|\/|\\)/i.test(path) || path.split('/').includes('..') || path.includes('\\')) return '';
      if (!/\.(?:avif|gif|jpe?g|png|webp)$/i.test(path)) return '';
      return path;
    }

    // Создаёт досье с фиксированной областью фотографии и текстовыми полями.
    function renderDossier(blockLines) {
      let photo = '';
      let name = '';
      let alias = '';
      const fields = [];
      const bodyLines = [];
      let inBody = false;

      for (const rawLine of blockLines) {
        const line = rawLine.trim();
        if (!inBody && line === '---') {
          inBody = true;
          continue;
        }
        if (inBody) {
          bodyLines.push(rawLine);
          continue;
        }
        const field = line.match(/^(photo|name|alias|field)\s*=\s*(.*)$/i);
        if (!field) {
          if (line) bodyLines.push(rawLine);
          continue;
        }
        const key = field[1].toLowerCase();
        const value = field[2].trim();
        if (key === 'photo') photo = safeImagePath(value);
        if (key === 'name') name = value;
        if (key === 'alias') alias = value;
        if (key === 'field') {
          const parts = value.split('|');
          if (parts.length >= 2 && parts[0].trim()) fields.push([parts[0].trim(), parts.slice(1).join('|').trim()]);
        }
      }

      const portrait = photo
        ? `<div class="chapter-dossier-photo"><img src="${escapeHtml(photo)}" alt="${escapeHtml(name || 'Портрет')}" loading="lazy"></div>`
        : '<div class="chapter-dossier-photo chapter-dossier-photo-empty"><span>NO IMAGE</span></div>';
      const identity = [name ? `<h3>${parseInline(name)}</h3>` : '', alias ? `<p class="chapter-dossier-alias">${parseInline(alias)}</p>` : ''].join('');
      const fieldMarkup = fields.map(([label, value]) => `<div class="chapter-dossier-field"><dt>${parseInline(label)}</dt><dd>${parseInline(value)}</dd></div>`).join('');
      const body = bodyLines.length ? `<div class="chapter-dossier-body">${parseChapter(bodyLines.join('\n'))}</div>` : '';
      return `<section class="chapter-block chapter-block-dossier"><div class="chapter-dossier-top">${portrait}<div class="chapter-dossier-identity">${identity}${fieldMarkup ? `<dl class="chapter-dossier-fields">${fieldMarkup}</dl>` : ''}</div></div>${body}</section>`;
    }

    for (let index = 0; index < lines.length; index++) {
      const rawLine = lines[index];
      const line = rawLine.trim();
      if (!line) {
        flushText();
        continue;
      }

      const block = readBlock(index);
      if (block) {
        flushText();
        if (block.type === 'dossier') {
          output.push(renderDossier(block.lines));
        } else {
          const className = `chapter-block chapter-block-${block.type}`;
          output.push(`<section class="${className}">${parseChapter(block.lines.join('\n'))}</section>`);
        }
        index = block.nextIndex - 1;
        continue;
      }

      const heading = line.match(/^(={1,3})\s*(.*?)\s*\1$/);
      if (heading) {
        flushText();
        const level = Math.min(heading[1].length + 1, 4);
        output.push(`<h${level}>${parseInline(heading[2])}</h${level}>`);
        continue;
      }
      if (/^----+$/.test(line)) {
        flushText();
        output.push('<hr>');
        continue;
      }
      const listItem = line.match(/^([*#])\s+(.+)$/);
      if (listItem) {
        flushParagraph();
        flushQuote();
        const nextType = listItem[1] === '*' ? 'ul' : 'ol';
        if (listType !== nextType) {
          flushList();
          listType = nextType;
          output.push(`<${listType}>`);
        }
        output.push(`<li>${parseInline(listItem[2])}</li>`);
        continue;
      }
      if (line.startsWith('> ')) {
        flushParagraph();
        flushList();
        quote.push(line.slice(2));
        continue;
      }
      flushList();
      flushQuote();
      paragraph.push(line);
    }
    flushText();
    return output.join('\n');
  }

  // Показывает понятное сообщение, если список пуст или файл главы недоступен.
  function showMessage(heading, message) {
    kicker.textContent = 'PSS // READING SEQUENCE';
    title.textContent = heading;
    subtitle.textContent = message;
    content.replaceChildren();
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    content.append(paragraph);
    meta.hidden = true;
    actions.hidden = true;
  }

  // При отсутствующем или недоступном фото показывает предусмотренную заглушку.
  function setupDossierImages() {
    content.querySelectorAll(".chapter-dossier-photo img").forEach(image => {
      image.addEventListener("error", () => {
        const frame = image.closest(".chapter-dossier-photo");
        if (!frame) return;
        frame.classList.add("chapter-dossier-photo-empty");
        frame.replaceChildren(Object.assign(document.createElement("span"), { textContent: "NO IMAGE" }));
      }, { once: true });
    });
  }

  // Загружает отдельный файл главы и вставляет результат в область чтения.
  async function loadMaterial(material) {
    if (!material.path) {
      content.innerHTML = parseChapter(material.content || '');
      setupDossierImages();
      return;
    }
    if (window.location.protocol === 'file:') {
      throw new Error('Откройте сайт через веб-сервер. Браузер блокирует загрузку глав при запуске через file://.');
    }
    const response = await fetch(material.path);
    if (!response.ok) throw new Error(`Не удалось загрузить файл главы (${response.status}).`);
    const source = await response.text();
    content.innerHTML = parseChapter(source);
    setupDossierImages();
  }

  // Заполняет метаданные и ссылки на соседние материалы.
  function renderMaterialMeta(material, index, valid) {
    meta.hidden = false;
    meta.replaceChildren();
    [material.type === 'document' ? 'ДОКУМЕНТ' : 'ГЛАВА', material.sin || 'ГРУППА НЕ УКАЗАНА', `ПОЗИЦИЯ ${index + 1} / ${valid.length}`].forEach(value => {
      const span = document.createElement('span');
      span.textContent = value;
      meta.append(span);
    });

    function setNavigation(link, item, emptyText) {
      if (!item) {
        link.href = '#';
        link.setAttribute('aria-disabled', 'true');
        link.textContent = emptyText;
        return;
      }
      link.href = `?id=${encodeURIComponent(item.id)}`;
      link.removeAttribute('aria-disabled');
      link.textContent = link === prev ? '← Предыдущий материал' : 'Следующий материал →';
    }

    setNavigation(prev, valid[index - 1], '← Начало последовательности');
    setNavigation(next, valid[index + 1], 'Конец последовательности →');
    actions.hidden = false;
  }

  // Выбирает материал из URL, загружает текст и обновляет состояние читалки.
  async function init() {
    const valid = materials.filter(item => item && typeof item.id === 'string' && item.id && typeof item.title === 'string');
    if (!valid.length) {
      showMessage('Материалы пока не добавлены', 'Добавьте утверждённые материалы в materials.js.');
      return;
    }
    const foundIndex = valid.findIndex(item => item.id === requestedId);
    const index = Math.max(0, foundIndex);
    const material = valid[index];
    applySinTheme(material.sin);
    title.textContent = material.title;
    subtitle.textContent = material.subtitle || '';
    kicker.textContent = `${String(index + 1).padStart(3, '0')} / ${String(valid.length).padStart(3, '0')} · ${material.type === 'document' ? 'DOCUMENT' : 'READING MATERIAL'}`;

    try {
      await loadMaterial(material);
    } catch (error) {
      console.error('Ошибка загрузки материала:', error);
      showMessage('Не удалось открыть материал', error.message || 'Проверьте путь к файлу главы.');
      return;
    }

    renderMaterialMeta(material, index, valid);
    saveFurthest(material, index, valid);
  }

  init();
})();
