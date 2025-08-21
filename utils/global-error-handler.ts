import { Platform } from 'react-native';

const webTargetOrigins = [
  "http://localhost:8081", // Your parent dev server
  "https://kiki.dev",       // Your production parent
  "http://localhost:3000", 
  "http://localhost:19006", // Common Expo web port
  "http://localhost:8080",  // Alternative port
];

// Define a simple error info type to avoid React import
interface ErrorInfo {
  componentStack?: string;
}

// This function will be exported and used by the ErrorBoundary component later
export function sendErrorToIframeParent(errorSource: any, errorInfo?: ErrorInfo) {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.parent && window.parent !== window) {
    console.debug('[GlobalErrorHandler] Attempting to send error to parent:', {
      errorSource,
      errorInfo,
      currentReferrer: document.referrer,
      currentOrigin: window.location.origin,
    });

    let message = 'Unknown error';
    let stack = undefined;
    let componentStack = errorInfo?.componentStack;

    if (errorSource instanceof Error) {
      message = errorSource.message;
      stack = errorSource.stack;
    } else if (typeof errorSource === 'string') {
      message = errorSource;
      try { throw new Error(message); } catch (e: any) { stack = e.stack; }
    } else if (errorSource && typeof errorSource.message === 'string') {
      message = errorSource.message;
      stack = errorSource.stack;
    } else {
      try {
        message = JSON.stringify(errorSource);
      } catch (e) {
        message = 'Could not stringify error source.';
      }
    }

    const errorMessagePayload = {
      type: 'ERROR',
      error: {
        message: message,
        stack: stack,
        componentStack: componentStack,
        timestamp: new Date().toISOString(),
      },
      iframeId: "kiki-web-preview",
    };

    let targetOrigin = '*';
    if (document.referrer) {
      try {
        const referrerURL = new URL(document.referrer);
        if (webTargetOrigins.includes(referrerURL.origin)) {
          targetOrigin = referrerURL.origin;
        }
      } catch (e) {
        console.warn('[GlobalErrorHandler] Could not parse document.referrer:', e);
      }
    }

    try {
      window.parent.postMessage(errorMessagePayload, targetOrigin);
      console.debug('[GlobalErrorHandler] Error message posted to parent.');
    } catch (postMessageError) {
      console.error('[GlobalErrorHandler] Failed to send error to parent:', postMessageError);
    }
  }
}

// Only setup global error handlers if on web and not in development mode
if (Platform.OS === 'web' && typeof window !== 'undefined' && process.env.NODE_ENV !== 'development') {
  console.log('[GlobalErrorHandler] Initializing global error listeners for web.');

  window.addEventListener('error', (event: ErrorEvent) => {
    const error = event.error || new Error(event.message || 'Unknown error from window.onerror');
    sendErrorToIframeParent(error, { componentStack: undefined });
  }, true);

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    sendErrorToIframeParent(event.reason || 'Unhandled promise rejection', { componentStack: undefined });
  }, true);

  console.log('[GlobalErrorHandler] Global error listeners initialized.');
} else {
  console.log(`[GlobalErrorHandler] Skipping error listeners. Platform: ${Platform.OS}, NODE_ENV: ${process.env.NODE_ENV}`);
}
