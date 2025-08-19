import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

interface GeneratedPromptProps {
  prompt: string;
}

export default function GeneratedPrompt({ prompt }: GeneratedPromptProps) {
  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(prompt);
      Alert.alert('Copied!', 'Prompt copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy prompt');
    }
  };

  const characterCount = prompt.length;
  const isOptimal = characterCount <= 1200;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Generated Prompt</Text>
        <View style={styles.stats}>
          <Text style={[styles.charCount, !isOptimal && styles.overLimit]}>
            {characterCount}/1200 chars
          </Text>
          {!isOptimal && (
            <MaterialIcons name="warning" size={16} color="#ff6b6b" />
          )}
        </View>
      </View>
      
      <View style={styles.promptContainer}>
        <Text style={styles.promptText} selectable>
          {prompt}
        </Text>
      </View>

      <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
        <MaterialIcons name="content-copy" size={20} color="#fff" />
        <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
      </TouchableOpacity>

      {!isOptimal && (
        <Text style={styles.warning}>
          ⚠️ Prompt exceeds recommended 1200 character limit. Consider shortening some fields.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  charCount: {
    fontSize: 14,
    color: '#666',
  },
  overLimit: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
  promptContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  promptText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warning: {
    marginTop: 12,
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});