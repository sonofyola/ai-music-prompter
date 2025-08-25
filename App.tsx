import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { View, Text, StyleSheet } from 'react-native';

// Import your contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Import your screens
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';
import MaintenanceScreen from './components/MaintenanceScreen';

// Import your theme
import { colors } from './utils/theme';

function AppContent() {
  const { isSignedIn, user, isLoading } = useBasic();

  console.log('AppContent render:', { isLoading, isSignedIn, user: user?.email });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>🎵 AI Music Prompter</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show the main app if signed in, otherwise show auth screen
  if (isSignedIn && user) {
    return <PromptFormScreen />;
  } else {
    return <AuthScreen />;
  }
}

export default function App() {
  console.log('App render - BasicProvider project_id:', schema.project_id);
  
  return (
    <BasicProvider project_id={schema.project_id} schema={schema}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NotificationProvider>
            <MaintenanceProvider>
              <UsageProvider>
                <PromptHistoryProvider>
                  <AppContent />
                </PromptHistoryProvider>
              </UsageProvider>
            </MaintenanceProvider>
          </NotificationProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </BasicProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
});