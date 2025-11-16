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
    container.innerHTML = ''; // Clear previous results
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'p-4 text-[var(--text-secondary)]';
        noResults.textContent = 'No se encontraron resultados';
        container.appendChild(noResults);
        return;
    }
    results.forEach(result => {
        const link = document.createElement('a');
        link.href = result.url;
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function highlightText(text, query) {
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
}