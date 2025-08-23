import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

// Global logout handler for debugging
let globalLogoutHandler: (() => void) | null = null;

export const triggerGlobalLogout = () => {
  console.log('🔥 Global logout triggered');
  if (globalLogoutHandler) {
    globalLogoutHandler();
  } else {
    console.log('❌ No global logout handler available');
  }
};

function AppContent() {
  const { isSignedIn, user, isLoading, signout } = useBasic();

  // Set up global logout handler
  React.useEffect(() => {
    globalLogoutHandler = async () => {
      try {
        console.log('🔄 Executing global logout...');
        if (signout) {
          await signout();
          console.log('✅ Global logout completed');
        }
      } catch (error) {
        console.error('❌ Global logout error:', error);
      }
    };

    return () => {
      globalLogoutHandler = null;
    };
  }, [signout]);

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
    <BasicProvider project_id={schema.project_id} schema={schema}>
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