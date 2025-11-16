# Internationalization (i18n) Documentation

## Overview

The David Vargas Portfolio implements comprehensive internationalization support for English and Spanish, providing a localized experience for users in different regions.

## Supported Languages

### Primary Languages
- **Spanish (es)**: Default language, primary audience
- **English (en)**: Secondary language, international reach

### Language Detection
1. **Saved Preference**: LocalStorage `language` value
2. **Browser Language**: `navigator.language` detection
3. **Fallback**: Spanish as default

## Translation Files

### Structure
```
assets/i18n/
├── en.json    # English translations
└── es.json    # Spanish translations
```

### File Format
```json
{
  "nav": {
    "home": "Home",
    "projects": "My Projects"
  },
  "home": {
    "title": "Home",
    "subtitle": "..."
  }
}
```

## Implementation

### Key Features
- **Client-side Translation**: No server dependency
- **Nested Keys**: Dot notation support (`nav.home`)
- **Fallback Text**: Default values for missing translations
- **DOM Integration**: Automatic element translation
- **Persistent Choice**: Language preference saved

### Translation Loading
- **Asynchronous**: Non-blocking translation loading
- **Caching**: Translations cached in memory
- **Error Handling**: Fallback to Spanish on load failure
- **Lazy Loading**: Translations loaded on demand

## Usage

### HTML Integration
```html
<!-- Simple translation -->
<span data-i18n="nav.home"></span>

<!-- With title attribute -->
<button data-i18n="nav.search" data-i18n-title="nav.searchTitle"></button>

<!-- Form placeholders -->
<input data-i18n="search.placeholder" type="text">
```

### JavaScript Usage
```javascript
// Direct translation
const text = i18n.t('nav.home');

// With fallback
const text = i18n.t('missing.key', 'Default Text');

// Language switching
await i18n.changeLanguage('en');
```

## Language Switching

### UI Elements
- **Language Button**: Shows current language flag and name
- **Language Menu**: Dropdown with available languages
- **Mobile Support**: Collapsed menu on small screens

### Process Flow
1. **User Selection**: Click language button/menu
2. **Validation**: Check if language is supported
3. **Loading**: Fetch new translation file
4. **Application**: Update all DOM elements
5. **Persistence**: Save preference to LocalStorage
6. **Notification**: Dispatch `languageChanged` event

## Content Management

### Adding Translations
1. **Identify Key**: Create unique dot-notation key
2. **Add to Files**: Update both `en.json` and `es.json`
3. **Test**: Verify in both languages
4. **Deploy**: Include in next release

### Translation Guidelines
- **Consistency**: Use same terms across the site
- **Context**: Consider cultural differences
- **Length**: Account for text expansion
- **Technical Terms**: Maintain consistency for technical terms

## Performance

### Loading Impact
- **File Size**: ~10KB for both language files
- **Load Time**: Minimal impact on page load
- **Memory Usage**: Cached translations in memory
- **Runtime**: Fast key lookups

### Optimization
- **Deferred Loading**: Translations load after critical content
- **Caching**: Browser cache for translation files
- **Minification**: JSON files can be minified
- **Compression**: Gzip compression on server

## Browser Support

### Compatibility
- **Modern Browsers**: Full i18n support
- **Legacy Browsers**: Progressive enhancement
- **No JavaScript**: Core content still accessible
- **Fetch API**: Required for translation loading

### Fallback Behavior
- **Translation Failure**: Display fallback text
- **Language Unavailable**: Fall back to Spanish
- **Network Issues**: Use cached or default content

## Testing

### Validation Checks
- **Key Presence**: All keys exist in both files
- **Syntax**: Valid JSON format
- **Encoding**: UTF-8 encoding
- **Escaping**: Proper character escaping

### Functional Testing
- **Language Switching**: All UI updates correctly
- **Persistence**: Preference survives browser restart
- **Fallbacks**: Missing keys show appropriate defaults
- **Performance**: No significant loading delays

## Future Enhancements

### Planned Features
- **Additional Languages**: French, German support
- **Dynamic Loading**: Load languages on demand
- **Translation Editor**: In-browser translation management
- **Pluralization**: Support for plural forms
- **Date/Number Formatting**: Localized formatting

### Advanced Capabilities
- **RTL Support**: Right-to-left language support
- **Currency Formatting**: Localized price display
- **Time Zones**: Localized date/time handling
- **Content Negotiation**: Server-driven language detection