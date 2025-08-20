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
  const [isPlaying, setIsPlaying] = useState(false);

  const styles = createStyles(colors);

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        console.log('Audio file selected:', asset.name, 'Size:', asset.size);
        
        // Check file size (limit to ~15MB for 10-15 second clips)
        if (asset.size && asset.size > 15 * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            'Please select an audio file smaller than 15MB (typically 10-15 seconds).'
          );
          return;
        }

        setAudioUri(asset.uri);
        
        try {
          // Load audio for playback preview (don't request permissions yet)
          const { sound: audioSound } = await Audio.Sound.createAsync(
            { uri: asset.uri },
            { shouldPlay: false }
          );
          setSound(audioSound);
          console.log('Audio loaded successfully');
          
          Alert.alert(
            'Audio Loaded ✅',
            `Ready to analyze: ${asset.name}`,
            [
              { text: 'Preview', onPress: () => playPreview() },
              { text: 'Analyze', onPress: () => analyzeAudio(asset.uri) }
            ]
          );
        } catch (audioError) {
          console.error('Error loading audio:', audioError);
          Alert.alert('Audio Error', 'Could not load audio file for preview, but analysis can still proceed.');
          // Still allow analysis even if preview fails
        }
      }
    } catch (error) {
      console.error('Error picking audio file:', error);
      Alert.alert('Error', 'Failed to load audio file. Please try again.');
    }
  };

  const playPreview = async () => {
    console.log('Attempting to play/stop preview...');
    
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        
        // If currently playing, stop it
        if (status.isLoaded && status.isPlaying) {
          console.log('Stopping playback...');
          await sound.stopAsync();
          await sound.setPositionAsync(0);
          setIsPlaying(false);
          Alert.alert('Preview Stopped', 'Audio playback stopped');
          return;
        }
        
        // If not playing, start playback
        console.log('Starting playback...');
        
        // Set audio mode for playback (no permissions needed for playback)
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
        } catch (audioError) {
          console.error('Error setting audio mode:', audioError);
          // Continue anyway, might still work
        }

        await sound.playAsync();
        setIsPlaying(true);
        
        // Auto-stop after 10 seconds
        setTimeout(async () => {
          try {
            const currentStatus = await sound.getStatusAsync();
            if (currentStatus.isLoaded && currentStatus.isPlaying) {
              await sound.stopAsync();
              await sound.setPositionAsync(0);
              setIsPlaying(false);
              console.log('Preview auto-stopped after 10 seconds');
            }
          } catch (stopError) {
            console.error('Error stopping audio:', stopError);
          }
        }, 10000);
        
        Alert.alert('Playing Preview', 'Audio will play for 10 seconds. Click Preview again to stop.');
        
      } catch (error) {
        console.error('Error with audio playback:', error);
        setIsPlaying(false);
        Alert.alert('Playback Error', 'Could not play audio file. The file may be corrupted or in an unsupported format.');
      }
    } else {
      Alert.alert('No Audio', 'No audio file loaded for preview.');
    }
  };

  const analyzeAudio = async (uri: string) => {
    console.log('Starting audio analysis for:', uri);
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeAudioWithAI(uri);
      console.log('Analysis completed:', analysis);
      onAnalysisComplete(analysis);
      
      Alert.alert(
        'Analysis Complete! 🎵',
        `Detected: ${analysis.genres.join(', ')} • ${analysis.mood.join(', ')} • ${analysis.tempo}`,
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (error) {
      console.error('Error analyzing audio:', error);
      Alert.alert(
        'Analysis Failed',
        `Error: ${error.message || 'Could not analyze the audio file. Please try with a different file or check your connection.'}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAudio = async () => {
    if (sound) {
      // Stop playback if currently playing
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await sound.stopAsync();
        }
      } catch (error) {
        console.error('Error stopping audio during clear:', error);
      }
      
      await sound.unloadAsync();
      setSound(null);
    }
    setAudioUri(null);
    setIsPlaying(false);
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
              <MaterialIcons 
                name={isPlaying ? "stop" : "play-arrow"} 
                size={20} 
                color={colors.primary} 
              />
              <Text style={styles.previewButtonText}>
                {isPlaying ? 'Stop' : 'Preview'}
              </Text>
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
