import { Platform } from 'react-native';

// Minimal global error handler to avoid CORS conflicts
if (Platform.OS === 'web') {
  // Disable global error handling on web to avoid CORS issues
  console.log('[GlobalErrorHandler] Disabled on web to prevent CORS conflicts');
} else {
  console.log('[GlobalErrorHandler] Initialized for native platforms only');
}

// Export a no-op function to maintain compatibility
export function sendErrorToIframeParent() {
  // No-op to avoid CORS issues
}
