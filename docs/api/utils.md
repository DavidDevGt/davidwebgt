# Utils Module API

## Overview

The Utils module provides shared utility functions and cross-cutting concerns for the David Vargas Portfolio. It includes DOM manipulation helpers, browser API integrations, and common UI patterns.

## Functions

### sharePage()

```javascript
void sharePage()
```

**Description**: Shares the current page using the Web Share API with clipboard fallback.

**Behavior**:
1. Gets current page URL and title
2. Attempts Web Share API first
3. Falls back to clipboard copy
4. Shows user feedback on success

**Web Share API Usage**:
```javascript
if (navigator.share) {
  navigator.share({
    title: document.title,
    url: window.location.href
  }).catch(console.error);
}
```

**Clipboard Fallback**:
```javascript
navigator.clipboard.writeText(url).then(() => {
  showShareFeedback('Enlace copiado al portapapeles');
});
```

**Legacy Fallback** (for older browsers):
```javascript
const textArea = document.createElement('textarea');
textArea.value = url;
document.body.appendChild(textArea);
textArea.select();
document.execCommand('copy');
document.body.removeChild(textArea);
```

### showShareFeedback(message)

```javascript
void showShareFeedback(string message)
```

**Description**: Shows a temporary feedback message after sharing actions.

**Parameters**:
- `message` (string): The feedback message to display

**Behavior**:
1. Creates a fixed-position feedback element
2. Styles with accent background color
3. Appends to document body
4. Auto-removes after 2 seconds

**Styling**:
```css
.fixed.top-4.right-4.bg-[var(--accent-blue)].text-white.px-4.py-2.rounded.shadow-lg.z-50
```

**Accessibility**: High z-index ensures visibility, positioned for screen readers.

### toggleOptionsMenu()

```javascript
void toggleOptionsMenu()
```

**Description**: Toggles the visibility of the options menu in the topbar.

**Behavior**:
- Toggles 'hidden' class on `#options-menu` element
- No animation (instant show/hide)
- Used for CV download, reading mode, source code links

### downloadCV()

```javascript
void downloadCV()
```

**Description**: Triggers download of the CV PDF file.

**Behavior**:
1. Creates temporary anchor element
2. Sets href to `assets/cv.pdf`
3. Sets download attribute with filename
4. Programmatically clicks the link
5. Removes temporary element
6. Closes options menu

**Implementation**:
```javascript
const link = document.createElement('a');
link.href = 'assets/cv.pdf';
link.download = 'David_Vargas_CV.pdf';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

### updateOptionsMenu()

```javascript
void updateOptionsMenu()
```

**Description**: Updates the options menu with current theme and reading mode state.

**Behavior**:
1. Updates reading mode button icon and text
2. Updates theme button icon and text
3. Recreates Lucide icons after DOM updates
4. Handles i18n translations

**Reading Mode Logic**:
```javascript
const readingModeEnabled = localStorage.getItem('readingMode') === 'true';
const icon = readingModeEnabled ? 'book' : 'book-open';
const text = i18n.t(readingModeEnabled ? 'nav.exitReadingMode' : 'nav.readingMode');
```

**Theme Logic**:
```javascript
const isDark = document.documentElement.classList.contains('dark');
const themeIcon = isDark ? 'sun' : 'moon';
const themeText = i18n.t('nav.theme');
```

### toggleReadingMode()

```javascript
void toggleReadingMode()
```

**Description**: Toggles reading mode on/off with persistence and UI updates.

**Behavior**:
1. Checks current reading mode state
2. Toggles 'reading-mode' class on body
3. Saves preference to LocalStorage
4. Updates options menu
5. Closes options menu

**Reading Mode Effects**:
- Centers content with max-width
- Increases font size and line height
- Hides sidebar
- Adjusts heading sizes

### getValidatedReadingMode()

```javascript
boolean getValidatedReadingMode()
```

**Description**: Retrieves validated reading mode preference from LocalStorage.

**Returns**: `true` if reading mode is enabled, `false` otherwise

**Validation**: Only returns `true` if LocalStorage value is exactly `'true'`

### viewSourceCode()

```javascript
void viewSourceCode()
```

**Description**: Opens the GitHub repository in a new tab.

**Behavior**:
- Opens `https://github.com/DavidDevGt/davidwebgt` in new window
- Closes options menu
- Uses `target="_blank"` for external navigation

### closeOptionsMenu()

```javascript
void closeOptionsMenu()
```

**Description**: Hides the options menu.

**Behavior**: Adds 'hidden' class to `#options-menu` element.

### updateTopbar()

```javascript
void updateTopbar()
```

**Description**: Updates the topbar with current translations and state.

**Behavior**:
1. Finds header element with `role="banner"`
2. Parses breadcrumb from `dataset.breadcrumb`
3. Regenerates topbar HTML using `generateTopbar()`
4. Recreates Lucide icons
5. Handles JSON parsing errors gracefully

**Error Handling**:
- Warns on invalid breadcrumb data
- Continues with partial updates
- No UI disruption

### insertTopbar()

```javascript
void insertTopbar()
```

**Description**: Inserts the topbar into the DOM by replacing placeholder.

**Behavior**:
1. Finds `#topbar-placeholder` element
2. Extracts breadcrumb data
3. Generates topbar HTML
4. Replaces placeholder with topbar
5. Recreates Lucide icons

**Default Breadcrumb**: `['Workspace']` if no data provided

## Animation Functions

### staggerAnimateBlocks()

```javascript
void staggerAnimateBlocks()
```

**Description**: Animates content blocks with staggered delay for entrance effects.

**Behavior**:
1. Selects all elements with `.notion-block` class
2. Adds `animate-in` class with 100ms delays between elements
3. Creates cascading animation effect

**Implementation**:
```javascript
const blocks = document.querySelectorAll('.notion-block');
blocks.forEach((block, index) => {
  setTimeout(() => {
    block.classList.add('animate-in');
  }, index * 100);
});
```

### Intersection Observer Setup

```javascript
document.addEventListener('DOMContentLoaded', function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        staggerAnimateBlocks();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const main = document.querySelector('main');
  if (main) {
    observer.observe(main);
  }
});
```

**Description**: Triggers animations when main content comes into view.

**Configuration**:
- `threshold: 0.1` - Triggers when 10% visible
- `rootMargin: '0px 0px -50px 0px'` - Triggers 50px before entering viewport

## Event Listeners

### Options Menu Click Outside

```javascript
document.addEventListener('click', (e) => {
  const menu = document.getElementById('options-menu');
  const btn = document.getElementById('options-btn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    closeOptionsMenu();
  }
});
```

**Description**: Closes options menu when clicking outside.

**Behavior**: Checks if click target is outside menu and button, then closes menu.

### Search Keyboard Shortcut

```javascript
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearchModal();
  }
});
```

**Description**: Opens search modal with keyboard shortcut.

**Behavior**: Cmd+K (Mac) or Ctrl+K (Windows/Linux) opens search.

## Global Exports

```javascript
window.updateOptionsMenu = updateOptionsMenu;
```

**Description**: Makes updateOptionsMenu globally available for cross-module access.

## Dependencies

### Internal Modules
- **i18n**: For translated text in UI elements
- **UI**: For topbar generation functions
- **Search**: For modal opening functionality

### Browser APIs
- **Clipboard API**: For share functionality
- **LocalStorage**: For reading mode persistence
- **Intersection Observer**: For scroll-triggered animations
- **DOM API**: For element manipulation

### External Libraries
- **Lucide Icons**: For icon updates in UI elements

## Performance Characteristics

### Function Execution
- **DOM Queries**: Cached where possible, efficient selectors
- **Memory Usage**: Minimal, no persistent state
- **Event Handling**: Delegated listeners, no memory leaks
- **Animation**: Lightweight CSS transitions

### Bundle Impact
- **Size**: Small utility functions, minimal overhead
- **Loading**: Deferred script loading
- **Execution**: On-demand function calls

## Error Handling

### API Failures
- **Clipboard Unavailable**: Falls back to legacy copy method
- **Share API Rejected**: Falls back to clipboard
- **LocalStorage Errors**: Continues without persistence

### DOM Errors
- **Element Not Found**: Graceful degradation
- **JSON Parse Errors**: Fallback to defaults
- **Icon Recreation Failures**: Continues without icons

## Testing

### Unit Tests
- Utility function correctness
- DOM manipulation accuracy
- Browser API integration
- Error handling paths

### Integration Tests
- Cross-module function calls
- UI state synchronization
- Event handling workflows
- Browser compatibility

## Usage Examples

### Share Functionality
```javascript
// Share current page
sharePage();

// Show custom feedback
showShareFeedback('Custom message');
```

### Menu Management
```javascript
// Toggle options menu
toggleOptionsMenu();

// Close programmatically
closeOptionsMenu();
```

### Reading Mode
```javascript
// Toggle reading mode
toggleReadingMode();

// Check current state
const isReading = getValidatedReadingMode();
```

### File Download
```javascript
// Download CV
downloadCV();
```

## Browser Compatibility

### Modern APIs
- **Clipboard API**: Chrome 66+, fallback provided
- **Intersection Observer**: Polyfill available for older browsers
- **LocalStorage**: IE8+, widely supported

### Progressive Enhancement
- **Share API Unavailable**: Clipboard fallback
- **Observer Not Supported**: Immediate animation trigger
- **Storage Disabled**: In-memory state management

## Future Enhancements

### Planned Features
- Advanced sharing options (social media)
- Custom download filenames
- Animation performance monitoring
- Enhanced keyboard shortcuts

### Potential Improvements
- Share analytics tracking
- Download progress indicators
- Advanced animation easing
- Touch gesture support