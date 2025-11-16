# Theme System Documentation

## Overview

The theme system provides light and dark mode support with automatic system preference detection, user preference persistence, and smooth theme transitions.

## Theme Variants

### Light Theme (Default)
- **Background**: Clean white backgrounds
- **Text**: Dark text for readability
- **Accents**: Blue accent colors
- **Borders**: Subtle gray borders

### Dark Theme
- **Background**: Dark gray/black backgrounds
- **Text**: Light text for contrast
- **Accents**: Bright blue accents
- **Borders**: Dark gray borders

### Reading Mode
- **Centered Layout**: Focused reading experience
- **Increased Typography**: Better readability
- **Hidden Sidebar**: Distraction-free interface
- **Larger Spacing**: Improved content flow

## Implementation

### CSS Custom Properties
```css
:root {
  --ui-bg: #FFFFFF;
  --text-primary: #37352F;
  --accent-blue: #0A7AFF;
  /* ... other variables */
}

html.dark {
  --ui-bg: #191919;
  --text-primary: #EAEAEA;
  --accent-blue: #3291FF;
  /* ... dark overrides */
}
```

### Theme Switching
- **Class Toggle**: `document.documentElement.classList.toggle('dark')`
- **Persistence**: LocalStorage saves user preference
- **System Detection**: `prefers-color-scheme` media query
- **Smooth Transitions**: CSS transitions for visual feedback

## Features

### Automatic Detection
- **System Preference**: Respects OS theme setting
- **User Override**: Manual preference takes precedence
- **Fallback**: Light theme as safe default

### Persistence
- **LocalStorage**: `theme` key stores user choice
- **Session Memory**: Reading mode state
- **Cross-Session**: Preferences survive browser restarts

### Performance
- **Instant Switching**: CSS class toggle only
- **No Page Reload**: Dynamic theme changes
- **Memory Efficient**: Minimal JavaScript overhead
- **Hardware Accelerated**: GPU-accelerated transitions

## User Experience

### Theme Selection
- **Sidebar Control**: Theme toggle button
- **Mobile Support**: Accessible on all devices
- **Visual Feedback**: Immediate theme change
- **State Indication**: Icon shows current theme

### Reading Mode
- **Dedicated Toggle**: Options menu access
- **Layout Changes**: Centered, wider content area
- **Typography**: Larger fonts, better spacing
- **Focus**: Distraction-free reading experience

## Technical Details

### CSS Architecture
- **Custom Properties**: Dynamic value updates
- **Cascade**: Theme classes override defaults
- **Inheritance**: Automatic child element theming
- **Modularity**: Separate concerns for different components

### JavaScript Integration
- **Theme Module**: Dedicated theme management
- **State Synchronization**: Updates dependent components
- **Event System**: Notifies theme changes
- **Validation**: Ensures valid theme values

## Browser Compatibility

### Modern Support
- **CSS Custom Properties**: Chrome 49+, Firefox 31+
- **LocalStorage**: IE 8+ (degraded experience)
- **matchMedia**: IE 10+ (no system detection)

### Progressive Enhancement
- **Fallback**: Light theme for unsupported browsers
- **No JavaScript**: Basic theming through CSS
- **Graceful Degradation**: Works without theme switching

## Accessibility

### Contrast Compliance
- **WCAG AA**: All text meets contrast requirements
- **Focus Indicators**: Visible in both themes
- **Color Independence**: No color-only information
- **User Control**: Respects user accessibility preferences

### System Integration
- **OS Preference**: Honors system theme setting
- **High Contrast**: Works with high contrast modes
- **Reduced Motion**: Respects motion preferences

## Development

### Adding Theme Support
1. **Use CSS Variables**: Reference custom properties
2. **Test Both Themes**: Validate appearance
3. **Check Contrast**: Ensure accessibility compliance
4. **Document Changes**: Update theme documentation

### Theme Customization
- **Color Palette**: Consistent color relationships
- **Typography**: Theme-appropriate text colors
- **Spacing**: Consistent across themes
- **Components**: Theme-aware component styling

## Testing

### Theme Validation
- **Visual Testing**: Appearance in both themes
- **Functional Testing**: Theme switching works
- **Persistence Testing**: Preferences survive reloads
- **System Testing**: OS preference detection

### Accessibility Testing
- **Contrast Checking**: Automated ratio validation
- **Screen Reader**: Theme changes announced
- **Keyboard Navigation**: Works in both themes
- **High Contrast**: Compatibility validation

## Performance Monitoring

### Metrics
- **Switch Time**: Theme change response time
- **Memory Usage**: Theme system memory footprint
- **CSS Recalculation**: Style recalculation impact
- **Paint Time**: Visual update performance

### Optimization
- **Minimal DOM**: Single class toggle
- **Efficient CSS**: Fast property updates
- **Cached Styles**: Browser CSS caching
- **Hardware Acceleration**: GPU transitions

## Future Enhancements

### Planned Features
- **Custom Themes**: User-defined color schemes
- **Theme Transitions**: Animated theme changes
- **Component Themes**: Theme variants per component
- **Theme Export**: Save/load theme configurations

### Advanced Capabilities
- **Dynamic Theming**: Runtime color customization
- **Theme Marketplace**: Community theme sharing
- **Accessibility Themes**: High contrast variants
- **Seasonal Themes**: Time-based theme changes