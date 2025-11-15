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
});

// Load reading mode on page load
document.addEventListener('DOMContentLoaded', function () {
    const readingModeEnabled = localStorage.getItem('readingMode') === 'true';

    if (readingModeEnabled) {
        document.body.classList.add('reading-mode');
    }
});