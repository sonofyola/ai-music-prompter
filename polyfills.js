import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific polyfills
  if (typeof global === 'undefined') {
    global = globalThis;
  }
  
  // Asset registry polyfill for web
  if (!global.__ASSET_REGISTRY__) {
    global.__ASSET_REGISTRY__ = {};
  }
  
  // Mock asset registry functions for fonts and images
  if (!global.__registerAsset) {
    global.__registerAsset = function(asset) {
      return asset;
    };
  }
  
  // Handle missing asset registry path specifically
  if (typeof require !== 'undefined') {
    const originalRequire = require;
    global.require = function(id) {
      if (id === 'missing-asset-registry-path') {
        return {
          registerAsset: global.__registerAsset,
          getAssetByID: () => null,
        };
      }
      return originalRequire.apply(this, arguments);
    };
  }
}

if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import(
      'react-native/Libraries/Utilities/PolyfillFunctions'
    );

    const { TextEncoderStream, TextDecoderStream } = await import(
      '@stardazed/streams-text-encoding'
    );

    if (!('structuredClone' in global)) {
      const structuredClone = await import('@ungap/structured-clone');
      polyfillGlobal('structuredClone', () => structuredClone.default);
    }

    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};