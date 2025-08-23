import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';

// Screens
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';

function AppContent() {
  const { isSignedIn, user, isLoading } = useBasic();
  const [bypassAuth, setBypassAuth] = useState(false);

  console.log('🔐 Auth State:', { isSignedIn, user: user?.email || 'none', isLoading, bypassAuth });

  if (isLoading) {
    return null; // You could add a loading screen here
  }

  // Show bypass option if stuck with sonofyola
  if (!bypassAuth && isSignedIn && user?.email === 'sonofyola@gmail.com') {
    return (
      <View style={styles.bypassContainer}>
        <Text style={styles.bypassTitle}>Authentication Issue Detected</Text>
        <Text style={styles.bypassText}>
          You're stuck logged in as "sonofyola@gmail.com". This is a persistent auth issue.
        </Text>
        <Text style={styles.bypassText}>
          You can either:
        </Text>
        <TouchableOpacity 
          style={styles.bypassButton}
          onPress={() => setBypassAuth(true)}
        >
          <Text style={styles.bypassButtonText}>Continue with Limited Features</Text>
        </TouchableOpacity>
        <Text style={styles.bypassNote}>
          (History and favorites will be disabled)
        </Text>
        <AuthScreen />
      </View>
    );
  }

  // Proper auth flow for monetization
  if (!bypassAuth && (!isSignedIn || !user)) {
    return <AuthScreen />;
  }

  return (
    <NotificationProvider>
      <PromptHistoryProvider>
        <PromptFormScreen />
      </PromptHistoryProvider>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <BasicProvider project_id={schema.project_id} schema={schema}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </BasicProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bypassContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  bypassTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  bypassText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
    lineHeight: 22,
  },
  bypassButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  bypassButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bypassNote: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 30,
  },
});
