# ADR 003: Internationalization Approach

## Status
Accepted

## Context
The portfolio needed to support multiple languages for broader audience reach. Key requirements included:

- English and Spanish language support
- Automatic language detection
- Persistent language preferences
- Efficient translation loading
- Minimal performance impact
- Easy content maintenance

Available options included:
- Client-side JSON-based translation
- Server-side translation rendering
- Third-party i18n libraries
- Build-time static generation
- CMS-based translation management

## Decision
Implement client-side internationalization using JSON files with automatic language detection and LocalStorage persistence.

## Rationale

### Translation Requirements
- **Languages**: English and Spanish (primary markets)
- **Content Types**: UI strings, page content, error messages
- **Update Frequency**: Manual updates with deployments
- **Performance**: Minimal loading impact

### Chosen Approach Benefits
- **No Server Dependency**: Works with static hosting
- **Fast Loading**: Client-side caching after initial load
- **Simple Maintenance**: JSON files easy to edit and version control
- **Automatic Detection**: Browser language preference detection
- **Persistent Choice**: User language preference saved
- **Progressive Enhancement**: Works without JavaScript

### Translation File Structure
```javascript
// assets/i18n/en.json
{
  "nav": {
    "home": "Home",
    "projects": "My Projects"
  },
  "home": {
    "title": "Home",
    "subtitle": "Hello! My name is David Vargas..."
  }
}
```

### Language Detection Logic
1. **LocalStorage Check**: Previously saved user preference
2. **Browser Language**: navigator.language detection
3. **Fallback**: Spanish as default
4. **Validation**: Ensure supported language

## Consequences

### Positive
- Works offline after initial load
- No external translation service dependency
- Easy to add new languages
- Version controlled with application code
- Demonstrates i18n implementation skills

### Negative
- Initial load includes all language data
- Manual translation management
- No real-time translation updates
- Potential for translation inconsistencies

### Mitigation
- Lazy loading of translation files (if needed)
- Translation validation scripts
- Bilingual content review process
- Fallback to English for missing keys

## Alternatives Considered

### Server-Side Translation
- **Pros**: SEO-friendly, faster initial render
- **Cons**: Requires server processing, complicates static hosting
- **Rejected**: Increases infrastructure complexity

### Third-Party i18n Library
- **Pros**: Feature-rich, battle-tested
- **Cons**: Additional bundle size, external dependency
- **Rejected**: Bundle size impact, overkill for simple needs

### Build-Time Generation
- **Pros**: Optimized bundles, tree-shaking
- **Cons**: Build process complexity, slower development
- **Rejected**: Unnecessary for small-scale application

### CMS Integration
- **Pros**: Non-technical content management
- **Cons**: Additional service dependency, complexity
- **Rejected**: Overkill for portfolio content

## Implementation Details

### Translation Loading Strategy
```javascript
class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
    this.isLoaded = false;
  }

  async loadTranslations() {
    try {
      const response = await fetch(`assets/i18n/${this.currentLang}.json`);
      this.translations = await response.json();
      this.isLoaded = true;
      return true;
    } catch (error) {
      // Fallback logic
      console.error('Translation loading failed:', error);
      return false;
    }
  }

  t(key, fallback = '') {
    // Nested key lookup: 'nav.home'
    const keys = key.split('.');
    let value = this.translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || fallback;
  }
}
```

### DOM Translation
```javascript
function translatePage() {
  // Data attribute translation
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = i18n.t(key);
    if (translation) {
      element.textContent = translation;
    }
  });

  // Special handling for different element types
  // Input placeholders, alt text, etc.
}
```

### Language Switching
```javascript
async function changeLanguage(lang) {
  if (!this.isValidLanguage(lang)) return false;

  this.currentLang = lang;
  localStorage.setItem('language', lang);

  // Reload translations
  const success = await this.loadTranslations();
  if (success) {
    this.translatePage();
    // Update UI elements
    updateLanguageButton();
  }

  return success;
}
```

## Performance Considerations
- **Initial Load**: ~10KB for both language files
- **Caching**: Translations cached in memory after load
- **Lazy Loading**: Could implement if file sizes grow
- **Bundle Impact**: Minimal additional JavaScript

## Maintenance Strategy
- **Translation Keys**: Consistent naming convention
- **Content Review**: Bilingual review process
- **Version Control**: Translations versioned with code
- **Validation**: Automated key presence checking

## Testing Approach
- **Unit Tests**: Translation lookup functions
- **Integration Tests**: DOM translation accuracy
- **Language Tests**: All supported languages
- **Fallback Tests**: Missing key handling

## Related Decisions
- ADR 001: Vanilla JavaScript Framework Choice
- ADR 002: State Management Approach
- ADR 005: Content Management Strategy

## Future Considerations
- **Additional Languages**: Easy to extend with more JSON files
- **Dynamic Loading**: Could load languages on demand
- **Translation Management**: Could integrate external translation service
- **RTL Support**: Could add right-to-left language support

## Metrics & Monitoring
- **Language Usage**: Track which languages users select
- **Translation Coverage**: Monitor missing translation keys
- **Loading Performance**: Translation file load times
- **User Experience**: Language switching success rates

## Date
2024-01-15

## Author
David Vargas