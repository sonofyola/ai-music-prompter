import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';
import { MusicPromptData } from '../types';

export default function PromptFormScreen() {
  const { colors } = useTheme();
  const { canGenerate, incrementGeneration } = useUsage();
  const { savePrompt } = usePromptHistory();
  
  const [formData, setFormData] = useState<MusicPromptData>({
    subject: '',
    genres_primary: [],
    genres_electronic: [],
    mood: [],
    tempo_bpm: '',
    key_scale: '',
    energy: '',
    beat: [],
    bass: [],
    groove_swing: '',
    vocal_gender: '',
    vocal_delivery: '',
    era: '',
    master_notes: '',
    length: '',
    weirdness_level: '',
    general_freeform: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const generatePrompt = async () => {
    if (!canGenerate) {
      Alert.alert('Limit Reached', 'You have reached your daily limit. Please upgrade for unlimited access.');
      return;
    }

    setIsGenerating(true);
    
    try {
      await incrementGeneration();
      
      // Simple prompt generation for testing
      const prompt = `Create a ${formData.subject || 'music track'} with the following characteristics: ${formData.genres_primary.join(', ')} genre, ${formData.mood.join(', ')} mood, ${formData.tempo_bpm} BPM, ${formData.energy} energy level.`;
      
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGeneratedPrompt(prompt);
      setShowPrompt(true);
      
      // Auto-save to history
      await savePrompt(`Generated ${new Date().toLocaleDateString()}`, formData, prompt);
      
    } catch (error) {
      console.error('Error generating prompt:', error);
      Alert.alert('Error', 'Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      backgroundColor: colors.background,
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    form: {
      backgroundColor: colors.surface,
      margin: 20,
      padding: 20,
      borderRadius: 16,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    buttonContainer: {
      padding: 20,
      gap: 12,
    },
    generateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 18,
      gap: 8,
    },
    disabledButton: {
      backgroundColor: colors.textTertiary,
    },
    generateButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    promptContainer: {
      backgroundColor: colors.surface,
      margin: 20,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    promptTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    promptText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Music Prompter</Text>
          <Text style={styles.subtitle}>
            Generate detailed prompts for Suno, Udio & MusicGen
          </Text>
        </View>

        {/* Simple Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject/Theme</Text>
            <TextInput
              style={styles.input}
              value={formData.subject}
              onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
              placeholder="e.g., summer vibes, heartbreak, celebration"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tempo (BPM)</Text>
            <TextInput
              style={styles.input}
              value={formData.tempo_bpm}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tempo_bpm: text }))}
              placeholder="e.g., 128, 120-130, slow..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Energy Level</Text>
            <TextInput
              style={styles.input}
              value={formData.energy}
              onChangeText={(text) => setFormData(prev => ({ ...prev, energy: text }))}
              placeholder="e.g., high, medium, low, chill"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Generated Prompt */}
        {showPrompt && (
          <View style={styles.promptContainer}>
            <Text style={styles.promptTitle}>Generated Prompt</Text>
            <Text style={styles.promptText}>{generatedPrompt}</Text>
          </View>
        )}

        {/* Generate Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.generateButton, 
              (!canGenerate || isGenerating) && styles.disabledButton
            ]} 
            onPress={generatePrompt}
            disabled={!canGenerate || isGenerating}
          >
            <MaterialIcons name="auto-awesome" size={20} color="#fff" />
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generating...' : canGenerate ? 'Generate Prompt' : 'Daily Limit Reached'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
