# ADR 004: Service Worker Strategy

## Status
Accepted

## Context
The portfolio needed offline functionality and improved performance through caching. Key requirements included:

- Offline access to core content
- Fast loading through resource caching
- PWA installation capability
- Background updates and synchronization
- Minimal maintenance overhead
- Cross-browser compatibility

Available options included:
- Service Worker with cache-first strategy
- Network-first with Service Worker
- App Shell architecture
- No offline functionality
- Third-party caching solutions

## Decision
Implement Service Worker with stale-while-revalidate strategy for static assets and network-first for dynamic content.

## Rationale

### PWA Requirements Analysis
- **Offline Access**: Core portfolio content available offline
- **Fast Loading**: Cached resources for instant loading
- **Installable**: PWA manifest and Service Worker enable installation
- **Background Updates**: Automatic cache updates
- **Performance**: Improved loading times and user experience

### Chosen Strategy Benefits
- **Stale-While-Revalidate**: Fast loading with background updates
- **Network Resilience**: Works offline with cached content
- **Automatic Management**: Self-updating cache system
- **Storage Efficient**: Intelligent cache invalidation
- **User Experience**: Seamless online/offline transitions

### Cache Strategy Details
```javascript
// Stale-while-revalidate for static assets
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version immediately
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Update cache in background
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
        return response || fetchPromise;
      })
  );
});
```

### Cache Versioning
- **Versioned Cache Names**: `david-vargas-portfolio-v1`
- **Automatic Cleanup**: Old caches deleted on update
- **Version Bumping**: Manual version increment on deployments

## Consequences

### Positive
- Offline functionality enhances user experience
- Faster loading times through caching
- PWA installation capability
- Demonstrates modern web development skills
- Automatic cache management

### Negative
- HTTPS requirement for Service Worker
- Additional complexity in development
- Browser compatibility considerations
- Cache invalidation challenges
- Storage quota management

### Mitigation
- Progressive enhancement (works without Service Worker)
- Development HTTPS setup
- Cache debugging tools
- User cache clearing options
- Storage quota monitoring

## Alternatives Considered

### Cache-First Strategy
- **Pros**: Fastest loading, always serves from cache
- **Cons**: Stale content until cache update, update delays
- **Rejected**: Content freshness more important than speed

### Network-First Strategy
- **Pros**: Always fresh content, simple logic
- **Cons**: Slower loading, no offline capability
- **Rejected**: Offline functionality is key PWA feature

### App Shell Architecture
- **Pros**: Fast perceived loading, clear separation
- **Cons**: Complex implementation, overkill for portfolio
- **Rejected**: Unnecessary complexity for content site

### No Service Worker
- **Pros**: Simpler implementation, no HTTPS requirement
- **Cons**: No offline functionality, missed PWA benefits
- **Rejected**: PWA features important for modern web app

## Implementation Details

### Service Worker Lifecycle
```javascript
// Installation - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activation - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Cache Strategy by Resource Type
- **Static Assets**: Stale-while-revalidate (CSS, JS, fonts, images)
- **HTML Pages**: Network-first with offline fallback
- **API Calls**: Network-only (not applicable for static site)
- **External Resources**: Cache with short TTL

### Cache Invalidation Strategy
- **Version-based**: Cache name includes version number
- **Manual Updates**: Version bump on content changes
- **Automatic Cleanup**: Old caches deleted on activation
- **User Control**: Option to clear cache manually

## Performance Impact

### Loading Performance
- **First Load**: Network loading with cache population
- **Subsequent Loads**: Instant loading from cache
- **Background Updates**: Seamless cache refreshing
- **Offline Performance**: Full functionality without network

### Storage Considerations
- **Cache Size**: ~5-10MB for typical usage
- **Quota Management**: Automatic cleanup of old versions
- **Storage Monitoring**: Browser storage APIs for monitoring
- **Fallback Handling**: Graceful degradation if storage full

## Security Considerations
- **HTTPS Only**: Service Worker requires secure context
- **Content Validation**: Cache only successful responses
- **Origin Restrictions**: Only cache same-origin resources
- **CSP Compatibility**: Ensure CSP allows Service Worker

## Testing Strategy
- **Unit Tests**: Service Worker event handlers
- **Integration Tests**: Cache operations and invalidation
- **Offline Tests**: Functionality without network
- **Cross-Browser Tests**: Service Worker support verification

## Monitoring & Maintenance
- **Cache Hit Rates**: Monitor cache effectiveness
- **Storage Usage**: Track cache size over time
- **Error Rates**: Service Worker failure monitoring
- **Update Success**: Cache update completion rates

## Deployment Considerations
- **Version Management**: Update cache version on deployment
- **Rollback Plan**: Previous version cache fallback
- **Update Notifications**: User notification of updates
- **Cache Warming**: Pre-populate cache on install

## Related Decisions
- ADR 001: Vanilla JavaScript Framework Choice
- ADR 006: PWA Manifest Configuration
- ADR 007: Caching Strategy

## Future Considerations
- **Advanced Caching**: Background sync, push notifications
- **Cache Optimization**: Predictive caching, intelligent prefetching
- **Storage Management**: More sophisticated quota handling
- **Performance Monitoring**: Cache performance metrics

## Browser Compatibility
- **Supported**: Chrome 40+, Firefox 44+, Safari 11.1+, Edge 17+
- **Progressive Enhancement**: Works without Service Worker
- **Feature Detection**: Graceful fallback for unsupported browsers
- **Polyfills**: Not needed for core functionality

## Date
2024-01-15

## Author
David Vargas