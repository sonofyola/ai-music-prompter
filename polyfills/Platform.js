// Comprehensive Platform polyfill for React Native web
const Platform = {
  OS: typeof window !== 'undefined' ? 'web' : 'ios',
  Version: 1,
  isTV: false,
  isTesting: typeof jest !== 'undefined',
  isPad: false,
  constants: {},
  select: (obj) => {
    if (typeof window !== 'undefined') {
      return obj.web || obj.default;
    }
    return obj.ios || obj.native || obj.default;
  },
};

// Support both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Platform;
}

if (typeof exports !== 'undefined') {
  exports.default = Platform;
  Object.assign(exports, Platform);
}

// Also make it available globally for web
if (typeof window !== 'undefined') {
  window.__REACT_NATIVE_PLATFORM__ = Platform;
}