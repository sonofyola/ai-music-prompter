import { Platform } from 'react-native';

// Completely disable global error handling to avoid CORS conflicts
if (Platform.OS === 'web') {
  console.log('[GlobalErrorHandler] Disabled on web to prevent CORS conflicts');
  
  // Override any existing error handlers that might cause CORS issues
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      // Silently handle errors without sending to parent
      console.warn('Error caught by minimal handler:', event.error?.message || 'Unknown error');
      event.preventDefault();
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      // Silently handle promise rejections
      console.warn('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    });
  }
} else {
  console.log('[GlobalErrorHandler] Minimal initialization for native platforms');
}

// Export a no-op function to maintain compatibility
export function sendErrorToIframeParent() {
  // Completely disabled to avoid CORS issues
}
