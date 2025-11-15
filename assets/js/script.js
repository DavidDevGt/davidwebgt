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
  const readingModeEnabled = localStorage.getItem('readingMode') === 'true';
  const readingIcon = readingModeEnabled ? 'book' : 'book-open';
  const readingText = readingModeEnabled ? 'Salir Modo Lectura' : 'Modo Lectura';

  return `
    <div class="sticky top-0 z-10 bg-[var(--page-bg)]/80 backdrop-blur-sm border-b border-[var(--ui-border)] px-8 py-2" style="view-transition-name: topbar">
      <div class="max-w-[var(--notion-max-width)] mx-auto flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        ${breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;
          const clickHandler = !isLast && item === 'Inicio' ? 'onclick="window.location.href=\'index.html\'"' : '';
          return `
            <span class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer ${isLast ? 'text-[var(--text-primary)]' : ''}" ${clickHandler}>${item}</span>
            ${!isLast ? '<span>/</span>' : ''}
          `;
        }).join('')}
        <div class="ml-auto flex items-center gap-2 relative">
          <button onclick="sharePage()" class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer">Compartir</button>
          <div class="relative">
            <button onclick="toggleOptionsMenu()" class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer" id="options-btn">•••</button>
            <div id="options-menu" class="absolute right-0 top-full mt-1 py-1 hidden z-10">
              <button onclick="downloadCV()">
                <i data-lucide="download"></i>
                <span>Descargar CV</span>
              </button>
              <button onclick="toggleReadingMode()" id="reading-mode-btn">
                <i data-lucide="${readingIcon}"></i>
                <span>${readingText}</span>
              </button>
              <button onclick="viewSourceCode()">
                <i data-lucide="code"></i>
                <span>Ver Código Fuente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Theme toggle with persistence
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeButton();
}

// Update theme button display
function updateThemeButton() {
  const isDark = document.documentElement.classList.contains('dark');
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (icon && text) {
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    text.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    // Re-create icons after changing data-lucide
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
}

// Load theme on page load
document.addEventListener('DOMContentLoaded', function () {
  updateThemeButton();

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

// Search modal functions
function openSearchModal() {
  let modal = document.getElementById('search-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50';
    modal.innerHTML = `
      <div class="bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-4 border-b border-[var(--ui-border)]">
          <div class="flex items-center gap-2">
            <i data-lucide="search" class="w-5 h-5 text-[var(--text-secondary)]"></i>
            <input type="text" id="search-input" placeholder="Buscar en el sitio..." class="flex-1 bg-transparent outline-none text-[var(--text-primary)]" />
            <button 
              onclick="closeSearchModal()" 
              class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl border-none outline-none focus:outline-none focus:ring-0"
            >
              ×
            </button>
          </div>
        </div>
        <div id="search-results" class="max-h-96 overflow-y-auto"></div>
      </div>
    `;
    document.body.appendChild(modal);
    // Event listeners
    document.getElementById('search-input').addEventListener('input', (e) => performSearch(e.target.value));
  }
  modal.classList.add('show');
  // Focus input
  setTimeout(() => document.getElementById('search-input').focus(), 100);
  // Create icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function performSearch(query) {
  if (!query.trim()) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  const queryLower = query.toLowerCase();
  const results = searchIndex.filter(item => {
    // Search in title, content, and keywords
    return item.title.toLowerCase().includes(queryLower) ||
           item.content.toLowerCase().includes(queryLower) ||
           (item.keywords && item.keywords.some(keyword =>
             keyword.toLowerCase().includes(queryLower)
           ));
  });

  // Sort results by relevance (title matches first, then content, then keywords)
  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(queryLower);
    const bTitle = b.title.toLowerCase().includes(queryLower);

    if (aTitle && !bTitle) return -1;
    if (!aTitle && bTitle) return 1;

    // If both have title matches or both don't, sort by content length (shorter = more relevant)
    return a.content.length - b.content.length;
  });

  renderResults(results, query);
}

function renderResults(results, query) {
  const container = document.getElementById('search-results');
  if (results.length === 0) {
    container.innerHTML = '<div class="p-4 text-[var(--text-secondary)]">No se encontraron resultados</div>';
    return;
  }
  container.innerHTML = results.map(result => `
    <a href="${result.url}" class="block p-4 border-b border-[var(--ui-border)] hover:bg-[var(--ui-hover)] last:border-b-0">
      <div class="font-semibold text-[var(--text-primary)]">${highlightText(result.title, query)}</div>
      <div class="text-sm text-[var(--text-secondary)]">${result.page}</div>
      <div class="text-sm text-[var(--text-secondary)] mt-1">${highlightText(result.content.substring(0, 100), query)}...</div>
    </a>
  `).join('');
}

function highlightText(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
}

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
  feedback.textContent = message;
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

function toggleReadingMode() {
  const body = document.body;
  const isReadingMode = body.classList.contains('reading-mode');
  const btn = document.getElementById('reading-mode-btn');

  if (isReadingMode) {
    // Exit reading mode
    body.classList.remove('reading-mode');
    localStorage.setItem('readingMode', 'false');
    if (btn) {
      btn.innerHTML = '<i data-lucide="book-open"></i><span>Modo Lectura</span>';
    }
  } else {
    // Enter reading mode
    body.classList.add('reading-mode');
    localStorage.setItem('readingMode', 'true');
    if (btn) {
      btn.innerHTML = '<i data-lucide="book"></i><span>Salir Modo Lectura</span>';
    }
  }

  // Re-create icons after changing innerHTML
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  closeOptionsMenu();
}

// Load reading mode on page load
document.addEventListener('DOMContentLoaded', function() {
  const readingModeEnabled = localStorage.getItem('readingMode') === 'true';

  if (readingModeEnabled) {
    document.body.classList.add('reading-mode');
  }
});

function viewSourceCode() {
  window.location.href = 'view-source:' + window.location.href;
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