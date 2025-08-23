import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';

// Screens
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';

function AppContent() {
  const { isSignedIn, user, isLoading, signout } = useBasic();
  const [showStuckScreen, setShowStuckScreen] = useState(false);

  console.log('🔐 Auth State:', { isSignedIn, user: user?.email || 'none', isLoading });

  // Check for stuck state on every render
  useEffect(() => {
    if (isSignedIn && user?.email === 'sonofyola@gmail.com') {
      console.log('🚨 STUCK STATE DETECTED - showing stuck screen');
      setShowStuckScreen(true);
    } else {
      setShowStuckScreen(false);
    }
  }, [isSignedIn, user?.email]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ALWAYS show stuck screen if detected, regardless of other conditions
  if (showStuckScreen || (isSignedIn && user?.email === 'sonofyola@gmail.com')) {
    return (
      <View style={styles.stuckContainer}>
        <Text style={styles.stuckTitle}>🔒 Authentication Issue</Text>
        <Text style={styles.stuckText}>
          Stuck logged in as: {user?.email || 'unknown'}
        </Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={async () => {
            console.log('🔓 Attempting force signout...');
            try {
              await signout();
              setShowStuckScreen(false);
            } catch (e) {
              console.error('Signout failed:', e);
              Alert.alert('Error', 'Failed to sign out. Try refreshing the app.');
            }
          }}
        >
          <Text style={styles.actionButtonText}>🔓 Force Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
          onPress={() => {
            console.log('🔄 Forcing refresh...');
            setShowStuckScreen(false);
            // This will trigger a re-render and hopefully break the cycle
          }}
        >
          <Text style={styles.actionButtonText}>🔄 Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#34C759' }]}
          onPress={() => {
            console.log('⚠️ Bypassing auth...');
            setShowStuckScreen(false);
            // This will let them continue without proper auth
          }}
        >
          <Text style={styles.actionButtonText}>⚠️ Continue Anyway</Text>
        </TouchableOpacity>

        <Text style={styles.debugText}>
          User: {user?.email || 'None'}
        </Text>
        <Text style={styles.debugText}>
          Signed In: {isSignedIn ? 'Yes' : 'No'}
        </Text>
      </View>
    );
  }

  // Normal auth flow - but bypass if we just chose "Continue Anyway"
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
    marginTop: 5,
  },
});
