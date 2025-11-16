// Navigation data
const navigation = [
    { href: 'index.html', icon: 'home', text: 'Home' },
    { href: 'proyectos.html', icon: 'briefcase', text: 'Proyectos' },
    { href: 'sobre-mi.html', icon: 'code', text: 'Sobre mí' }
];

const favorites = [
    { href: 'https://github.com/DavidDevGt', icon: 'github', text: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/jdavidvl/', icon: 'briefcase', text: 'LinkedIn', external: true },
    { href: 'mailto:josuedavidvl18@gmail.com', icon: 'mail', text: 'Email', external: true }
];

// Generate sidebar HTML
function generateSidebar() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    return `
    <aside class="sidebar border-r border-[var(--ui-border)] bg-[var(--ui-sidebar-bg)] flex flex-col overflow-y-auto" style="view-transition-name: sidebar">
      <!-- Top Section -->
      <div class="p-3">
        <div class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--ui-hover)] cursor-pointer mb-1">
          <i data-lucide="user" class="w-4 h-4 align-middle text-[var(--text-secondary)]"></i>
          <span class="text-sm font-medium">davidwebgt</span>
        </div>

        <div onclick="openSearchModal()" class="px-2 py-1.5 rounded hover:bg-[var(--ui-hover)] cursor-pointer text-sm text-[var(--text-secondary)] flex items-center gap-2">
           <i data-lucide="search" class="w-4 h-4 align-middle text-[var(--text-secondary)]"></i>
           <span>Buscar</span>
           <span class="ml-auto text-xs">⌘K</span>
         </div>
      </div>

      <!-- Navigation -->
      <nav class="px-3 space-y-0.5">
        <div class="text-xs font-semibold text-[var(--text-tertiary)] px-2 py-1.5 uppercase tracking-wide">
          Workspace
        </div>

        ${navigation.map(item => `
          <a href="${item.href}" class="nav-link flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--ui-hover)] cursor-pointer text-sm ${item.href === currentPath ? 'bg-[var(--ui-hover)]' : ''}">
            <i data-lucide="${item.icon}" class="w-4 h-4 shrink-0 align-middle text-[var(--text-secondary)]"></i>
            <span>${item.text}</span>
          </a>
        `).join('')}

        <div class="notion-divider my-2"></div>

        <div class="text-xs font-semibold text-[var(--text-tertiary)] px-2 py-1.5 uppercase tracking-wide">
          Favoritos
        </div>

        ${favorites.map(item => `
          <a href="${item.href}" ${item.external ? 'target="_blank"' : ''} class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--ui-hover)] cursor-pointer text-sm">
            <i data-lucide="${item.icon}" class="w-4 h-4 shrink-0 align-middle text-[var(--text-secondary)]"></i>
            <span>${item.text}</span>
          </a>
        `).join('')}
      </nav>

      <!-- Bottom Section -->
      <div class="mt-auto p-3 border-t border-[var(--ui-border)]">
        <button onclick="toggleTheme()"
                class="w-full text-sm px-2 py-1.5 rounded hover:bg-[var(--ui-hover)] cursor-pointer text-left flex items-center gap-2">
          <i id="theme-icon" data-lucide="sun" class="w-4 h-4 align-middle text-[var(--text-secondary)]"></i>
          <span id="theme-text">Cambiar Tema</span>
        </button>
      </div>
    </aside>
  `;
}

// Generate topbar HTML
function generateTopbar(breadcrumb) {
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'es';
    const fallbacks = {
      es: {
        readingMode: 'Modo Lectura',
        exitReadingMode: 'Salir Modo Lectura',
        share: 'Compartir',
        downloadCV: 'Descargar CV',
        viewSource: 'Ver Código',
        home: 'Inicio',
        projects: 'Mis Proyectos',
        about: 'Sobre mí',
        workspace: 'Workspace'
      },
      en: {
        readingMode: 'Reading Mode',
        exitReadingMode: 'Exit Reading Mode',
        share: 'Share',
        downloadCV: 'Download CV',
        viewSource: 'View Source',
        home: 'Home',
        projects: 'Projects',
        about: 'About',
        workspace: 'Workspace'
      }
    };
    const langFallbacks = fallbacks[currentLang] || fallbacks.es;

    const readingModeEnabled = localStorage.getItem('readingMode') === 'true';
    const readingIcon = readingModeEnabled ? 'book' : 'book-open';
    const readingText = window.i18n ? window.i18n.t(readingModeEnabled ? 'nav.exitReadingMode' : 'nav.readingMode', readingModeEnabled ? langFallbacks.exitReadingMode : langFallbacks.readingMode) : (readingModeEnabled ? langFallbacks.exitReadingMode : langFallbacks.readingMode);
    const shareText = window.i18n ? window.i18n.t('nav.share', langFallbacks.share) : langFallbacks.share;
    const downloadText = window.i18n ? window.i18n.t('nav.downloadCV', langFallbacks.downloadCV) : langFallbacks.downloadCV;
    const viewSourceText = window.i18n ? window.i18n.t('nav.viewSource', langFallbacks.viewSource) : langFallbacks.viewSource;

    const breadcrumbFallbacks = {
      'nav.home': langFallbacks.home,
      'nav.projects': langFallbacks.projects,
      'nav.about': langFallbacks.about,
      'common.workspace': langFallbacks.workspace
    };

    return `
    <header role="banner" data-breadcrumb='${JSON.stringify(breadcrumb).replace(/'/g, "'")}'>
      <div class="sticky top-0 z-10 bg-[var(--page-bg)]/80 backdrop-blur-sm border-b border-[var(--ui-border)] px-8 py-2" style="view-transition-name: topbar">
        <div class="max-w-[var(--notion-max-width)] mx-auto flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        ${breadcrumb.map((item, index) => {
        const isLast = index === breadcrumb.length - 1;
        const translatedItem = window.i18n ? window.i18n.t(item, breadcrumbFallbacks[item] || item) : (breadcrumbFallbacks[item] || item);
        const clickHandler = !isLast && index === 0 ? 'onclick="window.location.href=\'index.html\'"' : '';
        return `
            <span class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer ${isLast ? 'text-[var(--text-primary)]' : ''}" ${clickHandler}>${translatedItem}</span>
            ${!isLast ? '<span>/</span>' : ''}
          `;
    }).join('')}
        <div class="ml-auto flex items-center gap-2 relative">
          <button onclick="sharePage()" class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer">${shareText}</button>
          <div class="relative">
            <button onclick="toggleOptionsMenu()" class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer" id="options-btn">•••</button>
            <div id="options-menu" class="absolute right-0 top-full mt-1 py-1 hidden z-10">
              <button onclick="downloadCV()">
                <i data-lucide="download"></i>
                <span>${downloadText}</span>
              </button>
              <button onclick="toggleReadingMode()" id="reading-mode-btn">
                <i data-lucide="${readingIcon}"></i>
                <span>${readingText}</span>
              </button>
              <button onclick="viewSourceCode()">
                <i data-lucide="code"></i>
                <span>${viewSourceText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}

function toggleList(element) {
    const arrow = element.querySelector('.toggle-arrow');
    const content = element.nextElementSibling;

    if (content.classList.contains('open')) {
        content.classList.remove('open');
        arrow.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('open');
        arrow.style.transform = 'rotate(90deg)';
    }
}

// Update topbar function
function updateTopbar() {
  const topbarEl = document.querySelector('header[role="banner"]');
  if (topbarEl) {
    const breadcrumbData = topbarEl.dataset.breadcrumb;
    if (breadcrumbData) {
      try {
        const breadcrumb = JSON.parse(breadcrumbData);
        topbarEl.outerHTML = generateTopbar(breadcrumb);
        // Re-create icons after updating topbar
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
      } catch (e) {
        console.warn('Error updating topbar:', e);
      }
    }
  }
}

// Make updateTopbar globally available
window.updateTopbar = updateTopbar;

// Insert topbar on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    const topbarEl = document.getElementById('topbar-placeholder');
    if (topbarEl) {
        let breadcrumb = ['Workspace'];
        try {
            const data = topbarEl.dataset.breadcrumb;
            if (data) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                    breadcrumb = parsed;
                }
            }
        } catch (e) {
            console.warn('Invalid breadcrumb data:', e);
        }
        topbarEl.outerHTML = generateTopbar(breadcrumb);
        // Create icons after inserting topbar
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
    }
});