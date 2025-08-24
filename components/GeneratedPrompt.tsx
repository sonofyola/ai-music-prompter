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
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel="Generated music prompt result"
      accessibilityRole="region"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLevel={2}
        >
          🎵 Your Music Prompt
        </Text>
      </View>

      {/* Prompt content */}
      <View 
        style={styles.promptContainer}
        accessible={true}
        accessibilityLabel={`Generated prompt: ${prompt}`}
        accessibilityRole="text"
      >
        <Text style={styles.promptText} accessible={false}>
          {prompt}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.copyButton}
          onPress={handleCopy}
          accessible={true}
          accessibilityLabel="Copy prompt to clipboard"
          accessibilityHint="Copies the generated music prompt to your device clipboard"
          accessibilityRole="button"
        >
          <Text style={styles.copyButtonText}>📋 Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
          accessible={true}
          accessibilityLabel="Share music prompt"
          accessibilityHint="Share the generated prompt with other apps"
          accessibilityRole="button"
        >
          <Text style={styles.shareButtonText}>📤 Share</Text>
        </TouchableOpacity>
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
