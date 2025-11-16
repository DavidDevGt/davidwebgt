/**
 * Abre el modal de búsqueda creando el HTML si no existe.
 * Enfoca el input de búsqueda y recrea íconos de Lucide.
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
            <input type="text" id="search-input" placeholder="${window.i18n ? window.i18n.t('nav.searchPlaceholder') : 'Buscar en el sitio...'}" class="flex-1 bg-transparent outline-none text-[var(--text-primary)]" />
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
        document.getElementById('search-input').addEventListener('input', (e) => performSearch(e.target.value));
    }
    modal.classList.add('show');
    setTimeout(() => document.getElementById('search-input').focus(), 100);
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

/**
 * Cierra el modal de búsqueda removiendo la clase 'show'.
 */
function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Realiza la búsqueda en el índice basado en la consulta.
 * Filtra por título, contenido y palabras clave, ordena resultados.
 * @param {string} query - La consulta de búsqueda.
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
 * Renderiza los resultados de búsqueda en el contenedor.
 * Si no hay resultados, muestra un mensaje.
 * @param {Array} results - Array de resultados de búsqueda.
 * @param {string} query - La consulta original.
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

/**
 * Escapa caracteres HTML para prevenir XSS.
 * @param {string} text - Texto a escapar.
 * @returns {string} Texto escapado.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Resalta el texto de la consulta en el contenido usando <mark>.
 * @param {string} text - Texto original.
 * @param {string} query - Consulta a resaltar.
 * @returns {string} Texto con resaltado.
 */
function highlightText(text, query) {
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
}