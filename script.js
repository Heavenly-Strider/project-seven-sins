
const upcomingPages = {
  "reading/index.html": "Раздел чтения ещё не создан.",
  "contents/index.html": "Содержание книги пока готовится.",
  "about/index.html": "Страница об авторе появится позже."
};

let noticeTimer;

document.querySelectorAll(".nav-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    const destination = card.getAttribute("href");

    if (!upcomingPages[destination]) {
      return;
    }

    event.preventDefault();
    showNotice(upcomingPages[destination]);
  });
});

function showNotice(message) {
  let notice = document.querySelector(".site-notice");

  if (!notice) {
    notice = document.createElement("div");
    notice.className = "site-notice";
    notice.setAttribute("role", "status");
    document.body.appendChild(notice);
  }

  notice.textContent = message;
  notice.classList.add("visible");

  clearTimeout(noticeTimer);

  noticeTimer = setTimeout(() => {
    notice.classList.remove("visible");
  }, 2800);
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


/* ===== Project Seven Sins: Identity Registration ===== */

(() => {
    const STORAGE_KEY = "pss_identity_username_v1";
    const USERNAME_PATTERN = /^[A-Za-z]+(?:-[A-Za-z]+)*$/;

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

        // Повторное посещение: используем ранее сохранённое имя.
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

                // Закрываем регистрацию только после успешного сохранения.
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
