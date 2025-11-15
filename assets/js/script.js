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

        <div class="px-2 py-1.5 rounded hover:bg-[var(--ui-hover)] cursor-pointer text-sm text-[var(--text-secondary)] flex items-center gap-2">
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
  return `
    <div class="sticky top-0 z-10 bg-[var(--page-bg)]/80 backdrop-blur-sm border-b border-[var(--ui-border)] px-8 py-2" style="view-transition-name: topbar">
      <div class="max-w-[var(--notion-max-width)] mx-auto flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        ${breadcrumb.map((item, index) => `
          <span class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer ${index === breadcrumb.length - 1 ? 'text-[var(--text-primary)]' : ''}">${item}</span>
          ${index < breadcrumb.length - 1 ? '<span>/</span>' : ''}
        `).join('')}
        <div class="ml-auto flex items-center gap-2">
          <button class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer">Compartir</button>
          <button class="hover:bg-[var(--ui-hover)] px-2 py-1 rounded cursor-pointer">•••</button>
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
document.addEventListener('DOMContentLoaded', function() {
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
    button.addEventListener('click', function() {
      toggleList(this);
    });
  });

  // Prevent line breaks in headings
  const editables = document.querySelectorAll('[contenteditable="true"]');
  editables.forEach(el => {
    if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
      el.addEventListener('keydown', function(e) {
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

// Intersection Observer for stagger animations
document.addEventListener('DOMContentLoaded', function() {
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