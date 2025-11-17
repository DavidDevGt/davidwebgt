/**
 * Updates the search input placeholder with current language.
 */
function updateSearchPlaceholder() {
    const searchInput = document.getElementById('search-input');
    if (searchInput && window.i18n) {
        searchInput.placeholder = window.i18n.t('nav.searchPlaceholder', 'Buscar en el sitio...');
    }
}

/**
 * Opens the search modal by creating the HTML if it doesn't exist.
 * Focuses the search input and recreates Lucide icons.
 */
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
            <input type="text" id="search-input" placeholder="${window.i18n ? window.i18n.t('nav.searchPlaceholder', 'Buscar en el sitio...') : 'Buscar en el sitio...'}" class="flex-1 bg-transparent outline-none text-[var(--text-primary)]" />
            <button
              onclick="closeSearchModal()"
              class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl border-none outline-none focus:outline-none focus:ring-0"
              aria-label="${window.i18n ? window.i18n.t('common.close', 'Cerrar') : 'Cerrar'}"
            >
              ×
            </button>
          </div>
        </div>
        <div id="search-results" class="max-h-96 overflow-y-auto"></div>
      </div>
    `;
        document.body.appendChild(modal);
        document.getElementById('search-input').addEventListener('input', (e) => performSearch(e.target.value));
    }
    modal.classList.add('show');
    updateSearchPlaceholder(); // Ensure placeholder is up to date
    setTimeout(() => document.getElementById('search-input').focus(), 100);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

/**
 * Closes the search modal by removing the 'show' class.
 */
function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Performs search on the index based on the query.
 * Filters by title, content, and keywords, sorts results.
 * @param {string} query - The search query.
 */
function performSearch(query) {
    if (!query.trim()) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }

    const queryLower = query.toLowerCase();
    const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(queryLower) ||
            item.content.toLowerCase().includes(queryLower) ||
            (item.keywords && item.keywords.some(keyword =>
                keyword.toLowerCase().includes(queryLower)
            ));
    });

    results.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(queryLower);
        const bTitle = b.title.toLowerCase().includes(queryLower);

        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;

        return a.content.length - b.content.length;
    });

    renderResults(results, query);
}

/**
 * Renders search results in the container.
 * If no results, shows a message.
 * @param {Array} results - Array of search results.
 * @param {string} query - The original query.
 */
function renderResults(results, query) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'p-4 text-[var(--text-secondary)]';
        noResults.textContent = window.i18n ? window.i18n.t('common.noResults') : 'No se encontraron resultados';
        container.appendChild(noResults);
        return;
    }
    results.forEach(result => {
        const link = document.createElement('a');
        link.href = result.anchor ? `${result.url}${result.anchor}` : result.url;
        link.className = 'block p-4 border-b border-[var(--ui-border)] hover:bg-[var(--ui-hover)] last:border-b-0';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'font-semibold text-[var(--text-primary)]';
        titleDiv.innerHTML = highlightText(result.title, query);

        const pageDiv = document.createElement('div');
        pageDiv.className = 'text-sm text-[var(--text-secondary)]';
        pageDiv.textContent = result.page;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'text-sm text-[var(--text-secondary)] mt-1';
        contentDiv.innerHTML = highlightText(result.content.substring(0, 100), query) + '...';

        link.appendChild(titleDiv);
        link.appendChild(pageDiv);
        link.appendChild(contentDiv);
        container.appendChild(link);
    });
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} text - Text to escape.
 * @returns {string} Escaped text.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Highlights the query text in the content using <mark>.
 * @param {string} text - Original text.
 * @param {string} query - Query to highlight.
 * @returns {string} Text with highlighting.
 */
function highlightText(text, query) {
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
}

// Listen for language changes to update search placeholder
window.addEventListener('languageChanged', updateSearchPlaceholder);

// Make functions globally available
window.updateSearchPlaceholder = updateSearchPlaceholder;