import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../contexts/ThemeContext';
import IconFallback from './IconFallback';

interface GeneratedPromptProps {
  prompt: string;
}

export default function GeneratedPrompt({ prompt }: GeneratedPromptProps) {
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Generated Prompt</Text>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <IconFallback 
            name={copied ? 'check' : 'content-copy'} 
            size={20} 
            color={copied ? colors.success : colors.primary} 
          />
          <Text style={[styles.copyText, copied && { color: colors.success }]}>
            {copied ? 'Copied!' : 'Copy'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  promptContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  promptText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});
