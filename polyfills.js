import { Platform } from 'react-native';

// Minimal polyfills setup to avoid CORS conflicts
if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    try {
      const { polyfillGlobal } = await import(
        'react-native/Libraries/Utilities/PolyfillFunctions'
      );

      // Only add essential polyfills
      if (!('structuredClone' in global)) {
        const structuredClone = await import('@ungap/structured-clone');
        polyfillGlobal('structuredClone', () => structuredClone.default);
      }

      // Text encoding streams for AI functionality
      const { TextEncoderStream, TextDecoderStream } = await import(
        '@stardazed/streams-text-encoding'
      );
      polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
      polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
    } catch (error) {
      console.warn('Polyfill setup failed:', error);
    }
  };

  setupPolyfills();
} else {
  // Web platform - minimal setup
  console.log('[Polyfills] Web platform detected - using native implementations');
}

export {};
