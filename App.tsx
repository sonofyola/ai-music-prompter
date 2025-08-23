import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';

// Screens
import PromptFormScreen from './screens/PromptFormScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotificationProvider>
          <PromptHistoryProvider>
            <PromptFormScreen />
          </PromptHistoryProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
