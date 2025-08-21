import { Platform } from 'react-native';

// Define a simple error info type to avoid React import
interface ErrorInfo {
  componentStack?: string;
}

// Simplified global error handler to avoid CORS conflicts
console.log('[GlobalErrorHandler] Initialized in safe mode');

// Export a no-op function to maintain compatibility
export function sendErrorToIframeParent() {
  // No-op to avoid CORS issues
}
