# Coding Conventions

## Overview

This document outlines the coding standards, naming conventions, and development practices used in the David Vargas Portfolio project. Consistent conventions ensure maintainable, readable, and professional code.

## General Principles

### Code Quality
- **Readability**: Code should be self-documenting
- **Maintainability**: Easy to understand and modify
- **Consistency**: Follow established patterns
- **Performance**: Efficient algorithms and practices

### Development Approach
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Graceful Degradation**: Features degrade gracefully in older browsers
- **Accessibility First**: WCAG compliance built-in
- **Mobile First**: Responsive design from smallest screens up

## JavaScript Conventions

### Language Features
- **ES6+ Syntax**: Use modern JavaScript features
- **Strict Mode**: All code runs in strict mode
- **Modules**: ES6 modules for code organization
- **Promises**: Async/await for asynchronous operations

### Naming Conventions

#### Variables and Functions
```javascript
// camelCase for variables and functions
const userName = 'david';
const isLoading = false;

function getUserData() {}
function validateInput(value) {}
```

#### Constants
```javascript
// UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const CACHE_NAME = 'portfolio-v1';
const API_TIMEOUT = 5000;
```

#### Classes and Constructors
```javascript
// PascalCase for classes
class UserInterface {}
class TranslationManager {}

// camelCase for instances
const ui = new UserInterface();
const translator = new TranslationManager();
```

#### Private Members
```javascript
// Prefix with underscore for private members
class ThemeManager {
  constructor() {
    this._currentTheme = 'light';
    this._systemPreference = null;
  }

  _validateTheme(theme) {}
}
```

### Code Structure

#### Function Organization
```javascript
function processUserInput(input) {
  // 1. Input validation
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }

  // 2. Processing logic
  const processed = input.trim().toLowerCase();

  // 3. Return result
  return processed;
}
```

#### Module Structure
```javascript
// 1. Imports
import { utilityFunction } from './utils.js';

// 2. Constants
const MODULE_CONSTANTS = {};

// 3. Private functions
function _privateHelper() {}

// 4. Public API
export function publicFunction() {}

// 5. Initialization
function _initialize() {}
_initialize();
```

### Error Handling
```javascript
try {
  const result = riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  // Provide fallback or rethrow
  throw new Error('Operation failed with fallback');
}
```

### Comments and Documentation

#### JSDoc Comments
```javascript
/**
 * Validates user input and returns sanitized value
 * @param {string} input - The input to validate
 * @returns {string} Sanitized input
 * @throws {Error} If input is invalid
 */
function validateInput(input) {
  // Implementation
}
```

#### Inline Comments
```javascript
// Use for complex logic explanation
const result = complexCalculation(); // O(n) time complexity

// Avoid obvious comments
const sum = a + b; // This adds two numbers
```

## CSS Conventions

### Custom Properties
```css
:root {
  /* Color palette */
  --color-primary: #0a7aff;
  --color-secondary: #6c757d;

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;

  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 16px;
}
```

### Class Naming
```css
/* BEM methodology */
.sidebar {}
.sidebar__navigation {}
.sidebar__navigation--active {}

/* Utility classes */
.text-center {}
.bg-primary {}
.p-4 {} /* Padding utility */
```

### Organization
```css
/* 1. Variables */
/* 2. Base styles */
/* 3. Component styles */
/* 4. Utility classes */
/* 5. Responsive overrides */
```

## HTML Conventions

### Semantic Structure
```html
<!-- Use semantic elements -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <ul role="menubar">
      <li role="menuitem"><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
    </section>
  </article>
</main>
```

### Accessibility Attributes
```html
<!-- ARIA labels and descriptions -->
<button aria-label="Toggle theme between light and dark">
  <i data-lucide="sun" aria-hidden="true"></i>
</button>

<!-- Form accessibility -->
<label for="search-input">Search</label>
<input id="search-input" type="text" aria-describedby="search-help">
<span id="search-help">Press Cmd+K to open search</span>
```

### Data Attributes
```html
<!-- i18n data attributes -->
<span data-i18n="nav.home"></span>
<input data-i18n="search.placeholder" type="text">

<!-- State management -->
<div data-theme="dark" data-reading-mode="false">
```

## File Organization

### Directory Structure
```
assets/
├── css/
│   ├── _variables.css    # CSS custom properties
│   ├── _base.css         # Base styles
│   ├── _components.css   # Component styles
│   ├── _utilities.css    # Utility classes
│   └── _responsive.css   # Responsive overrides
├── js/
│   ├── i18n.js          # Internationalization
│   ├── ui.js            # UI components
│   ├── theme.js         # Theme management
│   ├── search.js        # Search functionality
│   ├── utils.js         # Utility functions
│   └── searchIndex.js   # Search data
└── i18n/
    ├── en.json          # English translations
    └── es.json          # Spanish translations
```

### File Naming
- **kebab-case** for file names: `user-interface.js`
- **Descriptive names**: `theme-manager.js` not `theme.js`
- **Consistent extensions**: `.js` for JavaScript, `.css` for styles
- **Index files**: Use `index.js` for main module files

## Git Conventions

### Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

#### Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing changes
- `chore`: Maintenance tasks

#### Examples
```
feat(search): add fuzzy matching algorithm
fix(theme): resolve dark mode toggle issue
docs(api): update i18n module documentation
```

### Branch Naming
```
feature/description-of-feature
bugfix/issue-description
hotfix/critical-fix
```

## Performance Guidelines

### JavaScript
- **Efficient DOM queries**: Cache selectors, use efficient methods
- **Minimize reflows**: Batch DOM updates
- **Memory management**: Clean up event listeners
- **Bundle optimization**: Minimize and compress code

### CSS
- **Efficient selectors**: Avoid deep nesting
- **Hardware acceleration**: Use transform and opacity for animations
- **Critical CSS**: Inline above-the-fold styles
- **Resource hints**: Preconnect to external domains

### Assets
- **Optimization**: Compress images and minify code
- **Caching**: Leverage browser and CDN caching
- **Lazy loading**: Load resources as needed
- **CDN usage**: Use reliable content delivery networks

## Testing Conventions

### Test File Organization
```
__tests__/
├── unit/
│   ├── i18n.test.js
│   └── theme.test.js
├── integration/
│   └── search-integration.test.js
└── e2e/
    └── user-journey.test.js
```

### Test Naming
```javascript
describe('TranslationManager', () => {
  describe('t()', () => {
    it('should return translation for valid key', () => {
      // Test implementation
    });

    it('should return fallback for missing key', () => {
      // Test implementation
    });
  });
});
```

## Security Practices

### Input Validation
```javascript
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}
```

### CSP Compliance
- **No inline scripts**: All JavaScript in external files
- **Safe resource loading**: Whitelist allowed domains
- **XSS prevention**: Sanitize all user inputs

### HTTPS First
- **Secure connections**: All resources over HTTPS
- **Certificate validation**: Use trusted certificates
- **Mixed content prevention**: Block HTTP resources

## Documentation Standards

### Code Comments
- **Purpose**: Explain why, not what
- **JSDoc**: Use for all public APIs
- **TODO comments**: Mark areas needing attention
- **FIXME comments**: Mark known issues

### README Files
- **Project overview**: What the project does
- **Installation**: How to set up locally
- **Usage**: How to use the project
- **Contributing**: How to contribute

## Tooling and Automation

### Development Tools
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **Lighthouse**: Performance auditing

### Build Process
- **Minification**: Reduce bundle sizes
- **Optimization**: Image and asset optimization
- **Versioning**: Cache busting for updates
- **Deployment**: Automated deployment pipelines

## Accessibility Guidelines

### WCAG Compliance
- **Perceivable**: Information presented accessibly
- **Operable**: Interface elements operable
- **Understandable**: Content understandable
- **Robust**: Works with assistive technologies

### Implementation
- **Semantic HTML**: Proper document structure
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: ARIA labels and landmarks
- **Color contrast**: Minimum 4.5:1 ratio

## Maintenance Practices

### Code Reviews
- **Checklist**: Consistent review criteria
- **Automated checks**: Linting and testing gates
- **Knowledge sharing**: Review for learning opportunities
- **Quality focus**: Functionality, performance, security

### Refactoring
- **Incremental changes**: Small, safe modifications
- **Test coverage**: Ensure tests pass after changes
- **Documentation updates**: Update docs for API changes
- **Deprecation notices**: Warn about breaking changes

## Conclusion

These conventions ensure consistent, maintainable, and professional code across the David Vargas Portfolio project. Following these guidelines contributes to code quality, team collaboration, and long-term project success.