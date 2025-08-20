// Platform polyfill for React Native web compatibility
const Platform = {
  OS: typeof window !== 'undefined' ? 'web' : 'ios',
  Version: typeof window !== 'undefined' ? 1 : 14,
  isTV: false,
  isTesting: false,
  isPad: false,
  constants: {},
  select: function(obj) {
    const platform = this.OS;
    return obj[platform] || obj.default || obj.native || obj.ios;
  },
};

// Export in multiple ways to ensure compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Platform;
  module.exports.default = Platform;
}

if (typeof window !== 'undefined') {
  window.Platform = Platform;
}

// Also make it available globally
if (typeof global !== 'undefined') {
  global.Platform = Platform;
}