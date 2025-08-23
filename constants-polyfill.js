// This file MUST be loaded before any other imports
// It provides a polyfill for expo-constants on web platforms

(function() {
  'use strict';
  
  // Only run on web platforms
  if (typeof window === 'undefined') {
    return;
  }
  
  // Check if ExponentConstants already exists
  if (typeof window.ExponentConstants !== 'undefined') {
    console.log('[Constants Polyfill] ExponentConstants already exists');
    return;
  }
  
  // Create comprehensive mock constants
  const mockConstants = {
    appOwnership: 'expo',
    expoVersion: '53.0.0',
    installationId: 'web-installation-' + Date.now(),
    isDevice: false,
    platform: {
      web: {
        ua: (typeof navigator !== 'undefined' && navigator.userAgent) || 'Unknown Browser'
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
    deviceId: 'web-device-' + Date.now(),
    
    // Additional properties that might be needed
    getWebViewUserAgentAsync: function() {
      return Promise.resolve((typeof navigator !== 'undefined' && navigator.userAgent) || 'Unknown Browser');
    },
    
    // Constants that BasicTech might expect
    Constants: {
      appOwnership: 'expo',
      expoVersion: '53.0.0',
      installationId: 'web-installation-' + Date.now(),
      isDevice: false,
      platform: {
        web: {
          ua: (typeof navigator !== 'undefined' && navigator.userAgent) || 'Unknown Browser'
        }
      }
    }
  };
  
  // Set on window
  window.ExponentConstants = mockConstants;
  
  // Set on global if it exists
  if (typeof global !== 'undefined') {
    global.ExponentConstants = mockConstants;
  }
  
  // Create a module system mock if needed
  if (typeof window.__mockModules === 'undefined') {
    window.__mockModules = {};
  }
  
  window.__mockModules['expo-constants'] = mockConstants;
  window.__mockModules['ExponentConstants'] = mockConstants;
  
  // Override require if it doesn't exist
  const originalRequire = window.require;
  window.require = function(moduleName) {
    if (moduleName === 'expo-constants' || moduleName === 'ExponentConstants') {
      return { default: mockConstants, ...mockConstants };
    }
    
    if (window.__mockModules[moduleName]) {
      return window.__mockModules[moduleName];
    }
    
    if (originalRequire) {
      return originalRequire.apply(this, arguments);
    }
    
    throw new Error('Module ' + moduleName + ' not found');
  };
  
  console.log('[Constants Polyfill] ExponentConstants polyfill applied successfully');
})();