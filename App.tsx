import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './contexts/ThemeContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import PromptFormScreen from './screens/PromptFormScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UsageProvider>
          <PromptHistoryProvider>
            <PromptFormScreen />
          </PromptHistoryProvider>
        </UsageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
