"use strict";

/*
 * PROJECT SEVEN SINS: Author Terminal
 * Replace author/script.js with this file.
 * All command response texts are grouped in AUTHOR_CONTENT.
 */

(() => {
  // ---------------------------------------------------------------------------
  // НАСТРОЙКИ
  // ---------------------------------------------------------------------------

  const CONFIG = {
    charDelay: 30,
    defaultPause: 500,
    maxPause: 10000,
    linePause: 150,
    punctuationPause: 90,
    clockInterval: 1000
  };

  // ---------------------------------------------------------------------------
  // ТЕКСТЫ ТЕРМИНАЛА
  // Редактируй здесь ответы команд, приветствие и описания.
  // ---------------------------------------------------------------------------

  const AUTHOR_CONTENT = {
    help: [
      "AVAILABLE COMMANDS",
      "",
      "help       Справка",
      "whoami     Идентификатор посетителя",
      "project    О проекте",
      "contents   Разделы сайта",
      "inspect    Состояние терминала",
      "records    Открытые записи",
      "access     Состояние доступа",
      "trace      Информация о сеансе",
      "about      Об авторе",
      "links      Внешние ресурсы",
      "contact    Контакты",
      "clear      Очистка экрана",
      "history    История команд",
      "",
      "Справка может содержать не все возможности."
    ].join("\n"),

    helpDescriptions: {
      help: "Показывает список публичных команд.",
      whoami: "Показывает локальный идентификатор посетителя.",
      project: "Выводит описание проекта.",
      contents: "Показывает ссылки на существующие разделы сайта.",
      inspect: "Показывает состояние терминала.",
      records: "Перечисляет открытые записи.",
      access: "Показывает состояние доступа.",
      trace: "Показывает сведения о текущем сеансе.",
      root: "Симулирует запрос расширенного доступа.",
      protocol: "Обращается к записи протокола.",
      reveal: "Проверяет доступные секретные записи.",
      sudo: "Симулирует запрос повышения привилегий.",
      clear: "Очищает экран терминала.",
      history: "Показывает историю введённых команд.",
      about: "Открывает авторское описание.",
      links: "Показывает внешние ресурсы автора.",
      contact: "Показывает способы связи с автором."
    },

    helpFor: target =>
      `HELP: ${target}\n\n${AUTHOR_CONTENT.helpDescriptions[target]}`,

    helpMissing: target =>
      `Справка для '${target}' отсутствует.`,

    whoami: () =>
      `IDENTITY CHECK\n\nIdentifier: ${username}\nLocal identity: ${
        username === "guest" ? "NOT REGISTERED" : "REGISTERED"
      }\n\nИдентификатор хранится только в браузере этого устройства.`,

    project: "PROJECT SEVEN SINS\n\n{pause:700ms}Project classification: AUTHORIAL\nStatus: ACTIVE DEVELOPMENT\n\nSeven concepts.\nSeven paths.\nOne archive of unfinished truths.\n\nЭто авторский проект, объединяющий персонажей,\nих истории и самостоятельные вымышленные вселенные.\n\nКаждая запись является частью более обширной структуры.\nНекоторые сведения доступны открыто.\nДругие пока остаются за пределами публичного доступа.\n\n{pause:900ms}Для просмотра доступных материалов используйте contents.\nДля изучения открытых записей используйте records.\n\n{pause:500ms}The archive remains incomplete.",

    contents: "ARCHIVE CONTENTS\n\n01 / CHARACTER RECORDS\n02 / UNIVERSE RECORDS\n03 / RESTRICTED RECORDS\n\nThe archive is under active development.\nAvailability depends on the records currently published.",

    inspect: () => "TERMINAL INSPECTION\n\nSystem status: " + (isPrinting ? "TRANSMITTING" : "READY") + "\nIdentity: " + username + "\nCommands this session: " + commandHistory.length + "\nUnlocked records: " + getSecretState().unlocked.length + "\n\nAll systems report their current state.\nInspection complete.",

    records: state => ["RECORD INDEX", "", "Archive status: " + (SECRET_RECORDS.length ? "POPULATED" : "EMPTY"), "Unlocked records: " + state.unlocked.length, "", ...(state.unlocked.length ? state.unlocked.map(id => "- " + id) : ["No records have been unlocked."]), "", "Record index complete."].join("\n"),

    access: () => "ACCESS REPORT\n\nPublic channel: AVAILABLE\nIdentity: " + (username === "guest" ? "GUEST" : "REGISTERED") + "\nRestricted records: " + (SECRET_RECORDS.length ? "CONFIGURED" : "NOT CONFIGURED") + "\n\nAccess levels are part of the terminal interface.\nAuthorization report complete.",

    trace: () =>
      `SESSION TRACE\n\nStorage: LOCAL BROWSER\nCommand history: ACTIVE\nRemote connection: NOT IMPLEMENTED\nTimestamp: ${new Date().toLocaleString()}`,

    root:
      "PRIVILEGE REQUEST\n\nЗапрос получен.\n{pause:700ms}\nРасширенный доступ не настроен.\n\nНаличие команды не означает наличие полномочий.",

    protocol: "PROTOCOL RECORD\n\n{pause:700ms}Classification: AUTHORIAL\nСтатус протокола: АКТИВЕН\n\n{pause:500ms}Этот документ не устанавливает универсальную истину.\nОн фиксирует правила, определённые автором.\n\n{pause:900ms}Архив содержит множество миров.\nКаждый мир подчиняется собственной внутренней логике.\nКаждый персонаж существует в рамках установленного канона.\n\n{pause:700ms}Неподтверждённые сведения остаются неподтверждёнными.\nПредположения не являются фактами.\nОтсутствие записи не даёт права выдумывать её содержание.\n\n{pause:900ms}Целостность протокола: СОХРАНЕНА.",

    reveal: state =>
      state.unlocked.length
        ? `REVEAL\n\nНайденных записей: ${state.unlocked.length}\nВведите records для просмотра списка.`
        : "REVEAL\n\nНет доступных записей для раскрытия.\nСекретные условия и записи ещё не настроены автором.",

    sudo: "PRIVILEGE ESCALATION\n\n{pause:700ms}Запрос на повышение привилегий принят.\nПроверка полномочий...\n\n{pause:900ms}ACCESS DENIED\n\nНедостаточно оснований для изменения уровня доступа.\n\n{pause:700ms}Система продолжает работу в штатном режиме.\nПопытка зарегистрирована.",

    history: () =>
      commandHistory.length
        ? [
            "COMMAND HISTORY",
            "",
            ...commandHistory.map(
              (item, index) =>
                `${String(index + 1).padStart(2, "0")}  ${item}`
            )
          ].join("\n")
        : "История команд пуста.",

    about:
      "AUTHOR PROFILE\n\nАвторский профиль пока не заполнен.",

    links:
      "EXTERNAL RESOURCES\n\nВнешние ссылки автора пока не добавлены.",

    contact:
      "CONTACT CHANNEL\n\nСпособы связи пока не указаны автором.",

    commandNotFound: command =>
      `COMMAND NOT FOUND: ${command}\n\nВведите help для просмотра публичных команд.`,

    boot: () =>
      [
        "PSS AUTHOR CHANNEL",
        "{pause:400ms}",
        "Инициализация терминала...",
        "{pause:450ms}",
        "Проверка локального идентификатора: OK",
        "{pause:350ms}",
        "",
        "Соединение установлено.",
        "{pause:600ms}",
        `Добро пожаловать, ${username}.`,
        "",
        "Введите help для просмотра публичных команд."
      ].join("\n")
  };

  // ---------------------------------------------------------------------------
  // ССЫЛКИ И СЕКРЕТНЫЕ ЗАПИСИ
  // ---------------------------------------------------------------------------

  // Добавляй сюда только реальные ссылки.
  // Пример:
  // { label: "GitHub", url: "https://github.com/username" }

  const AUTHOR_LINKS = [];

  // Секретные записи и условия их открытия пока не настроены.
  const SECRET_RECORDS = [];

  // ---------------------------------------------------------------------------
  // HTML-ЭЛЕМЕНТЫ
  // ---------------------------------------------------------------------------

  const output = document.getElementById("terminal-output");
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");
  const submit = document.getElementById("terminal-submit");
  const usernameElement = document.getElementById("terminal-username");
  const statusElement = document.getElementById("system-status");
  const clockElement = document.getElementById("terminal-clock");

  if (
    !output ||
    !form ||
    !input ||
    !submit ||
    !usernameElement ||
    !statusElement
  ) {
    console.error(
      "[PSS] Author terminal: required HTML elements are missing."
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // ЛОКАЛЬНЫЕ ДАННЫЕ
  // ---------------------------------------------------------------------------

  const STORAGE = {
    username: "pss_identity_username_v1",
    secrets: "pss_author_secrets_v1"
  };

  const USERNAME_PATTERN = /^[A-Za-z]+(?:-[A-Za-z]+)*$/;

  let isPrinting = false;
  let skipRequested = false;
  let currentWait = null;
  let commandHistory = [];
  let historyPosition = 0;
  let instantMode = false;
  let runId = 0;

  function getUsername() {
    try {
      const value = localStorage.getItem(STORAGE.username);

      return value && USERNAME_PATTERN.test(value)
        ? value
        : "guest";
    } catch {
      return "guest";
    }
  }

  function getSecretState() {
    try {
      const value = localStorage.getItem(STORAGE.secrets);

      if (!value) {
        return { unlocked: [] };
      }

      const parsed = JSON.parse(value);

      if (!parsed || !Array.isArray(parsed.unlocked)) {
        return { unlocked: [] };
      }

      return {
        unlocked: parsed.unlocked.filter(
          id => typeof id === "string"
        )
      };
    } catch {
      return { unlocked: [] };
    }
  }

  function saveSecretState(state) {
    try {
      localStorage.setItem(
        STORAGE.secrets,
        JSON.stringify(state)
      );

      return true;
    } catch {
      return false;
    }
  }

  const username = getUsername();

  usernameElement.textContent = username;

  // ---------------------------------------------------------------------------
  // ВЫВОД ТЕКСТА
  // ---------------------------------------------------------------------------

  function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
  }

  function makeLine(className = "") {
    const line = document.createElement("div");

    line.className = "terminal-line";

    if (className) {
      line.classList.add(className);
    }

    output.appendChild(line);
    scrollToBottom();

    return line;
  }

  function appendPlainText(text, className = "") {
    for (const part of String(text).split("\n")) {
      const line = makeLine(className);
      line.textContent = part;
    }

    scrollToBottom();
  }

  function appendLinks(links) {
    for (const item of links) {
      if (
        !item ||
        typeof item.label !== "string" ||
        typeof item.url !== "string"
      ) {
        continue;
      }

      let url;

      try {
        url = new URL(item.url, window.location.href);
      } catch {
        continue;
      }

      if (!["https:", "http:"].includes(url.protocol)) {
        continue;
      }

      const line = makeLine("terminal-link-line");
      const anchor = document.createElement("a");

      anchor.className = "terminal-link";
      anchor.textContent = item.label;
      anchor.href = url.href;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";

      line.appendChild(anchor);
    }

    scrollToBottom();
  }

  function clearScreen() {
    output.replaceChildren();
  }

  // ---------------------------------------------------------------------------
  // ПАУЗЫ И ЭФФЕКТ ПЕЧАТИ
  // ---------------------------------------------------------------------------

  function wait(ms, thisRun) {
    return new Promise(resolve => {
      if (thisRun !== runId) {
        resolve(false);
        return;
      }

      if (skipRequested || ms <= 0) {
        resolve(true);
        return;
      }

      let settled = false;

      const finish = value => {
        if (settled) return;

        settled = true;

        if (currentWait && currentWait.finish === finish) {
          currentWait = null;
        }

        clearTimeout(timer);
        resolve(value);
      };

      const timer = setTimeout(
        () => finish(thisRun === runId),
        ms
      );

      currentWait = {
        finish: () => finish(true)
      };
    });
  }

  function requestFinish() {
    if (!isPrinting) return;

    skipRequested = true;

    if (currentWait) {
      currentWait.finish();
    }
  }

  function parsePause(value) {
    if (!value) {
      return CONFIG.defaultPause;
    }

    const match = value.match(
      /^\s*(\d+(?:\.\d+)?)\s*(ms|s)?\s*$/i
    );

    if (!match) {
      return CONFIG.defaultPause;
    }

    const amount = Number(match[1]);

    const milliseconds =
      (match[2] || "ms").toLowerCase() === "s"
        ? amount * 1000
        : amount;

    return Math.max(
      0,
      Math.min(milliseconds, CONFIG.maxPause)
    );
  }

  function tokenize(text) {
    const tokens = [];

    const pattern =
      /\{(pause(?::[^}]*)?|instant|typewriter|clear)\}/gi;

    let cursor = 0;
    let match;

    while ((match = pattern.exec(String(text))) !== null) {
      if (match.index > cursor) {
        tokens.push({
          type: "text",
          value: String(text).slice(cursor, match.index)
        });
      }

      const marker = match[1].toLowerCase();

      if (
        marker === "instant" ||
        marker === "typewriter" ||
        marker === "clear"
      ) {
        tokens.push({ type: marker });
      } else {
        const colon = marker.indexOf(":");

        tokens.push({
          type: "pause",
          duration:
            colon === -1
              ? CONFIG.defaultPause
              : parsePause(marker.slice(colon + 1))
        });
      }

      cursor = pattern.lastIndex;
    }

    if (cursor < String(text).length) {
      tokens.push({
        type: "text",
        value: String(text).slice(cursor)
      });
    }

    return tokens;
  }

  async function renderText(text, thisRun, className = "") {
    for (const token of tokenize(text)) {
      if (thisRun !== runId) return;

      if (token.type === "pause") {
        if (!(await wait(token.duration, thisRun))) {
          return;
        }

        continue;
      }

      if (token.type === "instant") {
        instantMode = true;
        continue;
      }

      if (token.type === "typewriter") {
        instantMode = false;
        continue;
      }

      if (token.type === "clear") {
        clearScreen();
        continue;
      }

      const lines = token.value.split("\n");

      for (
        let lineIndex = 0;
        lineIndex < lines.length;
        lineIndex++
      ) {
        if (thisRun !== runId) return;

        const value = lines[lineIndex];
        const line = makeLine(className);

        if (
          instantMode ||
          skipRequested ||
          CONFIG.charDelay <= 0
        ) {
          line.textContent = value;
        } else {
          for (
            let index = 0;
            index < value.length;
            index++
          ) {
            if (thisRun !== runId) return;

            if (skipRequested) {
              line.textContent = value;
              break;
            }

            line.textContent += value[index];
            scrollToBottom();

            let delay = CONFIG.charDelay;

            if (/[.!?…]/.test(value[index])) {
              delay += CONFIG.punctuationPause;
            }

            if (!(await wait(delay, thisRun))) {
              return;
            }
          }
        }

        scrollToBottom();

        if (
          lineIndex < lines.length - 1 &&
          !skipRequested
        ) {
          if (!(await wait(CONFIG.linePause, thisRun))) {
            return;
          }
        }
      }
    }
  }

  async function printResponse(response, options = {}) {
    if (isPrinting) {
      requestFinish();
    }

    const thisRun = ++runId;

    isPrinting = true;
    skipRequested = false;
    instantMode = false;

    statusElement.textContent = "TRANSMITTING";

    if (
      options.spacing !== false &&
      output.childElementCount > 0
    ) {
      makeLine();
    }

    try {
      if (typeof response === "string") {
        await renderText(
          response,
          thisRun,
          options.className || ""
        );
      } else if (
        response &&
        typeof response === "object"
      ) {
        if (response.text) {
          await renderText(
            response.text,
            thisRun,
            options.className || ""
          );
        }

        if (response.links && response.links.length) {
          appendLinks(response.links);
        }
      }
    } finally {
      if (thisRun === runId) {
        isPrinting = false;
        skipRequested = false;
        instantMode = false;
        currentWait = null;

        statusElement.textContent = "READY";
        input.disabled = false;
        submit.disabled = false;

        scrollToBottom();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // КОМАНДЫ
  // ---------------------------------------------------------------------------

  const PUBLIC_COMMANDS = [
    "help",
    "whoami",
    "project",
    "contents",
    "inspect",
    "records",
    "access",
    "trace",
    "clear",
    "history",
    "about",
    "links",
    "contact"
  ];

  function getResponse(command, args) {
    const state = getSecretState();

    if (command === "help") {
      if (args) {
        const target = args.toLowerCase();

        if (PUBLIC_COMMANDS.includes(target)) {
          return AUTHOR_CONTENT.helpFor(target);
        }

        return AUTHOR_CONTENT.helpMissing(target);
      }

      return AUTHOR_CONTENT.help;
    }

    switch (command) {
      case "whoami":
        return AUTHOR_CONTENT.whoami();

      case "project":
        return AUTHOR_CONTENT.project;

      case "contents":
        return AUTHOR_CONTENT.contents;

      case "inspect":
        return AUTHOR_CONTENT.inspect();

      case "records":
        return AUTHOR_CONTENT.records(state);

      case "access":
        return AUTHOR_CONTENT.access();

      case "trace":
        return AUTHOR_CONTENT.trace();

      case "root":
        return AUTHOR_CONTENT.root;

      case "protocol":
        return AUTHOR_CONTENT.protocol;

      case "reveal":
        return AUTHOR_CONTENT.reveal(state);

      case "sudo":
        return AUTHOR_CONTENT.sudo;

      case "clear":
        clearScreen();
        return "";

      case "history":
        return AUTHOR_CONTENT.history();

      case "about":
        return AUTHOR_CONTENT.about;

      case "links":
        return AUTHOR_LINKS.length
          ? {
              text: "EXTERNAL RESOURCES",
              links: AUTHOR_LINKS
            }
          : AUTHOR_CONTENT.links;

      case "contact":
        return AUTHOR_CONTENT.contact;

      default:
        return AUTHOR_CONTENT.commandNotFound(command);
    }
  }

  function echoCommand(command) {
    const line = makeLine("terminal-command");

    const prompt = document.createElement("span");

    prompt.className = "terminal-prompt-output";
    prompt.textContent = `${username}@PSS:~$ `;

    const entered = document.createElement("span");

    entered.textContent = command;

    line.append(prompt, entered);
  }

  async function executeCommand(raw) {
    const normalized = raw.trim().replace(/\s+/g, " ");

    if (!normalized) return;

    echoCommand(normalized);

    commandHistory.push(normalized);
    historyPosition = commandHistory.length;

    const [name, ...argumentParts] = normalized.split(" ");

    const command = name.toLowerCase();
    const args = argumentParts.join(" ");

    const response = getResponse(command, args);

    if (response === "") {
      statusElement.textContent = "READY";
      input.focus();
      return;
    }

    await printResponse(response);

    input.focus();
  }

  // ---------------------------------------------------------------------------
  // ВВОД КОМАНД И ИСТОРИЯ
  // ---------------------------------------------------------------------------

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (isPrinting) {
      // Первый Enter завершает текущую печать.
      // Введённая команда сохраняется и не выполняется.
      requestFinish();
      return;
    }

    const command = input.value;

    input.value = "";

    void executeCommand(command);
  });

  input.addEventListener("keydown", event => {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!commandHistory.length) return;

      historyPosition = Math.max(
        0,
        historyPosition - 1
      );

      input.value =
        commandHistory[historyPosition] || "";
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      historyPosition = Math.min(
        commandHistory.length,
        historyPosition + 1
      );

      input.value =
        commandHistory[historyPosition] || "";
    }
  });

  // ---------------------------------------------------------------------------
  // ЧАСЫ
  // ---------------------------------------------------------------------------

  function updateClock() {
    if (!clockElement) return;

    clockElement.textContent =
      new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
  }

  updateClock();

  window.setInterval(
    updateClock,
    CONFIG.clockInterval
  );

  // ---------------------------------------------------------------------------
  // ЗАПУСК ТЕРМИНАЛА
  // ---------------------------------------------------------------------------

  async function boot() {
    input.disabled = false;
    submit.disabled = false;

    statusElement.textContent = "CONNECTING";

    await printResponse(
      AUTHOR_CONTENT.boot(),
      { spacing: false }
    );

    input.focus();
  }

  void boot();
})();