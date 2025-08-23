import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';

// Global logout handler that can be called from anywhere
let globalLogoutHandler: (() => void) | null = null;

export const triggerGlobalLogout = () => {
  if (globalLogoutHandler) {
    globalLogoutHandler();
  }
};

function AppContent() {
  const { isSignedIn, user, isLoading } = useBasic();

  // Debug logging
  console.log('🔍 Auth State:', { isSignedIn, user: user?.email, isLoading });

  // Show loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show auth screen if not signed in
  if (!isSignedIn || !user) {
    console.log('📱 Showing AuthScreen - User signed out or not authenticated');
    return <AuthScreen />;
  }

  // Show main app
  console.log('📱 Showing PromptFormScreen - User authenticated');
  return <PromptFormScreen />;
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
            The app encountered an unexpected error. Please refresh the page to try again.
          </Text>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [basicProviderKey, setBasicProviderKey] = useState(0);

  // Set up global logout handler
  React.useEffect(() => {
    globalLogoutHandler = () => {
      console.log('🔥 GLOBAL LOGOUT: Forcing BasicProvider remount');
      
      // Clear all storage
      if (typeof window !== 'undefined') {
        try { localStorage.clear(); } catch (e) {}
        try { sessionStorage.clear(); } catch (e) {}
        try {
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
        } catch (e) {}
      }
      
      // Force BasicProvider to remount with new key
      setBasicProviderKey(prev => prev + 1);
    };
    
    return () => {
      globalLogoutHandler = null;
    };
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <BasicProvider 
          key={basicProviderKey} // This forces complete remount
          project_id={schema.project_id} 
          schema={schema as any}
        >
          <ThemeProvider>
            <NotificationProvider>
              <UsageProvider>
                <PromptHistoryProvider>
                  <AppContent />
                </PromptHistoryProvider>
              </UsageProvider>
            </NotificationProvider>
          </ThemeProvider>
        </BasicProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
