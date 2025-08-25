// Polyfill for constants that might be missing in some environments
if (typeof global !== 'undefined') {
  if (!global.process) {
    global.process = {};
  }
  if (!global.process.env) {
    global.process.env = {};
  }
}

export {};