import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { useTheme } from '../contexts/ThemeContext';

interface AudioAnalyzerProps {
  onAnalysisComplete: (analysis: AudioAnalysisResult) => void;
}

export interface AudioAnalysisResult {
  genres: string[];
  mood: string[];
  tempo: string;
  energy: string;
  style: string;
  instruments: string;
  vibe: string;
}

export default function AudioAnalyzer({ onAnalysisComplete }: AudioAnalyzerProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="info" size={24} color={colors.warning} />
        <Text style={styles.title}>Audio Analysis</Text>
        <MaterialIcons name="construction" size={20} color={colors.warning} />
      </View>
      
      <Text style={styles.description}>
        Audio analysis feature is temporarily disabled. We're working on implementing accurate audio processing capabilities.
      </Text>

      <View style={styles.disabledContainer}>
        <MaterialIcons name="block" size={48} color={colors.textSecondary} />
        <Text style={styles.disabledText}>
          Feature Coming Soon
        </Text>
        <Text style={styles.disabledSubtext}>
          We want to ensure 100% accuracy before releasing this feature
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.warning + '40',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  disabledContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  disabledText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  disabledSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
});
