# Type Definitions

## Overview

This document provides TypeScript-style type definitions for the David Vargas Portfolio JavaScript modules. These definitions help understand the data structures and function signatures used throughout the application.

## Core Types

### LanguageCode
```typescript
type LanguageCode = 'es' | 'en';
```

**Description**: Supported language codes for internationalization.

### ThemeType
```typescript
type ThemeType = 'light' | 'dark' | null;
```

**Description**: Possible theme values, null indicates no saved preference.

### ReadingModeState
```typescript
type ReadingModeState = boolean;
```

**Description**: Whether reading mode is enabled (true) or disabled (false).

## I18n Module Types

### LanguageInfo
```typescript
interface LanguageInfo {
  code: LanguageCode;
  name: string;
  flag: string;
}
```

**Description**: Information about a supported language.

**Properties**:
- `code`: ISO language code
- `name`: Display name in the language itself
- `flag`: Unicode flag emoji

**Example**:
```typescript
const spanish: LanguageInfo = {
  code: 'es',
  name: 'Español',
  flag: '🇪🇸'
};
```

### TranslationData
```typescript
interface TranslationData {
  [key: string]: string | TranslationData;
}
```

**Description**: Nested object structure for translation data.

**Example**:
```typescript
const translations: TranslationData = {
  nav: {
    home: 'Inicio',
    projects: 'Proyectos'
  },
  home: {
    title: 'Página Principal'
  }
};
```

## Search Module Types

### SearchItem
```typescript
interface SearchItem {
  id: string;
  page: string;
  url: string;
  title: string;
  content: string;
  keywords: string[];
}
```

**Description**: Structure of items in the search index.

**Properties**:
- `id`: Unique identifier for the content item
- `page`: Page name for display (e.g., "Inicio", "Proyectos")
- `url`: Relative URL to the page
- `title`: Title of the content item
- `content`: Full text content for searching
- `keywords`: Array of searchable keywords

**Example**:
```typescript
const homeItem: SearchItem = {
  id: 'home',
  page: 'Inicio',
  url: 'index.html',
  title: 'Inicio',
  content: 'Hola! Mi nombre es David Vargas...',
  keywords: ['david vargas', 'ingeniero software']
};
```

### SearchResult
```typescript
interface SearchResult extends SearchItem {
  // Inherits all SearchItem properties
  score?: number; // Optional relevance score
}
```

**Description**: Search result with optional scoring information.

## UI Module Types

### NavigationItem
```typescript
interface NavigationItem {
  href: string;
  icon: string;
  text: string;
}
```

**Description**: Structure for main navigation items.

**Properties**:
- `href`: Relative URL
- `icon`: Lucide icon name
- `text`: Display text (translated)

### FavoriteItem
```typescript
interface FavoriteItem extends NavigationItem {
  external: boolean;
}
```

**Description**: Structure for favorite/external links.

**Properties**:
- Inherits `href`, `icon`, `text` from NavigationItem
- `external`: Whether link opens in new tab

### BreadcrumbItem
```typescript
type BreadcrumbItem = string;
```

**Description**: Breadcrumb segment, typically a translation key.

**Example**:
```typescript
const breadcrumb: BreadcrumbItem[] = ['nav.home', 'nav.projects'];
```

## Event Types

### LanguageChangedEvent
```typescript
interface LanguageChangedEvent extends CustomEvent {
  detail: {
    language: LanguageCode;
  };
}
```

**Description**: Event fired when language changes.

**Usage**:
```typescript
window.addEventListener('languageChanged', (event: LanguageChangedEvent) => {
  console.log('Language changed to:', event.detail.language);
});
```

### I18nReadyEvent
```typescript
interface I18nReadyEvent extends CustomEvent {
  detail: {}; // Empty detail object
}
```

**Description**: Event fired when i18n system is fully initialized.

## Utility Types

### HTMLElementOrNull
```typescript
type HTMLElementOrNull = HTMLElement | null;
```

**Description**: DOM element that may not exist.

### EventHandler
```typescript
type EventHandler<T extends Event = Event> = (event: T) => void;
```

**Description**: Generic event handler function type.

### AsyncFunction
```typescript
type AsyncFunction<T = void> = () => Promise<T>;
```

**Description**: Function that returns a Promise.

## State Management Types

### AppState
```typescript
interface AppState {
  theme: ThemeType;
  language: LanguageCode;
  readingMode: ReadingModeState;
  searchQuery: string;
  currentPage: string;
}
```

**Description**: Complete application state structure.

**Note**: Not all properties are persisted (searchQuery, currentPage are session-only).

### StateUpdate
```typescript
interface StateUpdate {
  key: keyof AppState;
  value: AppState[keyof AppState];
  state: AppState;
}
```

**Description**: Structure of state change notifications.

## API Response Types

### FetchResponse
```typescript
interface FetchResponse<T = any> {
  ok: boolean;
  status: number;
  statusText: string;
  json(): Promise<T>;
  text(): Promise<string>;
}
```

**Description**: Simplified Fetch API response type.

### TranslationResponse
```typescript
type TranslationResponse = TranslationData;
```

**Description**: Response type for translation file fetches.

## Error Types

### I18nError
```typescript
class I18nError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'I18nError';
  }
}
```

**Description**: Custom error for i18n-related failures.

**Error Codes**:
- `TRANSLATION_LOAD_FAILED`: Failed to load translation file
- `INVALID_LANGUAGE`: Unsupported language code
- `MISSING_TRANSLATION`: Translation key not found

### ValidationError
```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string, public value: any) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

**Description**: Error for validation failures.

## Function Signatures

### TranslationFunction
```typescript
type TranslationFunction = (key: string, fallback?: string) => string;
```

**Description**: Signature for translation lookup functions.

### ThemeToggleFunction
```typescript
type ThemeToggleFunction = () => void;
```

**Description**: Signature for theme switching functions.

### SearchFunction
```typescript
type SearchFunction = (query: string) => void;
```

**Description**: Signature for search execution functions.

### DOMManipulator
```typescript
type DOMManipulator = (element: HTMLElement) => void;
```

**Description**: Signature for DOM manipulation functions.

## Generic Types

### Optional<T>
```typescript
type Optional<T> = T | undefined;
```

**Description**: Value that may be undefined.

### Nullable<T>
```typescript
type Nullable<T> = T | null;
```

**Description**: Value that may be null.

### Result<T, E>
```typescript
type Result<T, E> = { success: true; data: T } | { success: false; error: E };
```

**Description**: Result type for operations that may fail.

## Browser API Types

### LocalStorage
```typescript
interface LocalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
```

**Description**: Browser LocalStorage API interface.

### ClipboardAPI
```typescript
interface ClipboardAPI {
  writeText(text: string): Promise<void>;
  readText(): Promise<string>;
}
```

**Description**: Modern Clipboard API interface.

### ShareAPI
```typescript
interface ShareAPI {
  share(data: ShareData): Promise<void>;
}

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}
```

**Description**: Web Share API interfaces.

## Constants

### SUPPORTED_LANGUAGES
```typescript
const SUPPORTED_LANGUAGES: readonly LanguageCode[] = ['es', 'en'] as const;
```

**Description**: Array of supported language codes.

### THEME_VALUES
```typescript
const THEME_VALUES: readonly ThemeType[] = ['light', 'dark', null] as const;
```

**Description**: Valid theme values including null.

### CACHE_NAME
```typescript
const CACHE_NAME: string = 'david-vargas-portfolio-v1';
```

**Description**: Current Service Worker cache version.

## Type Guards

### isLanguageCode
```typescript
function isLanguageCode(value: string): value is LanguageCode {
  return SUPPORTED_LANGUAGES.includes(value as LanguageCode);
}
```

**Description**: Type guard for language code validation.

### isThemeType
```typescript
function isThemeType(value: string | null): value is ThemeType {
  return THEME_VALUES.includes(value as ThemeType);
}
```

**Description**: Type guard for theme type validation.

### isSearchItem
```typescript
function isSearchItem(value: any): value is SearchItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.page === 'string' &&
    typeof value.url === 'string' &&
    typeof value.title === 'string' &&
    typeof value.content === 'string' &&
    Array.isArray(value.keywords)
  );
}
```

**Description**: Type guard for search item validation.

## Usage Examples

### Type-Safe I18n Usage
```typescript
// Type-safe language validation
function setLanguage(lang: string): boolean {
  if (!isLanguageCode(lang)) {
    console.error('Invalid language code:', lang);
    return false;
  }

  // lang is now typed as LanguageCode
  return i18n.changeLanguage(lang);
}
```

### State Management with Types
```typescript
// Type-safe state updates
function updateTheme(theme: ThemeType): void {
  if (!isThemeType(theme)) {
    throw new ValidationError('Invalid theme value', 'theme', theme);
  }

  appState.theme = theme;
  localStorage.setItem('theme', theme || 'light');
}
```

### Search with Type Safety
```typescript
// Type-safe search result handling
function processSearchResults(results: unknown[]): SearchResult[] {
  return results.filter(isSearchItem).map(item => ({
    ...item,
    score: calculateRelevanceScore(item)
  }));
}
```

## Future Type Enhancements

### Planned Additions
- Generic API response types
- Event payload type definitions
- Component prop interfaces
- Service Worker message types

### Potential Improvements
- Runtime type validation
- TypeScript migration path
- Automated type generation
- API contract definitions