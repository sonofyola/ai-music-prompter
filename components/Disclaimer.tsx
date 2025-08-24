import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface DisclaimerProps {
  style?: any;
  textStyle?: any;
  compact?: boolean;
}

export default function Disclaimer({ style, textStyle, compact = false }: DisclaimerProps) {
  const { colors } = useTheme();
  
  const styles = createStyles(colors);

  if (compact) {
    return (
      <Text style={[styles.compactText, textStyle]}>
        Not affiliated with Suno AI, Udio, Riffusion, MusicGen, or other AI music platforms.
      </Text>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, textStyle]}>⚠️ Disclaimer</Text>
      <Text style={[styles.text, textStyle]}>
        AI Music Prompter is an independent tool and is not affiliated with, endorsed by, or connected to Suno AI, Udio, Riffusion, MusicGen, or any other AI music generation platforms. All trademarks and product names are the property of their respective owners.
      </Text>
      <Text style={[styles.subText, textStyle]}>
        This tool helps you create better prompts for these platforms but operates independently.
      </Text>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning || colors.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  subText: {
    fontSize: 11,
    color: colors.textTertiary,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  compactText: {
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 14,
  },
});