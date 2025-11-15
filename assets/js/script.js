// Main initialization script
document.addEventListener('DOMContentLoaded', function () {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }

  // Insert topbar
  const topbarEl = document.getElementById('topbar-placeholder');
  if (topbarEl) {
    const breadcrumb = topbarEl.dataset.breadcrumb ? JSON.parse(topbarEl.dataset.breadcrumb) : ['Workspace'];
    topbarEl.outerHTML = generateTopbar(breadcrumb);
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