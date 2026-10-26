// Сохраняет выбранный язык и переводит элементы интерфейса, если перевод готов.
(() => {
  const translations = {
    en: {
      "ЦЕНТРАЛЬНЫЙ АРХИВ": "CENTRAL ARCHIVE",
      "ЦЕНТРАЛЬНЫЙ АРХИВ · VII": "CENTRAL ARCHIVE · VII",
      "СОДЕРЖАНИЕ АРХИВА": "ARCHIVE CONTENTS",
      "ПОСЛЕДОВАТЕЛЬНОЕ ЧТЕНИЕ": "READING SEQUENCE",
      "АВТОРСКИЙ ТЕРМИНАЛ": "AUTHOR TERMINAL",
      "Начать читать сначала": "Start reading",
      "Продолжить чтение": "Continue reading",
      "Последняя достигнутая позиция": "Furthest position reached",
      "Содержание": "Contents",
      "Архив персонажей": "Character archive",
      "Об авторе": "About the author",
      "Выберите направление": "Choose a section",
      "Последовательно открыть материалы проекта": "Read project materials in order",
      "Главы, вселенные и связанные фрагменты": "Chapters, universes and related fragments",
      "Семь досье. Семь индивидуальных записей": "Seven dossiers. Seven individual records",
      "История создания и личный смысл проекта": "Project history and personal meaning",
      "← Главная": "← Home",
      "К чтению →": "Reading →",
      "Открыть содержание →": "Open contents →",
      "К чтению": "Reading",
      "Содержание": "Contents",
      "Материалы сгруппированы по греху и соответствующей вселенной. Выбор материала открывает его в общей последовательности чтения: переходы «предыдущий» и «следующий» следуют авторскому порядку, а не порядку внутри группы.": "Materials are grouped by sin and universe. Opening a material places it in the global reading sequence. Previous and next follow the author's order, not the group order.",
      "АРХИВ ПЕРСОНАЖЕЙ": "CHARACTER ARCHIVE",
      "Открыть досье персонажей →": "Open character dossiers →",
      "Материалы будут расположены в единой авторской последовательности.": "Materials are arranged in one author-defined sequence.",
      "Чтение материалов": "Reading materials",
      "← Предыдущий материал": "← Previous material",
      "Следующий материал →": "Next material →",
      "Введите команду": "Enter a command",
      "Введите help...": "Enter help...",
      "На главную": "Home",
      "Центральный архив": "Central archive",
      "ПОДСКАЗКА": "TIP",
      "Введите": "Enter",
      "Открыть страницу инструкции по переводу": "Open translation guide",
      "Инструкция по переводу": "Translation guide",
      "Русский": "Russian",
      "Английский": "English",
      "Язык": "Language",
      "Выбрать язык": "Choose language",
      "Перевод сайта": "Website translation",
      "Материалы этой группы пока не добавлены.": "No materials have been added to this group yet.",
      "МАТЕРИАЛОВ": "MATERIALS",
      "Глава →": "Chapter →",
      "Документ →": "Document →",
      "Материалы пока не добавлены": "No materials have been added yet",
      "Добавьте утверждённые материалы в materials.js.": "Add approved materials to materials.js.",
      "Не удалось открыть материал": "Could not open the material",
      "Проверьте путь к файлу главы.": "Check the chapter file path.",
      "Откройте сайт через веб-сервер. Браузер блокирует загрузку глав при запуске через file://.": "Open the site through a web server. The browser blocks chapter loading from file://.",
      "← Начало последовательности": "← Start of sequence",
      "Конец последовательности →": "End of sequence →",
      "ГЛАВА": "CHAPTER",
      "ДОКУМЕНТ": "DOCUMENT",
      "ГРУППА НЕ УКАЗАНА": "GROUP NOT SET",
      "Выбор языка": "Language selection"
    }
  };

  const storageKey = "pss-language";
  const supportedLanguages = ["ru", "en"];
  let currentLanguage = supportedLanguages.includes(localStorage.getItem(storageKey))
    ? localStorage.getItem(storageKey)
    : "ru";

  function translateTextNodes(root = document) {
    const dictionary = translations[currentLanguage] || {};
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!node.__pssOriginalText) node.__pssOriginalText = node.nodeValue;
      const original = node.__pssOriginalText;
      const trimmed = original.trim();
      if (!trimmed) return;
      const translated = dictionary[trimmed];
      if (translated) {
        const start = original.match(/^\s*/)?.[0] || "";
        const end = original.match(/\s*$/)?.[0] || "";
        const nextValue = start + translated + end;
        if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
      } else if (node.nodeValue !== original) {
        node.nodeValue = original;
      }
    });
  }

  function translateAttributes() {
    const dictionary = translations[currentLanguage] || {};
    document.querySelectorAll("[aria-label], [placeholder], [title]").forEach(element => {
      ["aria-label", "placeholder", "title"].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        const originalKey = `data-pss-original-${attribute}`;
        if (!element.hasAttribute(originalKey)) element.setAttribute(originalKey, element.getAttribute(attribute));
        const original = element.getAttribute(originalKey);
        element.setAttribute(attribute, dictionary[original] || original);
      });
    });
  }

  function applyLanguage(language) {
    currentLanguage = supportedLanguages.includes(language) ? language : "ru";
    localStorage.setItem(storageKey, currentLanguage);
    document.documentElement.lang = currentLanguage;
    translateTextNodes();
    translateAttributes();
    document.querySelectorAll(".language-choice").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
    });
    document.querySelectorAll(".language-toggle").forEach(button => {
      button.textContent = currentLanguage === "en" ? "Language: English" : "Язык: Русский";
    });
  }

  function addLanguageMenu() {
    // Главная страница остаётся без переключателя языка.
    if (document.querySelector(".navigation-grid") || document.querySelector(".language-control")) return;
    const control = document.createElement("div");
    control.className = "language-control";
    const configScript = document.querySelector('script[src$="site-config.js"]');
    const configPath = configScript ? configScript.getAttribute("src") : "site-config.js";
    const prefix = configPath.slice(0, configPath.lastIndexOf("/") + 1);
    const pagePath = window.location.pathname;
    // В архиве 0.6 есть три копии сайта с разным расположением страницы перевода.
    const guidePath = pagePath.includes("/contents/") || pagePath.includes("/translation/")
      ? `${prefix}translation/index.html`
      : `${prefix}translation/translation/index.html`;
    control.innerHTML = `
      <button class="language-toggle" type="button" aria-expanded="false" aria-controls="pss-language-menu">Язык: Русский</button>
      <div class="language-menu" id="pss-language-menu" hidden>
        <button class="language-choice" type="button" data-language="ru">Русский</button>
        <button class="language-choice" type="button" data-language="en">English</button>
        <a class="translation-guide-link" href="${guidePath}">Инструкция по переводу</a>
      </div>
    `;
    const header = document.querySelector("body > header, body > .topbar, body > main > header");
    if (header) header.insertAdjacentElement("afterend", control);
    else {
      const main = document.querySelector("body > main");
      if (main) main.insertAdjacentElement("beforebegin", control);
      else document.body.insertBefore(control, document.body.firstChild);
    }
    if (!document.getElementById("pss-language-control-style")) {
      const style = document.createElement("style");
      style.id = "pss-language-control-style";
      style.textContent = `
        .language-control{position:relative;z-index:30;display:flex;align-items:center;justify-content:flex-end;gap:6px;width:min(1080px,calc(100% - 40px));margin:8px auto 0;font:10px/1.5 Consolas,"Courier New",monospace;color:var(--muted,#aab1b8);box-sizing:border-box}
        .language-toggle,.language-choice{padding:8px 11px;border:1px solid var(--border-bright,var(--border,#454c53));background:var(--panel,#171a1e);color:var(--text,#e7e9eb);font:inherit;cursor:pointer}
        .language-toggle:hover,.language-choice:hover{border-color:var(--accent,#d6c7a0)}
        .language-menu{position:absolute;top:calc(100% + 6px);right:0;bottom:auto;z-index:100;display:grid;gap:0;min-width:180px;max-width:calc(100vw - 28px);padding:6px;border:1px solid var(--border-bright,var(--border,#343a40));background:var(--panel,#171a1e);box-shadow:0 10px 24px rgba(0,0,0,.3)}
        .language-menu[hidden]{display:none}.language-choice,.language-control .translation-guide-link{display:block;width:100%;padding:9px 10px;border:0;background:transparent;color:var(--text,#e7e9eb);font:inherit;text-align:left;text-decoration:none;cursor:pointer;box-sizing:border-box}
        .language-choice[aria-pressed="true"]{color:var(--accent,#d6c7a0)}.language-choice:hover,.language-control .translation-guide-link:hover{background:var(--panel-hover,#242a30);color:var(--accent,#d6c7a0)}
        .language-control .translation-guide-link{margin-top:5px;border-top:1px solid var(--border,#343a40);padding-top:12px}
        @media(max-width:600px){.language-control{width:calc(100% - 28px);margin-top:8px}.language-menu{left:auto;right:0}}
      `;
      document.head.append(style);
    }
    const toggle = control.querySelector(".language-toggle");
    const menu = control.querySelector(".language-menu");
    toggle.addEventListener("click", () => {
      const open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    control.querySelectorAll(".language-choice").forEach(button => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.language);
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", event => {
      if (!control.contains(event.target)) {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
  function init() {
    addLanguageMenu();
    applyLanguage(currentLanguage);
    const observer = new MutationObserver(records => {
      if (records.some(record => record.type === "childList" || record.type === "characterData")) {
        translateTextNodes();
        translateAttributes();
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
