import { Platform } from 'react-native';

// Define a simple error info type to avoid React import
interface ErrorInfo {
  componentStack?: string;
}

// This function will be exported and used by the ErrorBoundary component later
export function sendErrorToIframeParent(errorSource: any, errorInfo?: ErrorInfo) {
  // Temporarily disabled to avoid CORS conflicts
  console.log('[GlobalErrorHandler] Error captured but not sent to avoid CORS issues:', errorSource);
}

// Temporarily disable all global error handlers to avoid CORS conflicts
console.log('[GlobalErrorHandler] Global error handlers temporarily disabled to resolve CORS issues.');
