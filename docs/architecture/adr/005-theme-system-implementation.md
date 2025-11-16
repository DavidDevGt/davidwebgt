# ADR 005: Theme System Implementation

## Status
Accepted

## Context
The portfolio needed a theme system for light/dark mode support. Key requirements included:

- Light and dark theme variants
- System preference detection
- User preference persistence
- Smooth theme transitions
- CSS custom property usage
- Performance optimization

Available options included:
- CSS custom properties with JavaScript toggling
- CSS class switching on document element
- Separate CSS files for each theme
- CSS-in-JS solutions
- Preprocessor variables with compilation

## Decision
Implement theme system using CSS custom properties with JavaScript class toggling and LocalStorage persistence.

## Rationale

### Theme Requirements Analysis
- **Theme Variants**: Light and dark modes
- **Persistence**: User preference saved across sessions
- **Performance**: Fast theme switching without page reload
- **System Integration**: Respect OS theme preference
- **Accessibility**: Proper contrast ratios in both themes

### Chosen Approach Benefits
- **CSS Custom Properties**: Dynamic theme values without CSS recompilation
- **Class-Based Switching**: Efficient theme toggling
- **LocalStorage Persistence**: User preferences survive browser sessions
- **System Preference Detection**: Automatic theme based on OS setting
- **Smooth Transitions**: CSS transitions for theme changes

### CSS Custom Properties Structure
```css
:root {
  /* Light theme defaults */
  --ui-bg: #FFFFFF;
  --text-primary: #37352F;
  --accent-blue: #0A7AFF;
}

html.dark {
  /* Dark theme overrides */
  --ui-bg: #191919;
  --text-primary: #EAEAEA;
  --accent-blue: #3291FF;
}
```

### Theme Switching Logic
```javascript
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  // Notify other components
  window.dispatchEvent(new CustomEvent('themeChanged', {
    detail: { theme: isDark ? 'dark' : 'light' }
  }));
}
```

## Consequences

### Positive
- Fast theme switching without page reload
- Persistent user preferences
- System preference integration
- Smooth CSS transitions
- Easy theme customization

### Negative
- CSS custom property support required (IE11+)
- Flash of unstyled content possible
- Complex color palette management
- Theme consistency across components

### Mitigation
- Progressive enhancement for older browsers
- Inline critical theme styles
- Theme validation and fallbacks
- Comprehensive theme testing

## Alternatives Considered

### Separate CSS Files
- **Pros**: Clean separation, no runtime overhead
- **Cons**: Page reload required, complex loading logic
- **Rejected**: Poor user experience with reloads

### CSS-in-JS
- **Pros**: Dynamic theming, JavaScript integration
- **Cons**: Bundle size, runtime performance, no framework
- **Rejected**: Not applicable for vanilla JavaScript

### Preprocessor Variables
- **Pros**: Compile-time optimization, clean syntax
- **Cons**: Requires build process, less dynamic
- **Rejected**: Static compilation doesn't support runtime switching

### CSS Custom Properties Only
- **Pros**: Pure CSS solution, fast switching
- **Cons**: No persistence, no system preference detection
- **Rejected**: Missing user preference features

## Implementation Details

### Theme Initialization
```javascript
function initializeTheme() {
  // Check for saved preference
  const savedTheme = localStorage.getItem('theme');

  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine initial theme
  let initialTheme;
  if (savedTheme) {
    initialTheme = savedTheme;
  } else if (prefersDark) {
    initialTheme = 'dark';
  } else {
    initialTheme = 'light';
  }

  // Apply theme
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  // Save if system preference was used
  if (!savedTheme && prefersDark) {
    localStorage.setItem('theme', 'dark');
  }
}
```

### Theme Variables Organization
```css
:root {
  /* Background colors */
  --ui-bg: #FFFFFF;
  --ui-sidebar-bg: #FFFFFF;
  --ui-hover: #F7F7F5;
  --ui-border: rgba(55, 53, 47, 0.09);
  --page-bg: #FFFFFF;

  /* Text colors */
  --text-primary: #37352F;
  --text-secondary: rgba(55, 53, 47, 0.6);
  --text-tertiary: rgba(55, 53, 47, 0.4);

  /* Accent colors */
  --accent-blue: #0A7AFF;
  --accent-blue-light: #F0F6FF;
}

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

### Theme Transition Handling
```css
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
```

## Performance Considerations
- **CSS Custom Properties**: Fast runtime updates
- **Class Switching**: Minimal DOM manipulation
- **Transition Effects**: Smooth visual feedback
- **Memory Usage**: No additional JavaScript overhead

## Accessibility Considerations
- **Contrast Ratios**: WCAG AA compliance in both themes
- **Focus Indicators**: Visible focus in both light and dark
- **Color Independence**: No color-only information conveyance
- **System Integration**: Respects user accessibility preferences

## Testing Strategy
- **Visual Testing**: Theme appearance verification
- **Functional Testing**: Theme switching and persistence
- **Accessibility Testing**: Contrast and focus indicator validation
- **Cross-Browser Testing**: Theme support across browsers

## Maintenance Considerations
- **Color Palette Updates**: Centralized custom property management
- **Theme Extensions**: Easy addition of new theme variants
- **Consistency Checks**: Automated theme validation
- **Documentation**: Theme usage guidelines for components

## Related Decisions
- ADR 002: State Management Approach
- ADR 008: CSS Architecture
- ADR 009: Design System

## Future Considerations
- **Additional Themes**: High contrast, colorblind-friendly variants
- **Dynamic Theming**: User-customizable color schemes
- **Theme Transitions**: More sophisticated transition animations
- **Component Themes**: Theme variants for specific components

## Browser Compatibility
- **CSS Custom Properties**: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 16+
- **ClassList API**: IE10+
- **LocalStorage**: IE8+
- **MatchMedia**: IE10+

## Date
2024-01-15

## Author
David Vargas