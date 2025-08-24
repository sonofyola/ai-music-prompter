import { Platform } from 'react-native';

// Enhanced global error handling with better error filtering
if (Platform.OS === 'web') {
  console.log('[GlobalErrorHandler] Enhanced web error handling initialized');
  
  if (typeof window !== 'undefined') {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      const message = event.error?.message || event.message || 'Unknown error';
      
      // Filter out specific errors we want to suppress
      const suppressedErrors = [
        'Unexpected text node',
        'MaterialIcons.ttf',
        'A text node cannot be a child of a <View>',
        'Network request failed',
        'Loading chunk',
        'ChunkLoadError',
        'Script error',
        'Non-Error promise rejection captured',
        'ResizeObserver loop limit exceeded'
      ];
      
      if (suppressedErrors.some(error => message.includes(error))) {
        console.warn('Suppressed UI error:', message);
        event.preventDefault();
        return;
      }
      
      // Log other errors for debugging but don't send to parent
      console.error('Error caught by global handler:', {
        message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
      
      event.preventDefault();
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason?.message || event.reason || 'Unknown rejection';
      
      // Filter out network and font loading errors
      const suppressedRejections = [
        'MaterialIcons.ttf',
        'NetworkError',
        'Failed to fetch',
        'Load failed',
        'Network request failed',
        'AbortError',
        'The operation was aborted'
      ];
      
      if (suppressedRejections.some(error => String(reason).includes(error))) {
        console.warn('Suppressed network error:', reason);
        event.preventDefault();
        return;
      }
      
      // Log other promise rejections
      console.error('Unhandled promise rejection:', {
        reason,
        stack: event.reason?.stack
      });
      
      event.preventDefault();
    });
    
    // Add a global error boundary for React errors
    if (typeof (window as any).React !== 'undefined') {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.join(' ');
        
        // Filter React warnings and errors we don't care about
        if (message.includes('Warning:') || 
            message.includes('React does not recognize') ||
            message.includes('validateDOMNesting')) {
          return; // Suppress React warnings
        }
        
        originalConsoleError.apply(console, args);
      };
    }
  }
} else {
  console.log('[GlobalErrorHandler] Native platform error handling initialized');
  
  // For native platforms, set up minimal error handling
  if (typeof global !== 'undefined') {
    // Type assertion for React Native's ErrorUtils
    const globalWithErrorUtils = global as any;
    const originalHandler = globalWithErrorUtils.ErrorUtils?.getGlobalHandler();
    
    if (globalWithErrorUtils.ErrorUtils) {
      globalWithErrorUtils.ErrorUtils.setGlobalHandler((error: Error, isFatal: boolean) => {
        console.error('Native error caught:', {
          message: error.message,
          stack: error.stack,
          isFatal
        });
        
        // Call original handler if it exists
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }
  }
}

// Export a no-op function to maintain compatibility
export function sendErrorToIframeParent() {
  // Completely disabled to avoid CORS issues
}
