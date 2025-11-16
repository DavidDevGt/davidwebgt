# Search Module API

## Overview

The Search module provides client-side search functionality for the David Vargas Portfolio. It includes a modal interface, query processing, result filtering, and highlighting capabilities.

## Functions

### openSearchModal()

```javascript
void openSearchModal()
```

**Description**: Opens the search modal interface with input focus and icon initialization.

**Behavior**:
1. Creates modal HTML if it doesn't exist
2. Appends modal to document body
3. Adds 'show' class for visibility
4. Focuses search input after 100ms delay
5. Recreates Lucide icons
6. Attaches input event listener

**Modal Structure**:
```html
<div class="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50">
  <div class="bg-[var(--ui-bg)] border border-[var(--ui-border)] rounded-lg shadow-lg w-full max-w-md mx-4">
    <div class="p-4 border-b border-[var(--ui-border)]">
      <div class="flex items-center gap-2">
        <i data-lucide="search"></i>
        <input type="text" id="search-input" placeholder="..." />
        <button onclick="closeSearchModal()">×</button>
      </div>
    </div>
    <div id="search-results"></div>
  </div>
</div>
```

**Accessibility Features**:
- Keyboard focus management
- Screen reader friendly structure
- High contrast overlay

### closeSearchModal()

```javascript
void closeSearchModal()
```

**Description**: Closes the search modal by removing the 'show' class.

**Behavior**:
- Removes 'show' class from modal element
- Keeps modal in DOM for future reuse
- No cleanup of event listeners (handled by modal recreation)

### performSearch(query)

```javascript
void performSearch(string query)
```

**Description**: Executes search against the search index and renders results.

**Parameters**:
- `query` (string): The search query to process

**Behavior**:
1. Returns early if query is empty
2. Converts query to lowercase
3. Filters searchIndex array
4. Sorts results by relevance
5. Calls renderResults with filtered data

**Search Algorithm**:
```javascript
const results = searchIndex.filter(item => {
  return item.title.toLowerCase().includes(queryLower) ||
         item.content.toLowerCase().includes(queryLower) ||
         (item.keywords && item.keywords.some(keyword =>
           keyword.toLowerCase().includes(queryLower)
         ));
});
```

**Sorting Logic**:
1. Title matches get highest priority
2. Content matches sorted by content length (shorter = more relevant)
3. Keyword matches included in results

### renderResults(results, query)

```javascript
void renderResults(Array results, string query)
```

**Description**: Renders search results in the modal with highlighting.

**Parameters**:
- `results` (Array): Filtered search results
- `query` (string): Original search query for highlighting

**Behavior**:
1. Clears existing results container
2. Handles no results case
3. Creates result link elements
4. Applies highlighting to matches
5. Appends results to container

**Result Structure**:
```html
<a href="result.url" class="block p-4 border-b border-[var(--ui-border)] hover:bg-[var(--ui-hover)] last:border-b-0">
  <div class="font-semibold text-[var(--text-primary)]">Highlighted Title</div>
  <div class="text-sm text-[var(--text-secondary)]">Page Name</div>
  <div class="text-sm text-[var(--text-secondary)] mt-1">Highlighted Content...</div>
</a>
```

**No Results Handling**:
```html
<div class="p-4 text-[var(--text-secondary)]">
  No se encontraron resultados
</div>
```

### escapeHtml(text)

```javascript
string escapeHtml(string text)
```

**Description**: Escapes HTML characters to prevent XSS in search results.

**Parameters**:
- `text` (string): Text to escape

**Returns**: HTML-safe string

**Escaping Rules**:
- `&` → `&`
- `<` → `<`
- `>` → `>`
- `"` → `"`
- `'` → `&#x27;`

**Implementation**:
```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

### highlightText(text, query)

```javascript
string highlightText(string text, string query)
```

**Description**: Highlights search query matches in text using `<mark>` tags.

**Parameters**:
- `text` (string): Original text content
- `query` (string): Search query to highlight

**Returns**: HTML string with highlighted matches

**Highlighting Features**:
- Case-insensitive matching
- Multiple occurrences highlighted
- Safe HTML escaping
- Yellow background styling

**Example**:
```javascript
highlightText("Hello World", "world");
// Returns: "Hello <mark>World</mark>"
```

**Styling**:
```css
mark {
  background: yellow;
}
.dark mark {
  background: orange;
}
```

## Event Listeners

### Search Input Handler

```javascript
document.getElementById('search-input').addEventListener('input', (e) => {
  performSearch(e.target.value);
});
```

**Description**: Triggers search on every input change.

**Debouncing**: Not implemented (real-time search for simplicity)

**Performance**: Efficient for small search index (< 100 items)

### Keyboard Shortcut Handler

```javascript
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearchModal();
  }
});
```

**Description**: Opens search modal with Cmd+K (Mac) or Ctrl+K (Windows/Linux).

**Behavior**:
- Prevents default browser behavior
- Opens search modal
- Cross-platform shortcut support

## Dependencies

### Internal Modules
- **searchIndex**: Pre-built search data array
- **i18n**: For translated placeholder and no-results text

### Browser APIs
- **DOM API**: For modal creation and manipulation
- **Event API**: For input and keyboard event handling

### External Libraries
- **Lucide Icons**: For search and close icons

## Performance Characteristics

### Search Performance
- **Index Size**: ~15KB for current content
- **Search Speed**: < 10ms for typical queries
- **Result Limit**: No artificial limits (scales with content)
- **Memory Usage**: Minimal (shared searchIndex)

### Rendering Performance
- **DOM Updates**: Efficient single container updates
- **HTML Generation**: String concatenation (fast)
- **Highlighting**: Regex-based with caching

### Loading Performance
- **Initial Load**: searchIndex loaded with search.js
- **Lazy Loading**: Could be implemented for large indexes
- **Caching**: Browser cache for script files

## Accessibility Features

### Keyboard Navigation
- **Modal Focus**: Automatic input focus on open
- **Tab Navigation**: Accessible result links
- **Escape Handling**: Close on Escape key (not implemented)

### Screen Reader Support
- **ARIA Labels**: Semantic button labels
- **Result Context**: Page names and content previews
- **Live Regions**: Could announce result counts

### Visual Accessibility
- **High Contrast**: Border and background colors
- **Focus Indicators**: Visible focus outlines
- **Text Sizing**: Respects user font preferences

## Error Handling

### Search Index Missing
- Graceful degradation if searchIndex not loaded
- Console warnings for debugging
- No user-facing errors

### DOM Element Missing
- Checks for modal existence before manipulation
- Creates modal if not found
- Continues execution without breaking

### Icon Loading Failures
- Continues without icons
- CSS fallbacks for visual elements
- No functional impact

## Testing

### Unit Tests
- Search algorithm accuracy
- Result sorting correctness
- HTML escaping functionality
- Text highlighting logic

### Integration Tests
- Modal open/close workflow
- Search input to results flow
- Keyboard shortcut handling
- Cross-browser compatibility

### Manual Tests
- Search result relevance
- Highlighting accuracy
- Mobile responsiveness
- Accessibility compliance

## Usage Examples

### Basic Search Flow
```javascript
// User presses Cmd+K
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    openSearchModal();
  }
});

// User types query
// performSearch() called automatically via input event
// Results rendered in modal
```

### Programmatic Search
```javascript
// Open modal
openSearchModal();

// Simulate search
performSearch("javascript");

// Close modal
closeSearchModal();
```

### Custom Result Rendering
```javascript
function customRenderResults(results, query) {
  const container = document.getElementById('search-results');
  container.innerHTML = results.map(result => `
    <div class="result-item">
      <h3>${highlightText(result.title, query)}</h3>
      <p>${highlightText(result.content.substring(0, 100), query)}...</p>
    </div>
  `).join('');
}
```

## Browser Compatibility

### Supported Features
- **ES6**: Arrow functions, template literals
- **DOM APIs**: Modern element creation methods
- **Event APIs**: addEventListener, preventDefault
- **CSS**: CSS custom properties, flexbox

### Progressive Enhancement
- **Older Browsers**: Basic search functionality
- **No JavaScript**: Search trigger hidden
- **Limited APIs**: Fallback to simpler interactions

## Future Enhancements

### Planned Features
- Fuzzy search matching
- Search result pagination
- Recent searches history
- Search analytics

### Potential Improvements
- Debounced search input
- Search result caching
- Advanced filtering options
- Voice search integration