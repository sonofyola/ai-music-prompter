import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface GeneratedPromptProps {
  prompt: string;
  onCopy: () => void;
}

export default function GeneratedPrompt({ prompt, onCopy }: GeneratedPromptProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(prompt);
    onCopy();
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
    padding: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  promptContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  promptText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});