/**
 * Clase para manejar internacionalización (i18n) del sitio web.
 * Gestiona la carga de traducciones, cambio de idioma y traducción de elementos DOM.
 */
class I18n {
  /**
   * Crea una instancia de I18n.
   * Detecta automáticamente el idioma del navegador o usa el guardado en localStorage.
   */
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
    this.isLoaded = false;
  }

  /**
   * Detecta el idioma preferido del usuario.
   * Primero verifica localStorage, luego el idioma del navegador.
   * @returns {string} Código del idioma ('es' o 'en').
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
   * Verifica si un idioma es válido.
   * @param {string} lang - Código del idioma a verificar.
   * @returns {boolean} True si el idioma es válido.
   */
  isValidLanguage(lang) {
    return ['es', 'en'].includes(lang);
  }

  /**
   * Carga las traducciones para el idioma actual desde un archivo JSON.
   * @returns {Promise<boolean>} True si la carga fue exitosa.
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
   * Traduce una clave usando las traducciones cargadas.
   * Soporta claves anidadas con puntos (ej: 'nav.home').
   * @param {string} key - Clave de traducción.
   * @param {string} [fallback=''] - Texto de respaldo si no se encuentra la traducción.
   * @returns {string} Texto traducido o fallback.
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
   * Traduce todos los elementos DOM que tienen atributos data-i18n.
   * Actualiza texto, placeholders, alt, title y aria-label según corresponda.
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
   * Cambia el idioma actual y recarga las traducciones.
   * Actualiza el DOM, guarda en localStorage y dispara eventos.
   * @param {string} lang - Código del nuevo idioma.
   * @returns {Promise<boolean>} True si el cambio fue exitoso.
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
   * Obtiene el código del idioma actualmente activo.
   * @returns {string} Código del idioma actual.
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * Obtiene la lista de idiomas disponibles con sus nombres y banderas.
   * @returns {Array<{code: string, name: string, flag: string}>} Array de objetos de idiomas.
   */
  getAvailableLanguages() {
    return [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  }

  /**
   * Inicializa el sistema de i18n cargando traducciones y traduciendo la página.
   * @returns {Promise<boolean>} True si la inicialización fue exitosa.
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
 * Instancia global de la clase I18n.
 * @type {I18n}
 */
const i18n = new I18n();

/**
 * Alterna la visibilidad del menú de selección de idioma.
 */
function toggleLanguageMenu() {
  const menu = document.getElementById('lang-menu-mobile') || document.getElementById('lang-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

/**
 * Cambia al siguiente idioma disponible (es -> en -> es).
 */
function toggleLanguage() {
  const current = i18n.getCurrentLanguage();
  const next = current === 'es' ? 'en' : 'es';
  changeLanguage(next);
}

/**
 * Cambia el idioma usando la instancia i18n.
 * @param {string} lang - Código del idioma.
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
 * Actualiza el botón de idioma con el idioma actual.
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
 * Oculta el menú de selección de idioma.
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
 * Actualiza la topbar con el breadcrumb actual.
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
 * Función de depuración que imprime información sobre el estado de i18n.
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
 * Inserta la topbar en el DOM reemplazando el placeholder.
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