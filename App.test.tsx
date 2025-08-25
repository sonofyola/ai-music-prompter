import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TestApp() {
  console.log('TestApp render');
  
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.text}>🎵 AI Music Prompter</Text>
        <Text style={styles.subtext}>Test App - Dark Mode</Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a', // Dark background
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc', // Light text
    marginBottom: 16,
  },
  subtext: {
    fontSize: 16,
    color: '#e2e8f0', // Secondary light text
  },
});