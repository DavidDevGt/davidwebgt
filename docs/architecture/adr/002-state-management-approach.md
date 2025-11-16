# ADR 002: State Management Approach

## Status
Accepted

## Context
The application needed a state management strategy for handling user preferences, application state, and UI state. Key requirements included:

- Theme preference persistence
- Language selection storage
- Reading mode state
- UI component state management
- State synchronization across components
- Performance and simplicity

Available options included:
- Global state object with event system
- LocalStorage-only approach
- In-memory state with LocalStorage sync
- Flux/Redux pattern implementation
- Context API pattern

## Decision
Implement a simple global state management system using LocalStorage for persistence and custom events for state synchronization.

## Rationale

### State Requirements Analysis
- **User Preferences**: Theme, language, reading mode (persistent)
- **Application State**: Current page, search state (session-based)
- **UI State**: Modal states, animation states (ephemeral)

### Chosen Approach Benefits
- **Simplicity**: Minimal abstraction overhead
- **Persistence**: Automatic LocalStorage synchronization
- **Reactivity**: Event-driven state change notifications
- **Performance**: Direct state access, no complex diffing
- **Debugging**: Transparent state inspection

### State Structure
```javascript
// Global state object
const appState = {
  theme: 'light',      // 'light' | 'dark'
  language: 'es',      // 'es' | 'en'
  readingMode: false,  // boolean
  searchQuery: '',     // string (session)
  currentPage: 'home'  // string (session)
};
```

### Persistence Strategy
- **LocalStorage**: User preferences (theme, language, readingMode)
- **Session State**: Temporary UI state (search, current page)
- **Validation**: Input sanitization and type checking
- **Fallbacks**: Default values for corrupted state

## Consequences

### Positive
- Simple and predictable state flow
- Easy debugging and inspection
- No external dependencies
- Good performance characteristics
- Clear separation of persistent vs. session state

### Negative
- Manual state synchronization
- No automatic dependency tracking
- Potential for state inconsistencies
- Limited scalability for complex state trees

### Mitigation
- Centralized state management functions
- Event system for state change notifications
- State validation and sanitization
- Comprehensive testing of state flows

## Alternatives Considered

### Redux Pattern
- **Pros**: Predictable state updates, debugging tools, middleware
- **Cons**: Significant bundle size increase, complexity overhead
- **Rejected**: Overkill for simple portfolio state needs

### React Context API
- **Pros**: Built-in React state management, provider pattern
- **Cons**: Requires React, unnecessary for vanilla JS
- **Rejected**: Framework coupling, not applicable

### Global State Object Only
- **Pros**: Simplest approach, minimal code
- **Cons**: No change notifications, manual updates
- **Rejected**: Poor maintainability for multi-component state

## Implementation Details

### State Management Functions
```javascript
// State update with persistence
function updateState(key, value) {
  appState[key] = value;

  // Persist if user preference
  if (['theme', 'language', 'readingMode'].includes(key)) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Notify listeners
  window.dispatchEvent(new CustomEvent('stateChanged', {
    detail: { key, value, state: { ...appState } }
  }));
}

// State initialization
function initializeState() {
  // Load from LocalStorage with validation
  const theme = getValidatedTheme();
  const language = getValidatedLanguage();
  const readingMode = getValidatedReadingMode();

  Object.assign(appState, { theme, language, readingMode });
}
```

### Component Integration
```javascript
// Component state subscription
window.addEventListener('stateChanged', (event) => {
  const { key, value } = event.detail;
  if (key === 'theme') {
    applyTheme(value);
  }
});
```

## Performance Considerations
- **Minimal overhead**: Direct object property access
- **Efficient updates**: Targeted state change notifications
- **Memory management**: No complex object trees
- **Serialization**: JSON for LocalStorage compatibility

## Testing Strategy
- **Unit Tests**: State update functions
- **Integration Tests**: State synchronization between components
- **Persistence Tests**: LocalStorage save/load cycles
- **Validation Tests**: Invalid state handling

## Related Decisions
- ADR 001: Vanilla JavaScript Framework Choice
- ADR 003: Internationalization Approach
- ADR 004: Theme System Implementation

## Future Considerations
- **Scalability**: If state complexity increases, consider more robust solution
- **Type Safety**: Could add TypeScript for state validation
- **Middleware**: Could add logging/validation middleware if needed

## Date
2024-01-15

## Author
David Vargas