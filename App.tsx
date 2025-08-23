import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryProvider';

// Screens
import PromptFormScreen from './screens/PromptFormScreen';
import AuthScreen from './screens/AuthScreen';

function AppContent() {
  const { isSignedIn, user, isLoading, signout } = useBasic();

  // Log everything aggressively
  console.log('🔍 FULL AUTH STATE:', {
    isSignedIn,
    user,
    userEmail: user?.email,
    isLoading,
    userObject: JSON.stringify(user)
  });

  // Force show debug info on screen
  const debugInfo = {
    isSignedIn: String(isSignedIn),
    userEmail: user?.email || 'none',
    isLoading: String(isLoading),
    userExists: user ? 'yes' : 'no'
  };

  if (isLoading) {
    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>🔄 Loading Auth...</Text>
        <Text style={styles.debugText}>Please wait...</Text>
      </View>
    );
  }

  // ALWAYS show current state at the top of screen
  return (
    <View style={{ flex: 1 }}>
      {/* Debug header - always visible */}
      <View style={styles.debugHeader}>
        <Text style={styles.debugHeaderText}>
          Auth: {debugInfo.isSignedIn} | User: {debugInfo.userEmail}
        </Text>
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={async () => {
            console.log('🔓 Manual signout attempt');
            try {
              await signout();
            } catch (e) {
              console.error('Signout error:', e);
            }
          }}
        >
          <Text style={styles.debugButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={{ flex: 1 }}>
        {!isSignedIn || !user ? (
          <AuthScreen />
        ) : (
          <NotificationProvider>
            <PromptHistoryProvider>
              <PromptFormScreen />
            </PromptHistoryProvider>
          </NotificationProvider>
        )}
      </View>
    </View>
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
  debugContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  debugTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 16,
    color: '#666',
  },
  debugHeader: {
    backgroundColor: '#FF3B30',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debugHeaderText: {
    color: 'white',
    fontSize: 12,
    flex: 1,
  },
  debugButton: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  debugButtonText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
