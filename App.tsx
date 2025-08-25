import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import PromptFormScreen from './screens/PromptFormScreen';

console.log('App render - BasicProvider project_id:', schema.project_id);

function AppContent() {
  const { isLoading, isSignedIn, user, login, signout } = useBasic();
  
  console.log('AppContent render:', { isLoading, isSignedIn, user });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎵 AI Music Prompter</Text>
        <Text style={styles.subtitle}>Sign in to create professional music prompts</Text>
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <PromptFormScreen />;
}

export default function App() {
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
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  welcome: {
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
