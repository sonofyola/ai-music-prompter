import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';

// Screens
import AuthScreen from './screens/AuthScreen';
import PromptFormScreen from './screens/PromptFormScreen';

// Create a unique key that changes on each app restart
const APP_SESSION_KEY = `app-session-${Date.now()}-${Math.random()}`;

function AppContent() {
  const { isSignedIn, user, isLoading, signout } = useBasic();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotificationProvider>
          <UsageProvider>
            <PromptHistoryProvider>
              {isSignedIn && user ? <PromptFormScreen /> : <AuthScreen />}
            </PromptHistoryProvider>
          </UsageProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <BasicProvider 
      key={APP_SESSION_KEY}
      project_id={schema.project_id} 
      schema={schema}
    >
      <AppContent />
    </BasicProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});
