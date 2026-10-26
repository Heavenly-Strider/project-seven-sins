// Единственная настройка версии сайта. Меняется только здесь.
window.PSS_CONFIG = { version: "0.8" };

// Номер версии выводится исключительно в футерах.
document.addEventListener("DOMContentLoaded", () => {
  const version = window.PSS_CONFIG.version;
  document.querySelectorAll("footer [data-site-brand], .content-footer [data-site-brand]").forEach(element => {
    element.textContent = `PROJECT SEVEN SINS · V${version}`;
  });
});
