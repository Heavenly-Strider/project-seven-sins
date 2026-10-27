/* Собирает содержание по грехам и связывает материалы с общей читалкой. */
(() => {
  'use strict';

  const sins = ['Гнев', 'Гордыня', 'Зависть', 'Похоть', 'Лень', 'Жадность', 'Чревоугодие'];

  function showMessage(host, message) {
    host.replaceChildren();
    const paragraph = document.createElement('p');
    paragraph.className = 'sin-empty';
    paragraph.textContent = message;
    host.append(paragraph);
  }

  function renderContents() {
    const host = document.getElementById('sin-list');
    if (!host) {
      console.error('[PSS contents] Не найден контейнер #sin-list.');
      return;
    }

    const materials = Array.isArray(window.PSS_MATERIALS) ? window.PSS_MATERIALS : null;
    if (!materials) {
      showMessage(host, 'Не удалось загрузить список материалов. Обновите страницу; если ошибка повторится, проверьте подключение reading/materials.js.');
      console.error('[PSS contents] window.PSS_MATERIALS отсутствует или не является массивом.');
      return;
    }

    const themes = window.PSS_SIN_THEMES || {};
    host.replaceChildren();

    sins.forEach((sin, index) => {
      const theme = themes[sin] || {};
      const group = document.createElement('details');
      group.className = 'sin-group';
      group.style.setProperty('--sin-accent', theme.accent || '#9AA3AC');
      group.style.setProperty('--sin-border', theme.border || '#292e33');
      group.style.setProperty('--sin-panel', theme.panel || '#131619');
      group.style.setProperty('--sin-panel-light', theme.panelLight || '#191d21');

      const summary = document.createElement('summary');
      const name = document.createElement('span');
      name.className = 'sin-name';
      name.textContent = `${String(index + 1).padStart(2, '0')} / ${sin}`;
      const count = document.createElement('span');
      count.className = 'sin-count';
      const items = materials
        .filter(item => item && item.sin === sin && item.id && item.title)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      count.textContent = `${String(items.length).padStart(2, '0')} МАТЕРИАЛОВ`;
      summary.append(name, count);
      group.append(summary);

      const list = document.createElement('div');
      list.className = 'sin-items';
      if (!items.length) {
        const empty = document.createElement('p');
        empty.className = 'sin-empty';
        empty.textContent = 'Материалы этой группы пока не добавлены.';
        list.append(empty);
      } else {
        items.forEach(item => {
          const link = document.createElement('a');
          link.href = `../reading/index.html?id=${encodeURIComponent(item.id)}`;
          const label = document.createElement('span');
          label.textContent = item.title;
          const type = document.createElement('span');
          type.className = 'sin-type';
          type.textContent = item.type === 'document' ? 'Документ →' : 'Глава →';
          link.append(label, type);
          list.append(link);
        });
      }
      group.append(list);
      host.append(group);
    });
  }

  // Работает и при defer, и если скрипт подключили динамически после загрузки DOM.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderContents, { once: true });
  } else {
    renderContents();
  }
})();
