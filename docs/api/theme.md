# Theme Module API

## Overview

The Theme module manages light/dark theme switching for the David Vargas Portfolio. It provides automatic system preference detection, user preference persistence, and seamless theme transitions.

## Functions

### toggleTheme()

```javascript
void toggleTheme()
```

**Description**: Toggles between light and dark themes with persistence and UI updates.

**Behavior**:
1. Toggles 'dark' class on `document.documentElement`
2. Determines new theme state (light/dark)
3. Saves preference to LocalStorage
4. Updates options menu UI
5. Dispatches theme change event (if updateTopbar available)

**Theme State Logic**:
```javascript
const html = document.documentElement;
const isDark = html.classList.toggle('dark');
localStorage.setItem('theme', isDark ? 'dark' : 'light');
```

**Side Effects**:
- Updates CSS custom properties via class toggle
- Persists user preference
- Triggers UI updates in dependent components
- Dispatches `themeChanged` event

**Example**:
```javascript
// Toggle theme (light ↔ dark)
toggleTheme();
```

### getValidatedTheme()

```javascript
string|null getValidatedTheme()
```

**Description**: Retrieves and validates the saved theme preference from LocalStorage.

**Returns**: `'light'`, `'dark'`, or `null` if invalid/not set

**Validation Logic**:
```javascript
function getValidatedTheme() {
  const savedTheme = localStorage.getItem('theme');
  return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : null;
}
```

**Use Cases**:
- Initial theme application on page load
- Theme state checking for UI updates
- Fallback handling for invalid preferences

### getValidatedReadingMode()

```javascript
boolean getValidatedReadingMode()
```

**Description**: Retrieves and validates the reading mode preference from LocalStorage.

**Returns**: `true` if reading mode is enabled, `false` otherwise

**Validation Logic**:
```javascript
function getValidatedReadingMode() {
  const saved = localStorage.getItem('readingMode');
  return saved === 'true';
}
```

**Note**: This function is duplicated in theme.js and utils.js for separation of concerns.

## Initialization Code

### Theme Auto-Detection

```javascript
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
```

**Description**: Immediately invoked function that applies the correct theme on page load.

**Logic Flow**:
1. Check if dark class already applied (from inline script)
2. Detect system preference via `prefers-color-scheme`
3. Check saved user preference
4. Apply dark theme if:
   - User explicitly chose dark, OR
   - No saved preference AND system prefers dark
5. Save system preference to LocalStorage if used

### DOMContentLoaded Handler

```javascript
document.addEventListener('DOMContentLoaded', function () {
  if (window.i18n && window.i18n.isLoaded) {
    updateOptionsMenu();
  } else {
    window.addEventListener('i18nReady', updateOptionsMenu);
  }
});
```

**Description**: Ensures theme UI is updated after i18n initialization.

**Behavior**:
- Waits for i18n system to be ready
- Updates options menu with correct theme state
- Handles both immediate and delayed initialization

### Reading Mode Initialization

```javascript
document.addEventListener('DOMContentLoaded', function () {
  const readingModeEnabled = getValidatedReadingMode();
  if (readingModeEnabled) {
    document.body.classList.add('reading-mode');
  }
});
```

**Description**: Applies reading mode class on page load if enabled.

**Behavior**:
- Checks LocalStorage for reading mode preference
- Applies 'reading-mode' class to body if enabled
- No dependency on other modules

## CSS Custom Properties

### Light Theme (Default)
```css
:root {
  --ui-bg: #FFFFFF;
  --ui-sidebar-bg: #FFFFFF;
  --ui-hover: #F7F7F5;
  --ui-border: rgba(55, 53, 47, 0.09);
  --page-bg: #FFFFFF;
  --text-primary: #37352F;
  --text-secondary: rgba(55, 53, 47, 0.6);
  --text-tertiary: rgba(55, 53, 47, 0.4);
  --accent-blue: #0A7AFF;
  --accent-blue-light: #F0F6FF;
}
```

### Dark Theme Override
```css
html.dark {
  --ui-bg: #191919;
  --ui-sidebar-bg: #191919;
  --ui-hover: rgba(255, 255, 255, 0.08);
  --ui-border: rgba(255, 255, 255, 0.12);
  --page-bg: #191919;
  --text-primary: #EAEAEA;
  --text-secondary: #B8B8B8;
  --text-tertiary: #8A8A8A;
  --accent-blue: #3291FF;
  --accent-blue-light: rgba(50, 145, 255, 0.15);
}
```

### Reading Mode Override
```css
body.reading-mode {
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
  padding-left: 2rem;
  padding-right: 2rem;
  font-size: 18px;
  line-height: 1.7;
}

body.reading-mode .sidebar {
  display: none !important;
}

body.reading-mode h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

body.reading-mode h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}
```

## Dependencies

### Browser APIs
- **LocalStorage**: For theme and reading mode persistence
- **matchMedia**: For system preference detection
- **DOM API**: For class manipulation and element access

### Internal Modules
- **i18n**: For theme text translation in UI
- **UI Components**: For options menu updates

### External Libraries
- None (pure browser APIs)

## Performance Characteristics

### Theme Switching
- **DOM Manipulation**: Single class toggle operation
- **CSS Recalculation**: Efficient custom property updates
- **Persistence**: Fast LocalStorage synchronous write
- **UI Updates**: Minimal DOM queries and updates

### Initialization
- **Immediate Execution**: Theme applied before render
- **System Detection**: Fast matchMedia query
- **Storage Access**: Synchronous LocalStorage read
- **Class Application**: Direct DOM class manipulation

### Memory Usage
- **Static Functions**: Minimal memory footprint
- **Event Listeners**: Single DOMContentLoaded handler
- **No Global State**: Functions only, no persistent objects

## Accessibility Features

### System Preference Respect
- **prefers-color-scheme**: Honors user's OS theme setting
- **Automatic Detection**: Applies system preference by default
- **User Override**: Allows manual preference setting

### Visual Accessibility
- **Contrast Ratios**: WCAG AA compliant in both themes
- **Focus Indicators**: Visible focus in light and dark modes
- **Color Independence**: No color-only information conveyance

### Transition Handling
- **Smooth Transitions**: CSS transitions for theme changes
- **No Flash**: Inline script prevents FOUC (Flash of Unstyled Content)
- **Progressive Enhancement**: Works without JavaScript

## Error Handling

### LocalStorage Failures
- **Quota Exceeded**: Continues without persistence
- **Access Denied**: Falls back to system preference
- **Corruption**: Validates stored values

### DOM Manipulation Errors
- **Element Not Found**: Graceful degradation
- **Class Toggle Failure**: Continues execution
- **CSS Property Issues**: Visual fallbacks

### System Detection Errors
- **matchMedia Unavailable**: Falls back to light theme
- **Invalid Preferences**: Uses default values
- **Race Conditions**: Inline script ensures early execution

## Testing

### Unit Tests
- Theme validation functions
- LocalStorage operations
- System preference detection
- Class manipulation accuracy

### Integration Tests
- Full theme switching workflow
- Persistence across page reloads
- System preference integration
- UI component updates

### Visual Tests
- Theme appearance consistency
- Transition smoothness
- Reading mode layout
- Cross-browser compatibility

## Usage Examples

### Manual Theme Toggle
```javascript
// Toggle between light and dark
toggleTheme();

// Check current theme
const currentTheme = getValidatedTheme(); // 'light' | 'dark' | null
```

### Theme Detection
```javascript
// Get validated theme with fallback
const theme = getValidatedTheme() || 'light';

// Apply theme class
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}
```

### Reading Mode Control
```javascript
// Check reading mode
const readingEnabled = getValidatedReadingMode();

// Apply reading mode
if (readingEnabled) {
  document.body.classList.add('reading-mode');
}
```

### Event Integration
```javascript
// Listen for theme changes
window.addEventListener('themeChanged', (event) => {
  console.log('Theme changed to:', event.detail.theme);
});
```

## Browser Compatibility

### Supported Browsers
- **CSS Custom Properties**: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 16+
- **LocalStorage**: IE 8+
- **matchMedia**: IE 10+
- **classList**: IE 10+

### Fallback Behavior
- **Older Browsers**: Light theme only
- **No LocalStorage**: System preference only
- **No matchMedia**: Light theme default
- **Progressive Enhancement**: Core functionality preserved

## Future Enhancements

### Planned Features
- High contrast theme variant
- Custom color scheme selection
- Theme transition animations
- Per-component theme overrides

### Potential Improvements
- Theme persistence across subdomains
- Theme export/import functionality
- Advanced color customization
- Theme performance monitoring