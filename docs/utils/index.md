# Utilities Documentation

## Overview

The utilities module provides shared helper functions and cross-cutting concerns for the David Vargas Portfolio, including DOM manipulation, browser API integrations, and common UI patterns.

## Core Functions

### Share Functionality
**sharePage()**: Shares current page using Web Share API with clipboard fallback
- **Web Share API**: Native sharing on supported devices
- **Clipboard Fallback**: Copies URL to clipboard
- **User Feedback**: Shows confirmation message
- **Error Handling**: Graceful fallback on API failure

### File Operations
**downloadCV()**: Triggers download of CV PDF
- **Programmatic Download**: Creates temporary link element
- **File Specification**: `assets/cv.pdf` with custom filename
- **Cleanup**: Removes temporary DOM elements
- **Menu Integration**: Closes options menu after download

### UI State Management
**toggleOptionsMenu()**: Toggles options menu visibility
- **DOM Toggle**: Adds/removes 'hidden' class
- **Event Handling**: Click outside to close
- **Accessibility**: Proper focus management

**closeOptionsMenu()**: Hides options menu
- **State Reset**: Ensures menu is hidden
- **Multiple Triggers**: Called from various actions

### Reading Mode
**toggleReadingMode()**: Toggles distraction-free reading layout
- **Layout Changes**: Centers content, hides sidebar
- **Typography**: Larger fonts, better spacing
- **Persistence**: Saves preference to LocalStorage
- **UI Updates**: Updates menu indicators

**getValidatedReadingMode()**: Retrieves reading mode preference
- **Validation**: Strict boolean checking
- **Default**: False if invalid
- **Type Safety**: Ensures boolean return

### Theme Integration
**updateOptionsMenu()**: Synchronizes menu with current state
- **Theme Icons**: Updates sun/moon indicators
- **Reading Mode**: Updates book icons and text
- **Translations**: Applies current language
- **Icon Recreation**: Updates Lucide icons

### Navigation
**updateTopbar()**: Refreshes topbar with current translations
- **DOM Replacement**: Regenerates topbar HTML
- **Breadcrumb Parsing**: Handles JSON breadcrumb data
- **Icon Updates**: Recreates Lucide icons
- **Error Recovery**: Graceful failure handling

**insertTopbar()**: Places topbar in DOM
- **Placeholder Replacement**: Finds and replaces marker
- **Default Breadcrumb**: Provides fallback navigation
- **Initialization**: Called during page setup

### External Links
**viewSourceCode()**: Opens GitHub repository
- **New Tab**: `target="_blank"` for external navigation
- **Menu Cleanup**: Closes options after action
- **Direct Link**: No intermediate redirects

## Animation System

### Content Animations
**staggerAnimateBlocks()**: Progressive content reveal
- **Intersection Trigger**: Activates on scroll into view
- **Staggered Delay**: 100ms intervals between elements
- **Performance**: Hardware-accelerated transforms
- **CSS Classes**: Adds `animate-in` for styling

### Scroll-triggered Animation Setup
- **Observer Configuration**: 10% visibility threshold
- **Root Margin**: Triggers 50px before entering viewport
- **One-time Animation**: Unobserves after triggering
- **DOMContentLoaded**: Initializes on page ready

## Event Handling

### Global Shortcuts
**Search Shortcut**: Cmd+K (Mac) or Ctrl+K (Windows)
- **Cross-platform**: Handles both modifier keys
- **Prevention**: Stops default browser behavior
- **Modal Opening**: Triggers search interface

### Click Outside Handling
**Menu Closure**: Closes options menu when clicking outside
- **Event Delegation**: Single listener on document
- **Target Checking**: Verifies click location
- **Performance**: Efficient event handling

## Browser API Integration

### Clipboard API
- **Modern Support**: Uses `navigator.clipboard.writeText()`
- **Legacy Fallback**: `document.execCommand('copy')`
- **User Experience**: Provides feedback on success/failure

### LocalStorage
- **Preference Storage**: Theme, language, reading mode
- **Validation**: Sanitizes stored values
- **Error Handling**: Continues without persistence on failure

### Fetch API
- **Translation Loading**: Loads language files
- **Error Recovery**: Fallback strategies for network failures
- **Caching**: Leverages browser caching

## Performance Considerations

### Memory Management
- **DOM Cleanup**: Removes temporary elements
- **Event Listeners**: Properly managed lifecycles
- **Caching**: Reuses DOM queries where possible
- **Efficient Updates**: Targeted DOM manipulation

### Loading Optimization
- **Deferred Scripts**: Non-blocking script loading
- **Lazy Initialization**: Features load on demand
- **Resource Hints**: Preconnect for external resources
- **Bundle Size**: Minimal utility overhead

## Error Handling

### API Failures
- **Clipboard Unavailable**: Falls back to legacy methods
- **LocalStorage Full**: Continues with session-only state
- **Network Errors**: Graceful degradation for external calls

### DOM Errors
- **Element Missing**: Checks existence before manipulation
- **JSON Parsing**: Validates data structure
- **Icon Loading**: Continues without visual icons

## Accessibility Features

### Keyboard Navigation
- **Shortcut Support**: Documented keyboard shortcuts
- **Focus Management**: Proper focus handling in modals
- **Screen Reader**: Semantic markup and ARIA labels

### User Feedback
- **Visual Feedback**: Toast messages for actions
- **Loading States**: Clear progress indication
- **Error Messages**: User-friendly error communication

## Testing Strategy

### Unit Testing
- **Function Isolation**: Test individual utilities
- **Mock Dependencies**: Browser API mocking
- **Error Scenarios**: Failure condition testing
- **Edge Cases**: Boundary condition validation

### Integration Testing
- **Cross-module**: Utility interaction with other modules
- **DOM Effects**: Actual DOM manipulation verification
- **Event Handling**: User interaction simulation
- **Browser Compatibility**: Cross-browser validation

## Development Guidelines

### Function Design
- **Single Responsibility**: Each function has one clear purpose
- **Error Resilience**: Graceful handling of failure conditions
- **Performance Focus**: Efficient algorithms and DOM operations
- **Documentation**: Clear JSDoc comments

### Code Organization
- **Logical Grouping**: Related functions together
- **Consistent Naming**: Clear, descriptive function names
- **Parameter Validation**: Input checking and sanitization
- **Return Values**: Consistent return types

## Future Enhancements

### Planned Features
- **Advanced Sharing**: Social media integration
- **Download Progress**: File download indicators
- **Enhanced Shortcuts**: Customizable keyboard shortcuts
- **Animation Library**: More sophisticated transitions

### Performance Improvements
- **Virtual Scrolling**: For large content lists
- **Lazy Loading**: Advanced resource loading strategies
- **Memory Optimization**: Reduced memory footprint
- **Bundle Analysis**: Size optimization opportunities