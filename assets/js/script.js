// Main initialization script
document.addEventListener('DOMContentLoaded', function () {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
      .then(registration => {
        // Service Worker registered
      })
      .catch(error => {
        // Service Worker registration failed
      });
  }

  // Update options menu when i18n is ready
  if (window.i18n && window.i18n.isLoaded) {
    updateOptionsMenu();
  } else {
    window.addEventListener('i18nReady', updateOptionsMenu);
  }

  // Toggle list functionality
  const toggleButtons = document.querySelectorAll('.toggle-trigger');
  toggleButtons.forEach(button => {
    button.addEventListener('click', function () {
      toggleList(this);
    });
  });

  // Prevent line breaks in headings
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

  // Create Lucide icons after DOM is ready
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
});