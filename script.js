
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
