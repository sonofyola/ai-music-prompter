import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { useTheme } from '../contexts/ThemeContext';
import { analyzeAudioWithAI } from '../utils/audioAnalysis';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const styles = createStyles(colors);

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Check file size (limit to ~15MB for 10-15 second clips)
        if (asset.size && asset.size > 15 * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            'Please select an audio file smaller than 15MB (typically 10-15 seconds).'
          );
          return;
        }

        setAudioUri(asset.uri);
        
        // Load audio for playback preview
        const { sound: audioSound } = await Audio.loadAsync({ uri: asset.uri });
        setSound(audioSound);
        
        Alert.alert(
          'Audio Loaded',
          `Ready to analyze: ${asset.name}`,
          [
            { text: 'Preview', onPress: () => playPreview() },
            { text: 'Analyze', onPress: () => analyzeAudio(asset.uri) }
          ]
        );
      }
    } catch (error) {
      console.error('Error picking audio file:', error);
      Alert.alert('Error', 'Failed to load audio file. Please try again.');
    }
  };

  const playPreview = async () => {
    if (sound) {
      try {
        await sound.playAsync();
        // Stop after 10 seconds
        setTimeout(async () => {
          await sound.stopAsync();
          await sound.setPositionAsync(0);
        }, 10000);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const analyzeAudio = async (uri: string) => {
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeAudioWithAI(uri);
      onAnalysisComplete(analysis);
      
      Alert.alert(
        'Analysis Complete! 🎵',
        'Audio characteristics have been extracted and added to your prompt.',
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (error) {
      console.error('Error analyzing audio:', error);
      Alert.alert(
        'Analysis Failed',
        'Could not analyze the audio file. Please try with a different file or check your connection.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setAudioUri(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="audiotrack" size={24} color={colors.primary} />
        <Text style={styles.title}>Audio Analysis</Text>
        <MaterialIcons name="auto-awesome" size={20} color={colors.accent} />
      </View>
      
      <Text style={styles.description}>
        Upload a 10-15 second audio clip to automatically detect style, mood, and musical characteristics
      </Text>

      {!audioUri ? (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickAudioFile}
          disabled={isAnalyzing}
        >
          <MaterialIcons name="upload-file" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Select Audio File</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.audioControls}>
          <View style={styles.audioInfo}>
            <MaterialIcons name="music-note" size={20} color={colors.success} />
            <Text style={styles.audioInfoText}>Audio loaded</Text>
          </View>
          
          <View style={styles.controlButtons}>
            <TouchableOpacity 
              style={styles.previewButton}
              onPress={playPreview}
              disabled={isAnalyzing}
            >
              <MaterialIcons name="play-arrow" size={20} color={colors.primary} />
              <Text style={styles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.analyzeButton, isAnalyzing && styles.disabledButton]}
              onPress={() => analyzeAudio(audioUri)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="analytics" size={20} color="#fff" />
              )}
              <Text style={styles.analyzeButtonText}>
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearAudio}
              disabled={isAnalyzing}
            >
              <MaterialIcons name="clear" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isAnalyzing && (
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.analyzingText}>
            Analyzing audio characteristics...
          </Text>
          <Text style={styles.analyzingSubtext}>
            Detecting tempo, key, mood, and style
          </Text>
        </View>
      )}
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
    borderColor: colors.accent + '40',
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  audioControls: {
    gap: 16,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.success + '20',
    borderRadius: 8,
  },
  audioInfoText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
  },
  previewButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    gap: 4,
    flex: 2,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  disabledButton: {
    opacity: 0.6,
  },
  analyzingContainer: {
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  analyzingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});