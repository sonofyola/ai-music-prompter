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
  const { isSignedIn, user, isLoading, signout } = useBasic();
  const [forceRefresh, setForceRefresh] = useState(0);

  console.log('🔐 Auth State:', { isSignedIn, user: user?.email || 'none', isLoading });

  if (isLoading) {
    return null;
  }

  // If stuck with sonofyola, show options to break free
  if (isSignedIn && user?.email === 'sonofyola@gmail.com') {
    return (
      <View style={styles.stuckContainer}>
        <Text style={styles.stuckTitle}>🔒 Authentication Stuck</Text>
        <Text style={styles.stuckText}>
          You're persistently logged in as "sonofyola@gmail.com"
        </Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={async () => {
            try {
              await signout();
              // Force remount of BasicProvider
              setForceRefresh(prev => prev + 1);
            } catch (e) {
              console.error('Signout failed:', e);
            }
          }}
        >
          <Text style={styles.actionButtonText}>🔓 Force Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
          onPress={() => {
            // Force complete remount
            setForceRefresh(prev => prev + 1);
          }}
        >
          <Text style={styles.actionButtonText}>🔄 Force Refresh Auth</Text>
        </TouchableOpacity>

        <Text style={styles.debugText}>
          Current user: {user?.email || 'Unknown'}
        </Text>
        <Text style={styles.debugText}>
          Refresh count: {forceRefresh}
        </Text>
      </View>
    );
  }

  // Normal auth flow
  if (!isSignedIn || !user) {
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
  const [authKey, setAuthKey] = useState(0);

  return (
    <SafeAreaProvider>
      <BasicProvider 
        key={`basic-provider-${authKey}`} // Force remount when key changes
        project_id={schema.project_id} 
        schema={schema}
      >
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </BasicProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  stuckContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  stuckTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  stuckText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
  },
});
