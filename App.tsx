import React, { useState, useEffect } from 'react';
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
  const [stuckDetected, setStuckDetected] = useState(false);

  // Detect if we're stuck in an auth loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      // If loading for more than 10 seconds, consider it stuck
      timer = setTimeout(() => {
        console.log('🚨 Stuck screen detected - loading too long');
        setStuckDetected(true);
      }, 10000);
    } else {
      setStuckDetected(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  // Clean logging without overwhelming the console
  useEffect(() => {
    console.log('🔍 Auth State:', {
      isSignedIn: !!isSignedIn,
      hasUser: !!user,
      userEmail: user?.email || 'none',
      isLoading: !!isLoading
    });
  }, [isSignedIn, user, isLoading]);

  const handleForceSignOut = async () => {
    try {
      console.log('🔓 Force sign out initiated');
      await signout();
      setStuckDetected(false);
    } catch (error) {
      console.error('❌ Force sign out failed:', error);
    }
  };

  const handleContinueAnyway = () => {
    console.log('⚠️ User chose to continue anyway');
    setStuckDetected(false);
  };

  // Show stuck screen detection UI
  if (stuckDetected) {
    return (
      <View style={styles.stuckContainer}>
        <Text style={styles.stuckTitle}>🚨 Authentication Issue Detected</Text>
        <Text style={styles.stuckText}>
          The app seems to be stuck. Choose an option below:
        </Text>
        
        <TouchableOpacity 
          style={styles.stuckButton}
          onPress={handleForceSignOut}
        >
          <Text style={styles.stuckButtonText}>🔓 Force Sign Out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.stuckButton, { backgroundColor: '#FF9500' }]}
          onPress={() => setStuckDetected(false)}
        >
          <Text style={styles.stuckButtonText}>🔄 Try Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.stuckButton, { backgroundColor: '#34C759' }]}
          onPress={handleContinueAnyway}
        >
          <Text style={styles.stuckButtonText}>➡️ Continue Anyway</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>🔄 Loading...</Text>
        <Text style={styles.loadingText}>Checking authentication status</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Minimal debug header - only show if there are issues */}
      {user && !isSignedIn && (
        <View style={styles.debugHeader}>
          <Text style={styles.debugHeaderText}>
            ⚠️ Auth Issue: User exists but not signed in
          </Text>
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={handleForceSignOut}
          >
            <Text style={styles.debugButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main content */}
      <View style={{ flex: 1 }}>
        {isSignedIn && user ? (
          <NotificationProvider>
            <PromptHistoryProvider>
              <PromptFormScreen />
            </PromptHistoryProvider>
          </NotificationProvider>
        ) : (
          <AuthScreen />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  stuckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  stuckTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stuckText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  stuckButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    minWidth: 200,
  },
  stuckButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
