/**
 * Archivo principal de inicialización del sitio web.
 * Registra el service worker, configura event listeners y inicializa componentes.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Handle anchor scrolling after full page load
  window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          // Add highlight effect
          element.style.transition = 'background-color 0.5s ease, box-shadow 0.5s ease';
          const originalBg = element.style.backgroundColor;
          const originalShadow = element.style.boxShadow;
          element.style.backgroundColor = 'var(--accent-blue-light)';
          element.style.boxShadow = '0 0 0 2px var(--accent-blue)';
          setTimeout(() => {
            element.style.backgroundColor = originalBg;
            element.style.boxShadow = originalShadow;
          }, 3000);
        }
      }, 500);
    }
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
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

  // Handle clicks on anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.hash && link.hash.startsWith('#')) {
      // Small delay to allow navigation
      setTimeout(() => {
        const element = document.querySelector(link.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          // Add highlight effect
          element.style.transition = 'background-color 0.5s ease';
          const originalBg = element.style.backgroundColor;
          element.style.backgroundColor = 'var(--accent-blue-light)';
          setTimeout(() => {
            element.style.backgroundColor = originalBg;
          }, 2000);
        }
      }, 100);
    }
  });

  // Handle anchor scrolling for search results
  const hash = window.location.hash;
  if (hash) {
    // Function to attempt scrolling to element
    const scrollToElement = (element, attempt = 1) => {
      if (!element) {
        console.warn('Element not found for hash:', hash);
        return;
      }

      // Check if element is visible (not hidden by CSS)
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
        console.warn('Element is hidden, cannot scroll to:', hash);
        return;
      }

      // Check if element is within a scrollable container that might prevent scrolling
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.overflow === 'hidden' || parentStyle.overflowY === 'hidden') {
          console.warn('Element is inside a container with overflow:hidden, scrolling may not work:', hash);
          break;
        }
        parent = parent.parentElement;
      }

      // Get element position relative to viewport
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (!isVisible || attempt <= 3) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });

        // Add temporary highlight effect
        element.style.transition = 'background-color 0.5s ease, box-shadow 0.5s ease';
        const originalBg = element.style.backgroundColor;
        const originalShadow = element.style.boxShadow;

        element.style.backgroundColor = 'var(--accent-blue-light)';
        element.style.boxShadow = '0 0 0 2px var(--accent-blue)';

        // Remove highlight after animation
        setTimeout(() => {
          element.style.backgroundColor = originalBg;
          element.style.boxShadow = originalShadow;
        }, 3000);

        console.log('Scrolled to element:', hash, 'attempt:', attempt);
      }

      // If still not visible after first attempt, try again
      if (!isVisible && attempt < 3) {
        setTimeout(() => scrollToElement(element, attempt + 1), 1000);
      }
    };

    // Try multiple times with increasing delays
    const tryScroll = (attempt = 1) => {
      const element = document.querySelector(hash);
      if (element) {
        // Wait a bit more for dynamic content to load
        setTimeout(() => scrollToElement(element, attempt), 100);
      } else if (attempt < 5) {
        // Element not found yet, try again
        setTimeout(() => tryScroll(attempt + 1), 200 * attempt);
      } else {
        console.warn('Could not find element after 5 attempts:', hash);
        // Fallback: try native browser scroll
        if (attempt === 5) {
          try {
            window.location.hash = hash;
          } catch (e) {
            console.warn('Native scroll fallback also failed:', e);
          }
        }
      }
    };

    // Start trying after initial page load
    setTimeout(() => tryScroll(), 300);
  }
});