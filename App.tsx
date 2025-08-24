import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { View, Text, StyleSheet } from 'react-native';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import { UsageProvider } from './contexts/UsageContext';

// Screens
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';

function AppContent() {
  const { isSignedIn, user, isLoading } = useBasic();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>🎵 AI Music Prompter</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isSignedIn && user ? (
        <UsageProvider>
          <NotificationProvider>
            <PromptHistoryProvider>
              <PromptFormScreen />
            </PromptHistoryProvider>
          </NotificationProvider>
        </UsageProvider>
      ) : (
        <AuthScreen />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <BasicProvider project_id={schema.project_id} schema={schema as any}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </BasicProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
