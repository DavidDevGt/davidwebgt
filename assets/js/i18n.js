// Internationalization (i18n) system for vanilla JavaScript
class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
    this.isLoaded = false;
  }

  // Detect user's preferred language
  detectLanguage() {
    // Check localStorage first
    const saved = localStorage.getItem('language');
    if (saved && this.isValidLanguage(saved)) {
      return saved;
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.split('-')[0]; // Get language without region

    if (this.isValidLanguage(lang)) {
      return lang;
    }

    // Default to Spanish
    return 'es';
  }

  // Check if language is supported
  isValidLanguage(lang) {
    return ['es', 'en'].includes(lang);
  }

  // Load translations for current language
  async loadTranslations() {
    try {
      const response = await fetch(`assets/i18n/${this.currentLang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.status}`);
      }
      this.translations = await response.json();
      this.isLoaded = true;
      return true;
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to Spanish if current language fails
      if (this.currentLang !== 'es') {
        this.currentLang = 'es';
        return this.loadTranslations();
      }
      return false;
    }
  }

  // Get translation by key path (dot notation)
  t(key, fallback = '') {
    if (!this.isLoaded) {
      console.warn('Translations not loaded yet');
      return fallback;
    }

    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return fallback;
      }
    }

    return value;
  }

  // Translate all elements with data-i18n attribute
  translatePage() {
    if (!this.isLoaded) {
      console.warn('Cannot translate page: translations not loaded');
      return;
    }

    // Translate elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (translation) {
        // Handle different element types
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
          element.placeholder = translation;
        } else if (element.tagName === 'IMG') {
          element.alt = translation;
        } else {
          // Check if translation contains HTML tags
          if (translation.includes('<')) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      }
    });

    // Translate elements with data-i18n-title
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = this.t(key);
      if (translation) {
        element.title = translation;
      }
    });

    // Translate elements with data-i18n-aria-label
    const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria-label');
      const translation = this.t(key);
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });
  }

  // Change language
  async changeLanguage(lang) {
    if (!this.isValidLanguage(lang)) {
      console.error(`Invalid language: ${lang}`);
      return false;
    }

    if (lang === this.currentLang) {
      return true; // Already current language
    }

    this.currentLang = lang;
    this.isLoaded = false;

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Save to localStorage
    localStorage.setItem('language', lang);

    // Reload translations
    const success = await this.loadTranslations();
    if (success) {
      this.translatePage();
      // Update dynamic elements
      updateOptionsMenu();
      updateTopbar();
      // Dispatch custom event for other modules to react
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang }
      }));
    }

    return success;
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLang;
  }

  // Get available languages
  getAvailableLanguages() {
    return [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  }

  // Initialize i18n system
  async init() {
    const success = await this.loadTranslations();
    if (success) {
      this.translatePage();
      // Initialize buttons after translations are loaded
      setTimeout(() => updateLanguageButton(), 0);
      setTimeout(() => updateOptionsMenu(), 0);
      setTimeout(() => updateTopbar(), 0);
    }
    return success;
  }
}

// Create global i18n instance
const i18n = new I18n();

// Note: i18n is now initialized immediately when script loads
// No need for DOMContentLoaded listener

// Language selector functions
function toggleLanguageMenu() {
  const menu = document.getElementById('lang-menu-mobile') || document.getElementById('lang-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function toggleLanguage() {
  const current = i18n.getCurrentLanguage();
  const next = current === 'es' ? 'en' : 'es';
  changeLanguage(next);
}

function changeLanguage(lang) {
  i18n.changeLanguage(lang).then(success => {
    if (success) {
      updateLanguageButton();
      closeLanguageMenu();
    }
  });
}

function updateLanguageButton() {
  const currentLang = i18n.getCurrentLanguage();
  const languages = i18n.getAvailableLanguages();
  const current = languages.find(lang => lang.code === currentLang);

  if (current) {
    const flagEl = document.getElementById('current-lang-flag');
    const textEl = document.getElementById('current-lang-text');

    if (flagEl) flagEl.textContent = current.flag;
    if (textEl) textEl.textContent = current.name;
  }
}

function closeLanguageMenu() {
  const menu = document.getElementById('lang-menu-mobile') || document.getElementById('lang-menu');
  if (menu) {
    menu.classList.add('hidden');
  }
}

// Close language menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('lang-menu-mobile') || document.getElementById('lang-menu');
  const btn = document.getElementById('lang-btn') || document.querySelector('button[onclick="toggleLanguageMenu()"]');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    closeLanguageMenu();
  }
});

// Initialize language button when i18n is ready
window.addEventListener('languageChanged', () => {
  updateLanguageButton();
});

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

// Make functions globally available immediately
window.toggleLanguage = toggleLanguage;
window.toggleLanguageMenu = toggleLanguageMenu;
window.changeLanguage = changeLanguage;
window.updateLanguageButton = updateLanguageButton;
window.closeLanguageMenu = closeLanguageMenu;

// Debug function for development
window.debugI18n = function() {
  console.log('=== i18n Debug Info ===');
  console.log('Current Language:', i18n.getCurrentLanguage());
  console.log('Translations Loaded:', i18n.isLoaded);
  console.log('Available Languages:', i18n.getAvailableLanguages());
  console.log('Sample Translation:', i18n.t('nav.home'));
  console.log('DOM Elements with data-i18n:', document.querySelectorAll('[data-i18n]').length);
  console.log('=======================');
};

// Export for use in other modules
window.i18n = i18n;

// Initialize immediately
(function initI18nImmediately() {
  // Detect language and start loading translations
  const detectedLang = i18n.detectLanguage();

  // Load translations immediately
  i18n.loadTranslations().then(success => {
    if (success) {
      // Update language button immediately
      updateLanguageButton();

      // Translate page if DOM is ready
      if (document.readyState !== 'loading') {
        i18n.translatePage();
      } else {
        // Wait for DOM ready
        document.addEventListener('DOMContentLoaded', () => {
          i18n.translatePage();
        });
      }

      // Dispatch event to notify other modules that i18n is ready
      window.dispatchEvent(new CustomEvent('i18nReady'));
    }
  });
})();

// Insert topbar function
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
    // Create icons after inserting topbar
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
}