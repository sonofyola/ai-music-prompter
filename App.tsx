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

// Add a reset flag
let forceReset = false;
// Add a reset counter
let resetCounter = 0;

export const triggerGlobalLogout = () => {
  console.log('🔥 Forcing complete reset...');
  resetCounter++;
  forceReset = true;
  // Force a re-render by updating the component
  window.location?.reload?.(); // For web
};

function AppContent() {
  const { isSignedIn, user, isLoading, signout } = useBasic();

  // Force reset mechanism
  if (forceReset) {
    return (
      <View style={styles.resetContainer}>
        <Text style={styles.resetText}>🔄 Resetting App...</Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => {
            forceReset = false;
            window.location?.reload?.();
          }}
        >
          <Text style={styles.resetButtonText}>Complete Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
  const [appKey, setAppKey] = useState(0);
  
  // Listen for reset events
  React.useEffect(() => {
    const checkReset = () => {
      if (resetCounter > appKey) {
        setAppKey(resetCounter);
      }
    };
    
    const interval = setInterval(checkReset, 100);
    return () => clearInterval(interval);
  }, [appKey]);

  return (
    <BasicProvider 
      key={`basic-provider-${appKey}`} 
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
  resetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  resetText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
