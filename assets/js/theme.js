// Theme toggle with persistence
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateOptionsMenu();
}


// Load theme on page load
document.addEventListener('DOMContentLoaded', function () {
    updateOptionsMenu();
});

// Validate localStorage theme
function getValidatedTheme() {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : null;
}

// Load reading mode on page load
document.addEventListener('DOMContentLoaded', function () {
    const readingModeEnabled = getValidatedReadingMode();

    if (readingModeEnabled) {
        document.body.classList.add('reading-mode');
    }
});

// Validate localStorage reading mode
function getValidatedReadingMode() {
    const saved = localStorage.getItem('readingMode');
    return saved === 'true';
}

// Initialize theme on load (moved from inline script)
(function() {
    // Only apply theme if not already applied by inline script
    if (!document.documentElement.classList.contains('dark')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = getValidatedTheme();
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            if (!savedTheme) localStorage.setItem('theme', 'dark');
        }
    }
})();