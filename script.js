/* Показывает ссылку «Продолжить чтение» по сохранённому прогрессу. */
// Ключ должен совпадать с ключом прогресса в reading/script.js.
const PSS_PROGRESS_KEY = "pss_reading_furthest_v1";
const continueWrap = document.getElementById("continue-reading-wrap");
const continueLink = document.getElementById("continue-reading");
const continueNote = document.getElementById("continue-reading-note");

if (continueWrap && continueLink) {
  try {
    const progress = JSON.parse(localStorage.getItem(PSS_PROGRESS_KEY) || "null");
    if (progress && typeof progress.id === "string") {
      const script = document.createElement("script");
      script.src = "reading/materials.js";
      script.onload = () => {
        const materials = Array.isArray(window.PSS_MATERIALS) ? window.PSS_MATERIALS : [];
        const index = materials.findIndex(item => item && item.id === progress.id);
        if (index < 0) return;
        continueLink.href = `reading/index.html?id=${encodeURIComponent(progress.id)}`;
        continueWrap.hidden = false;
        if (continueNote) continueNote.textContent = `Позиция ${index + 1} из ${materials.length}: ${materials[index].title}`;
      };
      document.head.appendChild(script);
    }
  } catch (error) {
    console.warn("Не удалось прочитать сохранённый прогресс:", error);
  }
}


const siteBackButton = document.getElementById("site-back");

if (siteBackButton) {
  siteBackButton.addEventListener("click", () => {
    const referrer = document.referrer;

    if (referrer) {
      try {
        const previousPage = new URL(referrer);

        if (previousPage.origin === window.location.origin) {
          window.history.back();
          return;
        }
      } catch {
        // Если адрес предыдущей страницы не удалось проверить,
        // возвращаемся на главную.
      }
    }

    window.location.href = "../index.html";
  });
}


/* ===== Регистрация пользователя Project Seven Sins ===== */

(() => {
    const STORAGE_KEY = "pss_identity_username_v1";
    const USERNAME_PATTERN = /^[A-Za-z]+(?:-[A-Za-z]+)*$/;

    // Показывает или скрывает стартовый экран сайта.
    function initializeIdentityGate() {
        const gate = document.getElementById("identity-gate");

        // Страница без формы регистрации продолжает работать как обычно.
        if (!gate) return;

        const form = document.getElementById("identity-form");
        const input = document.getElementById("identity-username");
        const entrySection = document.getElementById("identity-entry");
        const confirmSection = document.getElementById("identity-confirm");
        const error = document.getElementById("identity-error");
        const confirmError = document.getElementById("identity-confirm-error");
        const selected = document.getElementById("identity-selected");
        const backButton = document.getElementById("identity-back");
        const finalizeButton = document.getElementById("identity-finalize");

        let pendingUsername = "";

        // Повторное посещение: использование ранее сохранённого имени.
        try {
            const savedUsername = localStorage.getItem(STORAGE_KEY);

            if (savedUsername && USERNAME_PATTERN.test(savedUsername)) {
                gate.remove();
                return;
            }
        } catch (storageError) {
            console.error("Identity storage unavailable:", storageError);
        }

        gate.hidden = false;
        document.body.style.overflow = "hidden";
        input.focus();

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            error.textContent = "";

            const username = input.value;

            if (!USERNAME_PATTERN.test(username)) {
                error.textContent =
                    "ОШИБКА: используйте только латинские буквы и одиночные дефисы между ними.";
                input.focus();
                return;
            }

            pendingUsername = username;
            selected.textContent = pendingUsername;

            entrySection.hidden = true;
            confirmSection.hidden = false;
            confirmError.textContent = "";
            finalizeButton.focus();
        });

        backButton.addEventListener("click", () => {
            confirmSection.hidden = true;
            entrySection.hidden = false;
            confirmError.textContent = "";
            input.focus();
        });

        finalizeButton.addEventListener("click", () => {
            if (!USERNAME_PATTERN.test(pendingUsername)) {
                confirmError.textContent =
                    "ОШИБКА: идентификатор недействителен. Вернитесь к вводу.";
                return;
            }

            try {
                localStorage.setItem(STORAGE_KEY, pendingUsername);
                gate.remove();
                document.body.style.overflow = "";
            } catch (storageError) {
                confirmError.textContent =
                    "ОШИБКА СОХРАНЕНИЯ: браузер не разрешил сохранить имя. Проверьте настройки хранения данных.";
                console.error("Could not save identity:", storageError);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeIdentityGate);
    } else {
        initializeIdentityGate();
    }
})();
