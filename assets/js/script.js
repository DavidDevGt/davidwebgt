/**
 * Archivo principal de inicialización del sitio web.
 * Registra el service worker, configura event listeners y inicializa componentes.
 */

document.addEventListener('DOMContentLoaded', function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
      .then(registration => {
      })
      .catch(error => {
      });
  }

  if (window.i18n && window.i18n.isLoaded) {
    updateOptionsMenu();
  } else {
    window.addEventListener('i18nReady', updateOptionsMenu);
  }

  const toggleButtons = document.querySelectorAll('.toggle-trigger');
  toggleButtons.forEach(button => {
    button.addEventListener('click', function () {
      toggleList(this);
    });
  });

  const editables = document.querySelectorAll('[contenteditable="true"]');
  editables.forEach(el => {
    if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      });
    }
  });

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
});