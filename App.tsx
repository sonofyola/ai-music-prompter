import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

console.log('App.tsx loading...');

export default function App() {
  console.log('App component rendering...');
  
  try {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🎵 AI Music Prompter - Step 1</Text>
        <Text style={styles.subtext}>Basic React Native working</Text>
      </View>
    );
  } catch (error) {
    console.error('Error in App render:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Error in App</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  text: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
});

console.log('App.tsx loaded successfully');