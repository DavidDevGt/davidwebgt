// Main initialization script
document.addEventListener('DOMContentLoaded', function () {
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