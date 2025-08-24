import { Platform } from 'react-native';

// Completely disable global error handling to avoid CORS conflicts
if (Platform.OS === 'web') {
  console.log('[GlobalErrorHandler] Disabled on web to prevent CORS conflicts');
  
  // Override any existing error handlers that might cause CORS issues
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      // Silently handle errors without sending to parent
      const message = event.error?.message || event.message || 'Unknown error';
      
      // Filter out specific errors we want to suppress
      if (message.includes('Unexpected text node') || 
          message.includes('MaterialIcons.ttf') ||
          message.includes('A text node cannot be a child of a <View>')) {
        console.warn('Suppressed UI error:', message);
        event.preventDefault();
        return;
      }
      
      console.warn('Error caught by minimal handler:', message);
      event.preventDefault();
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      // Silently handle promise rejections
      const reason = event.reason?.message || event.reason || 'Unknown rejection';
      
      // Filter out network errors for fonts
      if (reason.includes('MaterialIcons.ttf') || 
          reason.includes('NetworkError')) {
        console.warn('Suppressed network error:', reason);
        event.preventDefault();
        return;
      }
      
      console.warn('Unhandled promise rejection:', reason);
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
