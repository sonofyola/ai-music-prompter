// Critical: This must be the FIRST thing that runs
// Handle expo-constants polyfill IMMEDIATELY for web
if (typeof window !== 'undefined' && typeof window.ExponentConstants === 'undefined') {
  // Create a comprehensive mock ExponentConstants module for web
  const mockConstants = {
    appOwnership: 'expo',
    expoVersion: '53.0.0',
    installationId: 'web-installation-' + Date.now(),
    isDevice: false,
    platform: {
      web: {
        ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
      }
    },
    sessionId: 'web-session-' + Date.now(),
    statusBarHeight: 0,
    systemFonts: [],
    systemVersion: null,
    deviceName: 'Web Browser',
    deviceYearClass: null,
    linkingUrl: null,
    manifest: {},
    nativeAppVersion: null,
    nativeBuildVersion: null,
    executionEnvironment: 'storeClient',
    // Add additional properties that BasicTech might need
    deviceId: 'web-device-' + Date.now(),
    getWebViewUserAgentAsync: () => Promise.resolve(typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown')
  };

  // Set on window
  window.ExponentConstants = mockConstants;
  
  // Set on global if it exists
  if (typeof global !== 'undefined') {
    global.ExponentConstants = mockConstants;
  }
  
  // Also create the module structure that React Native expects
  if (typeof window.require === 'undefined') {
    window.require = (moduleName) => {
      if (moduleName === 'expo-constants' || moduleName === 'ExponentConstants') {
        return { default: mockConstants, ...mockConstants };
      }
      throw new Error(`Module ${moduleName} not found`);
    };
  }
  
  console.log('[Polyfills] Web platform - expo-constants polyfill applied immediately');
}

// Import Platform after setting up the constants polyfill
import { Platform } from 'react-native';

// Mobile polyfills
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
      
      console.log('[Polyfills] Mobile platform - polyfills applied');
    } catch (error) {
      console.warn('Polyfill setup failed:', error);
    }
  };

  setupPolyfills();
} else {
  console.log('[Polyfills] Web platform - using native implementations');
}

export {};
