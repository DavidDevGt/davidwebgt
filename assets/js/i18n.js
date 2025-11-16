/**
 * @typedef {Object} LanguageInfo
 * @property {string} code - Language code ('es' or 'en')
 * @property {string} name - Display name
 * @property {string} flag - Flag emoji
 */

/**
 * Class for handling website internationalization (i18n).
 * Manages translation loading, language switching, and DOM translation.
 * Supports English and Spanish with localStorage persistence.
 * @example
 * const i18n = new I18n();
 * await i18n.init();
 * console.log(i18n.t('nav.home')); // 'Home' or 'Inicio'
 */
class I18n {
  /**
   * Creates an instance of I18n.
   * Automatically detects browser language or uses the one saved in localStorage.
   */
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
    this.isLoaded = false;
  }

  /**
   * Detects the user's preferred language.
   * First checks localStorage, then browser language.
   * @returns {string} Language code ('es' or 'en').
   * @example
   * const lang = i18n.detectLanguage(); // 'es' or 'en'
   */
  detectLanguage() {
    const saved = localStorage.getItem('language');
    if (saved && this.isValidLanguage(saved)) {
      return saved;
    }

    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.split('-')[0];

    if (this.isValidLanguage(lang)) {
      return lang;
    }

    return 'es';
  }

  /**
   * Verifies if a language is valid.
   * @param {string} lang - Language code to verify.
   * @returns {boolean} True if the language is valid.
   * @example
   * i18n.isValidLanguage('es'); // true
   * i18n.isValidLanguage('fr'); // false
   */
  isValidLanguage(lang) {
    return ['es', 'en'].includes(lang);
  }

  /**
   * Loads translations for the current language from a JSON file.
   * @returns {Promise<boolean>} True if loading was successful.
   * @throws {Error} If fetch fails or JSON is invalid.
   * @example
   * const success = await i18n.loadTranslations();
   * if (!success) console.error('Failed to load translations');
   */
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
      if (this.currentLang !== 'es') {
        this.currentLang = 'es';
        return this.loadTranslations();
      }
      return false;
    }
  }

  /**
   * Translates a key using loaded translations.
   * Supports nested keys with dots (e.g., 'nav.home').
   * @param {string} key - Translation key.
   * @param {string} [fallback=''] - Fallback text if translation is not found.
   * @returns {string} Translated text or fallback.
   * @example
   * i18n.t('nav.home'); // 'Home'
   * i18n.t('nonexistent', 'Default'); // 'Default'
   */
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

  /**
   * Translates all DOM elements that have data-i18n attributes.
   * Updates text, placeholders, alt, title, and aria-label as appropriate.
   * @example
   * // HTML: <span data-i18n="nav.home"></span>
   * i18n.translatePage(); // Updates span text to 'Home'
   */
  translatePage() {
    if (!this.isLoaded) {
      console.warn('Cannot translate page: translations not loaded');
      return;
    }

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
          element.placeholder = translation;
        } else if (element.tagName === 'IMG') {
          element.alt = translation;
        } else {
          if (translation.includes('<')) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      }
    });

    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = this.t(key);
      if (translation) {
        element.title = translation;
      }
    });

    const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria-label');
      const translation = this.t(key);
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });
  }

  /**
   * Changes the current language and reloads translations.
   * Updates the DOM, saves to localStorage, and fires events.
   * @param {string} lang - Code of the new language.
   * @returns {Promise<boolean>} True if the change was successful.
   * @fires languageChanged - When language change completes.
   * @example
   * await i18n.changeLanguage('es'); // Changes to Spanish
   */
  async changeLanguage(lang) {
    if (!this.isValidLanguage(lang)) {
      console.error(`Invalid language: ${lang}`);
      return false;
    }

    if (lang === this.currentLang) {
      return true;
    }

    this.currentLang = lang;
    this.isLoaded = false;

    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);

    const success = await this.loadTranslations();
    if (success) {
      this.translatePage();
      updateOptionsMenu();
      updateTopbar();
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang }
      }));
    }

    return success;
  }

  /**
   * Gets the code of the currently active language.
   * @returns {string} Current language code.
   * @example
   * const lang = i18n.getCurrentLanguage(); // 'es' or 'en'
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * Gets the list of available languages with their names and flags.
   * @returns {Array<LanguageInfo>} Array of language objects.
   * @example
   * const langs = i18n.getAvailableLanguages();
   * // [{ code: 'es', name: 'Español', flag: '🇪🇸' }, ...]
   */
  getAvailableLanguages() {
    return [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  }

  /**
   * Initializes the i18n system by loading translations and translating the page.
   * @returns {Promise<boolean>} True if initialization was successful.
   * @example
   * await i18n.init(); // Loads translations and translates DOM
   */
  async init() {
    const success = await this.loadTranslations();
    if (success) {
      this.translatePage();
      setTimeout(() => updateLanguageButton(), 0);
      setTimeout(() => updateOptionsMenu(), 0);
      setTimeout(() => updateTopbar(), 0);
    }
    return success;
  }
}

/**
 * Global singleton instance of the I18n class.
 * Provides internationalization functionality throughout the app.
 * @type {I18n}
 * @global
 * @example
 * i18n.changeLanguage('es').then(success => console.log('Language changed'));
 */
const i18n = new I18n();

/**
 * Toggles the visibility of the language selection menu.
 * @example
 * toggleLanguageMenu(); // Shows/hides language menu
 */
function toggleLanguageMenu() {
  const menu = document.getElementById('lang-menu-mobile') || document.getElementById('lang-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

/**
 * Changes to the next available language (es -> en -> es).
 * @example
 * toggleLanguage(); // Switches between 'es' and 'en'
 */
function toggleLanguage() {
  const current = i18n.getCurrentLanguage();
  const next = current === 'es' ? 'en' : 'es';
  changeLanguage(next);
}

/**
 * Changes the language using the i18n instance.
 * @param {string} lang - Language code.
 * @example
 * changeLanguage('en'); // Changes to English
 */
function changeLanguage(lang) {
  i18n.changeLanguage(lang).then(success => {
    if (success) {
      updateLanguageButton();
      closeLanguageMenu();
    }
  });
}

/**
 * Updates the language button with the current language.
 * @example
 * updateLanguageButton(); // Updates UI to show current language
 */
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

/**
 * Hides the language selection menu.
 * @example
 * closeLanguageMenu(); // Hides the menu
 */
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

/**
 * Updates the topbar with the current breadcrumb.
 * @example
 * updateTopbar(); // Refreshes topbar content
 */
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

/**
 * Debug function that prints information about the i18n state.
 * @example
 * window.debugI18n(); // Logs current i18n status
 */
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

/**
 * Inserts the topbar into the DOM by replacing the placeholder.
 * @example
 * insertTopbar(); // Adds topbar to page
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
    // Create icons after inserting topbar
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
}