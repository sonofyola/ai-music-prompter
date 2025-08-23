import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';

// Screens
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';

function AppContent() {
  const { isSignedIn, user, isLoading } = useBasic();

  console.log('🔐 Auth State:', { isSignedIn, user: user?.email || 'none', isLoading });

  if (isLoading) {
    return null; // You could add a loading screen here
  }

  // Bypass authentication - always show the main app
  return (
    <ThemeProvider>
      <NotificationProvider>
        <PromptHistoryProvider>
          <PromptFormScreen />
        </PromptHistoryProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <BasicProvider project_id={schema.project_id} schema={schema}>
        <AppContent />
      </BasicProvider>
    </SafeAreaProvider>
  );
}
