# UI Module API

## Overview

The UI module provides user interface components and DOM manipulation utilities for the David Vargas Portfolio. It handles sidebar generation, navigation, topbar creation, and UI state management.

## Constants

### navigation

```javascript
const navigation = [
  { href: 'index.html', icon: 'home', text: 'Home' },
  { href: 'proyectos.html', icon: 'briefcase', text: 'Proyectos' },
  { href: 'sobre-mi.html', icon: 'code', text: 'Sobre mí' }
]
```

**Description**: Defines the main navigation structure with page links and icons.

**Properties**:
- `href` (string): Relative URL of the page
- `icon` (string): Lucide icon name
- `text` (string): Display text (translated)

### favorites

```javascript
const favorites = [
  { href: 'https://github.com/DavidDevGt', icon: 'github', text: 'GitHub', external: true },
  { href: 'https://www.linkedin.com/in/jdavidvl/', icon: 'briefcase', text: 'LinkedIn', external: true },
  { href: 'mailto:josuedavidvl18@gmail.com', icon: 'mail', text: 'Email', external: true }
]
```

**Description**: Defines external favorite links in the sidebar.

**Properties**:
- `href` (string): Full URL or mailto link
- `icon` (string): Lucide icon name
- `text` (string): Display text
- `external` (boolean): Whether link opens in new tab

## Functions

### generateSidebar()

```javascript
string generateSidebar()
```

**Description**: Generates the complete HTML string for the application sidebar.

**Returns**: HTML string containing the sidebar structure

**Features Included**:
- User section with avatar/username
- Search trigger button
- Main navigation menu
- Favorites section
- Theme toggle button
- Mobile-responsive language selector

**Dynamic Content**:
- Current page highlighting
- Translated text content
- Theme state indication
- Language selection UI

**Example Output Structure**:
```html
<aside class="sidebar border-r border-[var(--ui-border)] bg-[var(--ui-sidebar-bg)] flex flex-col overflow-y-auto">
  <!-- Top Section -->
  <div class="p-3">
    <div class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--ui-hover)] cursor-pointer mb-1">
      <i data-lucide="user"></i>
      <span>davidwebgt</span>
    </div>
    <!-- Search and navigation content -->
  </div>
  <!-- Bottom Section -->
  <div class="mt-auto p-3 border-t border-[var(--ui-border)]">
    <!-- Theme and language controls -->
  </div>
</aside>
```

### generateTopbar(breadcrumb)

```javascript
string generateTopbar(BreadcrumbArray breadcrumb)
```

**Description**: Generates the HTML string for the application topbar with breadcrumb navigation.

**Parameters**:
- `breadcrumb` (string[]): Array of breadcrumb segments

**Returns**: HTML string containing the topbar structure

**Features Included**:
- Breadcrumb navigation with click handlers
- Share button
- Options menu (CV download, reading mode, source code)
- Mobile-specific controls (language and theme)
- Responsive design elements

**Breadcrumb Handling**:
- Translates breadcrumb keys using i18n
- Makes parent items clickable
- Shows current page as non-clickable
- Separates items with "/" delimiter

**Example**:
```javascript
const topbarHtml = generateTopbar(['nav.home', 'nav.projects']);
```

**Options Menu Items**:
- **Download CV**: Triggers file download
- **Reading Mode**: Toggles distraction-free reading
- **View Source**: Opens GitHub repository
- **Mobile Controls**: Language and theme toggles

### toggleList(element)

```javascript
void toggleList(HTMLElement element)
```

**Description**: Toggles the visibility of a collapsible list with arrow rotation animation.

**Parameters**:
- `element` (HTMLElement): The trigger element containing the arrow

**Behavior**:
1. Finds the next sibling content element
2. Toggles the 'open' class
3. Rotates the arrow icon (0° ↔ 90°)
4. Animates content height (0 ↔ auto)

**DOM Structure Expected**:
```html
<div class="toggle-trigger">
  <i class="toggle-arrow"></i>
  Title
</div>
<div class="toggle-content">
  Collapsible content
</div>
```

### updateTopbar()

```javascript
void updateTopbar()
```

**Description**: Updates the existing topbar by regenerating it with current state.

**Behavior**:
1. Finds the header element with `role="banner"`
2. Retrieves breadcrumb data from `dataset.breadcrumb`
3. Parses JSON breadcrumb array
4. Regenerates topbar HTML
5. Recreates Lucide icons
6. Handles errors gracefully

**Error Handling**:
- Logs warnings for invalid breadcrumb data
- Continues with default breadcrumb if parsing fails
- No UI disruption on update failures

### insertTopbar()

```javascript
void insertTopbar()
```

**Description**: Inserts the topbar into the DOM by replacing a placeholder element.

**Behavior**:
1. Finds element with id `topbar-placeholder`
2. Extracts breadcrumb from `dataset.breadcrumb`
3. Generates topbar HTML
4. Replaces placeholder with topbar
5. Recreates Lucide icons

**Default Breadcrumb**:
- Uses `['Workspace']` if no data attribute found
- Validates breadcrumb array structure
- Handles JSON parsing errors

## Global Functions

### updateTopbar (Global)

```javascript
window.updateTopbar = updateTopbar
```

**Description**: Makes the updateTopbar function globally available for cross-module access.

## Event Handlers

### DOMContentLoaded Handler

```javascript
document.addEventListener('DOMContentLoaded', function () {
  if (window.i18n && window.i18n.isLoaded) {
    insertTopbar();
  } else {
    window.addEventListener('i18nReady', insertTopbar);
  }
});
```

**Description**: Initializes the topbar when the DOM is ready and i18n is loaded.

**Behavior**:
- Waits for i18n system to be ready
- Inserts topbar with proper translations
- Handles both immediate and delayed initialization

## Dependencies

### Internal Modules
- **i18n**: For text translation and language state
- **theme**: For theme state and icon selection
- **utils**: For shared DOM manipulation utilities

### Browser APIs
- **DOM API**: For element selection and manipulation
- **JSON API**: For breadcrumb data parsing
- **LocalStorage**: For reading mode state

### External Libraries
- **Lucide Icons**: For icon rendering (recreated after DOM updates)

## Performance Characteristics

### Rendering Performance
- **HTML Generation**: Fast string concatenation
- **DOM Insertion**: Single innerHTML assignment
- **Icon Recreation**: Minimal overhead with caching

### Memory Usage
- **Static Constants**: Minimal memory footprint
- **Generated HTML**: Garbage collected after insertion
- **Event Listeners**: Properly managed and cleaned up

### Update Frequency
- **Topbar Updates**: Only when language or theme changes
- **Sidebar Generation**: On-demand, not cached
- **Icon Recreation**: Only after DOM manipulation

## Accessibility Features

### Semantic HTML
- **Navigation**: Proper `<nav>` elements with `role` attributes
- **Buttons**: Semantic button elements with ARIA labels
- **Links**: Proper anchor elements with external link indicators

### Keyboard Navigation
- **Tab Order**: Logical navigation through interactive elements
- **Focus Management**: Visible focus indicators
- **Shortcut Support**: Cmd+K for search (documented)

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for icon buttons
- **Skip Links**: Accessibility skip to main content
- **Alt Text**: Meaningful alternative text for images

## Responsive Design

### Breakpoints
- **Desktop** (> 1024px): Full sidebar and topbar
- **Tablet** (768px - 1023px): Condensed sidebar
- **Mobile** (< 768px): Hidden sidebar, overlay controls

### Mobile Optimizations
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Potential for sidebar swipe (not implemented)
- **Viewport Adaptation**: Proper viewport meta tags

## Error Handling

### Translation Failures
- Falls back to English/default text
- Continues rendering without blocking
- Logs warnings for debugging

### DOM Manipulation Errors
- Graceful degradation if elements not found
- Error boundaries prevent full page breaks
- Console warnings for troubleshooting

### Icon Loading Failures
- Continues without icons if Lucide fails to load
- CSS fallbacks for critical visual elements
- No functional impact from icon failures

## Testing

### Unit Tests
- HTML generation accuracy
- Translation integration
- DOM manipulation correctness
- Event handler attachment

### Integration Tests
- Full sidebar rendering
- Topbar update workflows
- Mobile responsiveness
- Accessibility compliance

### Visual Tests
- Cross-browser appearance
- Theme consistency
- Responsive breakpoints
- Animation smoothness

## Usage Examples

### Sidebar Generation
```javascript
const sidebarHtml = generateSidebar();
// Insert into DOM
document.querySelector('.app').insertAdjacentHTML('afterbegin', sidebarHtml);
```

### Topbar with Breadcrumb
```javascript
const breadcrumb = ['nav.home', 'nav.projects'];
const topbarHtml = generateTopbar(breadcrumb);
document.getElementById('topbar-placeholder').outerHTML = topbarHtml;
```

### Dynamic Updates
```javascript
// Update topbar after language change
window.addEventListener('languageChanged', () => {
  updateTopbar();
});
```

## Future Enhancements

### Planned Features
- Swipe gestures for mobile sidebar
- Keyboard shortcuts customization
- Theme transition animations
- Component-based architecture migration

### Potential Improvements
- Virtual scrolling for large navigation lists
- Lazy loading for sidebar content
- Advanced animation libraries integration
- A11y audit automation