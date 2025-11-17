/**
 * Array of objects defining the main navigation elements of the site.
 * Each object represents a navigation link with its path, icon, and text.
 * @constant {Array<{href: string, icon: string, text: string}>}
 */
const navigation = [
    { href: 'index.html', icon: 'home', text: 'Home' },
    { href: 'proyectos.html', icon: 'briefcase', text: 'Projects' },
    { href: 'sobre-mi.html', icon: 'code', text: 'About' }
];

/**
 * Array of objects defining external favorite links.
 * Each object includes href, icon, text, and an indicator if it is an external link.
 * @constant {Array<{href: string, icon: string, text: string, external: boolean}>}
 */
const favorites = [
    { href: 'https://github.com/DavidDevGt', icon: 'github', text: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/jdavidvl/', icon: 'briefcase', text: 'LinkedIn', external: true },
    { href: 'mailto:josuedavidvl18@gmail.com', icon: 'mail', text: 'Email', external: true }
];

/**
 * Generates the complete HTML for the site sidebar.
 * Includes user section, search, main navigation, favorites, and theme controls.
 * Uses the navigation and favorites arrays to dynamically build the links.
 * @returns {string} The sidebar HTML as a text string.
 */
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
       <nav class="px-3 space-y-0.5" role="navigation" aria-label="Navegación principal">
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

/**
 * Generates the HTML for the site topbar with breadcrumb and navigation controls.
 * Includes breadcrumb, share buttons, options menu (download CV, reading mode, view source code),
 * and on mobile, language and theme controls.
 * @param {string[]} breadcrumb - Array of strings representing the navigation breadcrumb.
 * @returns {string} The topbar HTML as a text string.
 */
function generateTopbar(breadcrumb) {
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'es';
    const languages = window.i18n ? window.i18n.getAvailableLanguages() : [{ code: 'es', name: 'Español', flag: '🇪🇸' }, { code: 'en', name: 'English', flag: '🇺🇸' }];
    const current = languages.find(lang => lang.code === currentLang) || languages[0];
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;
    const isDesktop = window.matchMedia('(min-width: 1367px)').matches;
    const themeIcon = document.documentElement.classList.contains('dark') ? 'sun' : 'moon';
    const themeText = window.i18n ? window.i18n.t('nav.theme', 'Cambiar Tema') : 'Cambiar Tema';

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
    <header role="banner" data-breadcrumb='${JSON.stringify(breadcrumb).replace(/'/g, "'")}' class="topbar ${isDesktop ? 'fixed' : ''}">
      <div class="sticky top-0 z-10 bg-[var(--page-bg)]/80 backdrop-blur-sm border-[var(--ui-border)] px-8 py-2" style="view-transition-name: topbar">
        <div class="max-w-[var(--notion-max-width)] mx-auto flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-[var(--text-secondary)]">
        ${isSmallScreen ? '<button onclick="toggleSidebar()" class="p-2 hover:bg-[var(--ui-hover)] rounded text-sm" aria-label="Abrir menú lateral" aria-expanded="false" id="sidebar-toggle">☰</button>' : ''}
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
            <div id="options-menu" class="absolute right-0 top-full mt-1 py-1 hidden z-10" style="background-color: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: 6px; min-width: 180px;">
              <button onclick="downloadCV()" class="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--ui-hover)]">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>${downloadText}</span>
              </button>
              <button onclick="toggleReadingMode()" id="reading-mode-btn" class="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--ui-hover)]">
                <i data-lucide="${readingIcon}" class="w-4 h-4"></i>
                <span>${readingText}</span>
              </button>
              <button onclick="viewSourceCode()" class="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--ui-hover)]">
                <i data-lucide="code" class="w-4 h-4"></i>
                <span>${viewSourceText}</span>
              </button>
              ${isSmallScreen ? `
              <div class="border-t border-[var(--ui-border)] my-1"></div>
              <button onclick="toggleLanguage()" class="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--ui-hover)]">
                <span id="current-lang-flag-mobile">${current.flag}</span>
                <span id="current-lang-text-mobile">${current.name}</span>
              </button>
              <button onclick="toggleTheme()" class="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--ui-hover)]">
                <i data-lucide="${themeIcon}" class="w-4 h-4"></i>
                <span>${themeText}</span>
              </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}

/**
 * Toggles the visibility of a collapsible list by rotating the arrow and showing/hiding the content.
 * @param {HTMLElement} element - The HTML element containing the arrow and triggering the toggle.
 */
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

/**
 * Updates the existing topbar by replacing its content with new breadcrumb data.
 * Reads the breadcrumb from the data-breadcrumb attribute of the header element and regenerates the topbar.
 * Also recreates Lucide icons if available.
 * Optimized to avoid unnecessary updates.
 */
let cachedTopbarHTML = '';
let cachedBreadcrumb = null;

function updateTopbar() {
  const topbarEl = document.querySelector('header[role="banner"]');
  if (topbarEl) {
    const breadcrumbData = topbarEl.dataset.breadcrumb;
    if (breadcrumbData) {
      try {
        const breadcrumb = JSON.parse(breadcrumbData);
        // Check if breadcrumb changed
        if (JSON.stringify(breadcrumb) !== JSON.stringify(cachedBreadcrumb)) {
          cachedBreadcrumb = breadcrumb;
          const newHTML = generateTopbar(breadcrumb);
          if (newHTML !== cachedTopbarHTML) {
            cachedTopbarHTML = newHTML;
            topbarEl.outerHTML = newHTML;
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
              lucide.createIcons();
            }
          }
        }
      } catch (e) {
        console.warn('Error updating topbar:', e);
      }
    }
  }
}

window.updateTopbar = updateTopbar;

/**
 * Inserts the topbar into the DOM by replacing the placeholder element with id 'topbar-placeholder'.
 * Gets the breadcrumb from the placeholder's data-breadcrumb attribute or uses a default value.
 * Also recreates Lucide icons if available.
 */
function insertTopbar() {
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
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
    }
}

/**
 * Toggles the sidebar visibility on small screens.
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (sidebar) {
        const isOpen = sidebar.classList.toggle('open');
        body.classList.toggle('sidebar-open', isOpen);
        if (overlay) {
            overlay.classList.toggle('active', isOpen);
        }
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', isOpen.toString());
        }
        sidebar.setAttribute('aria-hidden', (!isOpen).toString());
        // Manage focusable elements in sidebar
        const focusableElements = sidebar.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(el => {
            if (isOpen) {
                el.removeAttribute('tabindex');
            } else {
                el.setAttribute('tabindex', '-1');
            }
        });
        if (isOpen) {
            document.addEventListener('click', closeSidebarOnClickOutside);
            document.addEventListener('keydown', handleSidebarKeydown);
            // Focus trap: focus first focusable element in sidebar
            const firstFocusable = sidebar.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
        } else {
            document.removeEventListener('click', closeSidebarOnClickOutside);
            document.removeEventListener('keydown', handleSidebarKeydown);
        }
    }
}

/**
 * Closes the sidebar when clicking outside of it.
 */
function closeSidebarOnClickOutside(e) {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (sidebar && !sidebar.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
        sidebar.classList.remove('open');
        body.classList.remove('sidebar-open');
        if (overlay) overlay.classList.remove('active');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
        // Make focusable elements unfocusable
        const focusableElements = sidebar.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(el => {
            el.setAttribute('tabindex', '-1');
        });
        document.removeEventListener('click', closeSidebarOnClickOutside);
        document.removeEventListener('keydown', handleSidebarKeydown);
    }
}

/**
 * Handles keyboard navigation for the sidebar (Escape to close, focus trap).
 */
function handleSidebarKeydown(e) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || !sidebar.classList.contains('open')) return;

    if (e.key === 'Escape') {
        toggleSidebar();
        return;
    }

    // Focus trap
    const focusableElements = sidebar.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
}

window.toggleSidebar = toggleSidebar;
window.closeSidebarOnClickOutside = closeSidebarOnClickOutside;

document.addEventListener('DOMContentLoaded', function () {
    if (window.i18n && window.i18n.isLoaded) {
        insertTopbar();
    } else {
        window.addEventListener('i18nReady', insertTopbar);
    }
});

// Update topbar on window resize to show/hide hamburger button
window.addEventListener('resize', () => {
    updateTopbar();
});

// Handle responsive sidebar behavior globally
const sizeMediaQuery = window.matchMedia('(min-width: 1025px)');

function handleResponsiveChange() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    const isLargeScreen = sizeMediaQuery.matches;

    if (sidebar) {
        if (isLargeScreen) {
            // Large screens: ensure sidebar is visible
            sidebar.classList.remove('open');
            body.classList.remove('sidebar-open');
            sidebar.removeAttribute('aria-hidden');
        } else {
            // Small screens: ensure sidebar is hidden
            sidebar.classList.remove('open');
            body.classList.remove('sidebar-open');
            sidebar.setAttribute('aria-hidden', 'true');
        }
    }
    // Update topbar to show/hide hamburger button
    updateTopbar();
}

sizeMediaQuery.addEventListener('change', handleResponsiveChange);
handleResponsiveChange(); // Initialize