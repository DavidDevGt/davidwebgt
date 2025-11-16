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

  const main = document.querySelector('main');
  if (main) {
    observer.observe(main);
  }
});

/**
 * Anima los bloques de contenido con un retraso escalonado.
 */
function staggerAnimateBlocks() {
  const blocks = document.querySelectorAll('.notion-block');
  blocks.forEach((block, index) => {
    setTimeout(() => {
      block.classList.add('animate-in');
    }, index * 100);
  });
}

/**
 * Comparte la página actual usando la API nativa o clipboard.
 */
function sharePage() {
  const url = window.location.href;
  const title = document.title;

  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showShareFeedback('Enlace copiado al portapapeles');
    }).catch(() => {
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

/**
 * Muestra un mensaje de feedback temporal después de compartir.
 * @param {string} message - Mensaje a mostrar.
 */
function showShareFeedback(message) {
  const feedback = document.createElement('div');
  feedback.textContent = window.i18n ? window.i18n.t('common.linkCopied') : message;
  feedback.className = 'fixed top-4 right-4 bg-[var(--accent-blue)] text-white px-4 py-2 rounded shadow-lg z-50';
  document.body.appendChild(feedback);
  setTimeout(() => {
    document.body.removeChild(feedback);
  }, 2000);
}

/**
 * Alterna la visibilidad del menú de opciones.
 */
function toggleOptionsMenu() {
  const menu = document.getElementById('options-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

/**
 * Descarga el CV creando un enlace temporal.
 */
function downloadCV() {
  const link = document.createElement('a');
  link.href = 'assets/cv.pdf';
  link.download = 'David_Vargas_CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  closeOptionsMenu();
}

/**
 * Actualiza el menú de opciones con el estado actual de tema y modo lectura.
 */
function updateOptionsMenu() {
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

/**
 * Alterna el modo de lectura guardando en localStorage.
 */
function toggleReadingMode() {
    const body = document.body;
    const isReadingMode = body.classList.contains('reading-mode');

    if (isReadingMode) {
        body.classList.remove('reading-mode');
        localStorage.setItem('readingMode', 'false');
    } else {
        body.classList.add('reading-mode');
        localStorage.setItem('readingMode', 'true');
    }

    updateOptionsMenu();
    closeOptionsMenu();
}

/**
 * Obtiene el estado validado del modo lectura.
 * @returns {boolean} True si está habilitado.
 */
function getValidatedReadingMode() {
    const saved = localStorage.getItem('readingMode');
    return saved === 'true';
}

/**
 * Abre el repositorio de GitHub en una nueva pestaña.
 */
function viewSourceCode() {
  window.open('https://github.com/DavidDevGt/davidwebgt', '_blank');
  closeOptionsMenu();
}

/**
 * Oculta el menú de opciones.
 */
function closeOptionsMenu() {
  const menu = document.getElementById('options-menu');
  if (menu) {
    menu.classList.add('hidden');
  }
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('options-menu');
  const btn = document.getElementById('options-btn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    closeOptionsMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearchModal();
  }
});

window.updateOptionsMenu = updateOptionsMenu;