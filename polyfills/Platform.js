// Platform-specific polyfills for React Native Web
if (typeof window !== 'undefined') {
  // Web environment
  if (!window.__ASSET_REGISTRY__) {
    window.__ASSET_REGISTRY__ = {};
  }
  
  // Mock missing asset registry path
  if (typeof require !== 'undefined' && require.resolve) {
    const originalResolve = require.resolve;
    require.resolve = function(id) {
      if (id === 'missing-asset-registry-path') {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      }
      return originalResolve.apply(this, arguments);
    };
  }
}

export {};