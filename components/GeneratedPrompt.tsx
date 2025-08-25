import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface GeneratedPromptProps {
  prompt: string;
  onCopy?: () => void;
}

export default function GeneratedPrompt({ prompt, onCopy }: GeneratedPromptProps) {
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(prompt);
      if (onCopy) {
        onCopy();
      } else {
        Alert.alert('Copied!', 'Prompt copied to clipboard');
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generated Prompt</Text>
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>
      <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
        <Text style={styles.copyButtonText}>📋 Copy to Clipboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  promptContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#444444',
    marginBottom: 15,
  },
  promptText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});