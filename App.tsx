import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { View, Text, StyleSheet, AppState } from 'react-native';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import { UsageProvider } from './contexts/UsageContext';

// Screens
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';

// Utils
import { checkPendingPayments, markPaymentCompleted } from './utils/paymentVerification';

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
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isSignedIn, user]);

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
        <PromptFormScreen />
      ) : (
        <AuthScreen />
      )}
    </View>
  );
}

export default function App() {
  return (
    <BasicProvider project_id={schema.project_id} schema={schema}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UsageProvider>
            <PromptHistoryProvider>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
            </PromptHistoryProvider>
          </UsageProvider>
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