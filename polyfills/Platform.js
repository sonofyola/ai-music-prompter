// Polyfill for React Native Platform utility on web
const Platform = {
  OS: 'web',
  Version: 1,
  isTV: false,
  isTesting: false,
  select: (obj) => {
    return obj.web || obj.default;
  },
};

module.exports = Platform;