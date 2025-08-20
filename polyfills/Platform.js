// Simple Platform polyfill for React Native web
const Platform = {
  OS: typeof window !== 'undefined' ? 'web' : 'ios',
  Version: 1,
  isTV: false,
  isTesting: false,
  isPad: false,
  constants: {},
  select: (obj) => {
    const platform = typeof window !== 'undefined' ? 'web' : 'ios';
    return obj[platform] || obj.default || obj.native;
  },
};

module.exports = Platform;
module.exports.default = Platform;