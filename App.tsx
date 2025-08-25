import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { View, Text, StyleSheet, AppState } from 'react-native';

// Screens
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';

// Utils
import { checkPendingPayments, markPaymentCompleted } from './utils/paymentVerification';

// Trigger build - Metro cache fix applied
function AppContent() {
  const { isSignedIn, user, isLoading } = useBasic();

  // Check for completed payments when app becomes active
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active' && isSignedIn && user) {
        try {
          // Check if user completed a payment while away
          const pendingPayment = await checkPendingPayments();
          if (pendingPayment) {
            // Auto-upgrade user if they have a pending payment
            console.log('Found pending payment, auto-upgrading user:', user.email);
            await markPaymentCompleted(pendingPayment.subscriptionId);
            
            // The UsageContext will handle the upgrade through its normal flow
          }
        } catch (error) {
          console.error('Error checking pending payments:', error);
          // Don't crash the app - this is not critical
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isSignedIn, user]);

  // Add debug logging for user state changes
  useEffect(() => {
    if (user) {
      console.log('🔍 User state changed:', {
        id: user.id,
        email: user.email,
        name: user.name,
        isSignedIn
      });
    }
  }, [user, isSignedIn]);

  // Add debug logging
  console.log('AppContent render:', { isLoading, isSignedIn, user: user?.email });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>🎵 AI Music Prompter</Text>
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.debugText}>BasicTech is initializing...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isSignedIn && user ? (
        <PromptFormScreen />
      ) : (
        <AuthScreen />
      )}
    </View>
  );
}

export default function App() {
  console.log('App render - BasicProvider project_id:', schema.project_id);
  
  return (
    <BasicProvider project_id={schema.project_id} schema={schema}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </BasicProvider>
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
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});