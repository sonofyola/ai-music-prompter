import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';

export default function SubscriptionScreen() {
  const { user, signout } = useBasic();
  const [isPro, setIsPro] = useState(false);
  const [debugCounter, setDebugCounter] = useState(0);

  console.log('SubscriptionScreen rendering...');
  console.log('Current isPro state:', isPro);
  console.log('Debug counter:', debugCounter);

  const handleTestButton = () => {
    console.log('TEST BUTTON PRESSED!');
    Alert.alert('Success!', 'Test button works perfectly!');
  };

  const handleUpgrade = () => {
    console.log('UPGRADE BUTTON PRESSED!');
    console.log('Current isPro state before:', isPro);
    
    // Simplified - no Alert, just direct state change
    console.log('About to set isPro to true...');
    setIsPro(true);
    setDebugCounter(prev => prev + 1);
    console.log('State update called');
  };

  const handleSignOut = () => {
    console.log('SIGN OUT PRESSED!');
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Sign Out', onPress: signout }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>💎 Subscription Screen</Text>
        
        <Text style={styles.debugText}>
          User: {user?.email || 'No user'}
        </Text>
        <Text style={styles.debugText}>
          Status: {isPro ? 'PRO' : 'FREE'}
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.testButton} onPress={handleTestButton}>
            <Text style={styles.buttonText}>🧪 TEST BUTTON</Text>
          </Pressable>

          {!isPro ? (
            <Pressable style={styles.testButton} onPress={handleTestButton}>
              <Text style={styles.buttonText}>🚀 UPGRADE TO PRO (TEMP TEST)</Text>
            </Pressable>
          ) : (
            <Text style={styles.proText}>✅ You are PRO!</Text>
          )}

          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.buttonText}>🚪 SIGN OUT</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  debugText: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    gap: 20,
  },
  testButton: {
    backgroundColor: '#FF9800',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 60,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 60,
    zIndex: 1,
    elevation: 1,
  },
  signOutButton: {
    backgroundColor: '#666666',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 60,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  proText: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
});
