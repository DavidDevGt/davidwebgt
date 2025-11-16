/**
 * Alterna entre tema claro y oscuro.
 * Actualiza localStorage y llama a updateOptionsMenu y updateTopbar.
 */
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateOptionsMenu();
    if (typeof updateTopbar === 'function') updateTopbar();
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.i18n && window.i18n.isLoaded) {
        updateOptionsMenu();
    } else {
        window.addEventListener('i18nReady', updateOptionsMenu);
    }
});

/**
 * Obtiene el tema validado desde localStorage.
 * @returns {string|null} 'dark', 'light' o null.
 */
function getValidatedTheme() {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : null;
}

document.addEventListener('DOMContentLoaded', function () {
    const readingModeEnabled = getValidatedReadingMode();

    if (readingModeEnabled) {
        document.body.classList.add('reading-mode');
    }
});

/**
 * Obtiene el estado validado del modo lectura desde localStorage.
 * @returns {boolean} True si está habilitado.
 */
function getValidatedReadingMode() {
    const saved = localStorage.getItem('readingMode');
    return saved === 'true';
}

(function() {
    if (!document.documentElement.classList.contains('dark')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = getValidatedTheme();
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            if (!savedTheme) localStorage.setItem('theme', 'dark');
        }
    }
})();