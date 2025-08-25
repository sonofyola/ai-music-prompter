import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from './utils/theme';

function AppContent() {
  const { isSignedIn, user, isLoading, login } = useBasic();

  console.log('AppContent render:', { isLoading, isSignedIn, user: user?.email });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎵 AI Music Prompter</Text>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎵 AI Music Prompter</Text>
        <Text style={styles.text}>Please sign in to continue</Text>
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 AI Music Prompter</Text>
      <Text style={styles.text}>Welcome, {user?.email}!</Text>
      <Text style={styles.text}>App is working! Ready to load full interface.</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});