/**
 * Toggles between light and dark theme.
 * Updates localStorage and calls updateOptionsMenu and updateTopbar.
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
 * Gets the validated theme from localStorage.
 * @returns {string|null} 'dark', 'light', or null.
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
 * Gets the validated reading mode state from localStorage.
 * @returns {boolean} True if enabled.
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