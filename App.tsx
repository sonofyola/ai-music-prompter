import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider } from '@basictech/expo';
import { schema } from './basic.config';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';

// Main Screen
import PromptFormScreen from './screens/PromptFormScreen';

export default function App() {
  console.log('App render - BasicProvider project_id:', schema.project_id);
  
  return (
    <BasicProvider project_id={schema.project_id} schema={schema}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UsageProvider>
            <PromptHistoryProvider>
              <NotificationProvider>
                <MaintenanceProvider>
                  <PromptFormScreen />
                </MaintenanceProvider>
              </NotificationProvider>
            </PromptHistoryProvider>
          </UsageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </BasicProvider>
  );
}