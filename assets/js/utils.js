// Intersection Observer for stagger animations
document.addEventListener('DOMContentLoaded', function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        staggerAnimateBlocks();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe the main content area
  const main = document.querySelector('main');
  if (main) {
    observer.observe(main);
  }
});

// Stagger animation function for all blocks
function staggerAnimateBlocks() {
  const blocks = document.querySelectorAll('.notion-block');
  blocks.forEach((block, index) => {
    setTimeout(() => {
      block.classList.add('animate-in');
    }, index * 100); // 100ms stagger
  });
}

// Share page functionality
function sharePage() {
  const url = window.location.href;
  const title = document.title;

  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    }).catch(console.error);
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      // Show temporary feedback
      showShareFeedback('Enlace copiado al portapapeles');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showShareFeedback('Enlace copiado al portapapeles');
    });
  }
}

function showShareFeedback(message) {
  const feedback = document.createElement('div');
  feedback.textContent = window.i18n ? window.i18n.t('common.linkCopied') : message;
  feedback.className = 'fixed top-4 right-4 bg-[var(--accent-blue)] text-white px-4 py-2 rounded shadow-lg z-50';
  document.body.appendChild(feedback);
  setTimeout(() => {
    document.body.removeChild(feedback);
  }, 2000);
}

// Options menu functions
function toggleOptionsMenu() {
  const menu = document.getElementById('options-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function downloadCV() {
  // Download CV PDF (replace with your actual CV file)
  const link = document.createElement('a');
  link.href = 'assets/cv.pdf';
  link.download = 'David_Vargas_CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  closeOptionsMenu();
}

// Update options menu text
function updateOptionsMenu() {
  // Reading mode
  const readingModeEnabled = localStorage.getItem('readingMode') === 'true';
  const readingBtn = document.getElementById('reading-mode-btn');
  if (readingBtn) {
    const icon = readingModeEnabled ? 'book' : 'book-open';
    const text = window.i18n ? window.i18n.t(readingModeEnabled ? 'nav.exitReadingMode' : 'nav.readingMode') : (readingModeEnabled ? 'Salir Modo Lectura' : 'Modo Lectura');
    readingBtn.innerHTML = `<i data-lucide="${icon}"></i><span>${text}</span>`;
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Theme
  const isDark = document.documentElement.classList.contains('dark');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  if (themeIcon && themeText) {
    themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    themeText.textContent = window.i18n ? window.i18n.t('nav.theme') : 'Cambiar Tema';
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
}

function toggleReadingMode() {
    const body = document.body;
    const isReadingMode = body.classList.contains('reading-mode');

    if (isReadingMode) {
        // Exit reading mode
        body.classList.remove('reading-mode');
        localStorage.setItem('readingMode', 'false');
    } else {
        // Enter reading mode
        body.classList.add('reading-mode');
        localStorage.setItem('readingMode', 'true');
    }

    updateOptionsMenu();
    closeOptionsMenu();
}

// Validate reading mode
function getValidatedReadingMode() {
    const saved = localStorage.getItem('readingMode');
    return saved === 'true';
}

function viewSourceCode() {
  window.open('https://github.com/DavidDevGt/davidwebgt', '_blank');
  closeOptionsMenu();
}

function closeOptionsMenu() {
  const menu = document.getElementById('options-menu');
  if (menu) {
    menu.classList.add('hidden');
  }
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('options-menu');
  const btn = document.getElementById('options-btn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    closeOptionsMenu();
  }
});

// Add ⌘K listener
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearchModal();
  }
});

// Make updateOptionsMenu globally available
window.updateOptionsMenu = updateOptionsMenu;