import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { MusicPromptData } from '../types';
import { formatMusicPrompt } from '../utils/promptFormatter';
import { 
  PRIMARY_GENRES, 
  ELECTRONIC_GENRES, 
  MOODS, 
  VOCAL_GENDERS, 
  VOCAL_DELIVERIES,
  ENERGY_LEVELS,
  GROOVE_SWINGS,
  BEAT_STYLES,
  BASS_CHARACTERISTICS,
  WEIRDNESS_LEVELS,
  COMMON_KEYS
} from '../utils/musicData';
import { generateRandomTrackIdea } from '../utils/randomTrackGenerator';

import FormField from '../components/FormField';
import MultiSelectField from '../components/MultiSelectField';
import PickerField from '../components/PickerField';
import ThemeToggle from '../components/ThemeToggle';

export default function PromptFormScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
    vocal_gender: 'none',
    vocal_delivery: '',
    era: '',
    master_notes: '',
    length: '',
    weirdness_level: 'conventional',
    general_freeform: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const handleRandomTrackIdea = () => {
    const idea = generateRandomTrackIdea();
    setFormData(prev => ({
      ...prev,
      subject: idea.subject
    }));
    
    Alert.alert(
      'Random Track Idea',
      idea.description,
      [{ text: 'Use This Idea', style: 'default' }]
    );
  };

  const generatePrompt = () => {
    if (!formData.subject.trim() && formData.genres_primary.length === 0 && formData.genres_electronic.length === 0) {
      Alert.alert(
        'Missing Information',
        'Please add at least a subject/theme or select some genres to generate a prompt.',
        [{ text: 'OK' }]
      );
      return;
    }

    const prompt = formatMusicPrompt(formData);
    setGeneratedPrompt(prompt);
    setShowPrompt(true);
  };

  const copyToClipboard = async () => {
    try {
      // For now, just show an alert. In a real app, you'd use Clipboard API
      Alert.alert(
        'Prompt Copied!',
        'The generated prompt has been copied to your clipboard.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to copy prompt to clipboard.');
    }
  };

  const resetForm = () => {
    Alert.alert(
      'Reset Form',
      'Are you sure you want to clear all fields?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setFormData({
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
              vocal_gender: 'none',
              vocal_delivery: '',
              era: '',
              master_notes: '',
              length: '',
              weirdness_level: 'conventional',
              general_freeform: ''
            });
            setGeneratedPrompt('');
            setShowPrompt(false);
          }
        }
      ]
    );
  };

  if (showPrompt) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowPrompt(false)}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            <Text style={styles.backText}>Back to Form</Text>
          </TouchableOpacity>
          <ThemeToggle />
        </View>

        <ScrollView style={styles.promptContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
              <Text style={styles.promptTitle}>Generated AI Music Prompt</Text>
            </View>
            
            <Text style={styles.promptText}>{generatedPrompt}</Text>
            
            <View style={styles.promptActions}>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <MaterialIcons name="content-copy" size={20} color={colors.background} />
                <Text style={styles.copyButtonText}>Copy Prompt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.newPromptButton} onPress={generatePrompt}>
                <MaterialIcons name="refresh" size={20} color={colors.primary} />
                <Text style={styles.newPromptButtonText}>Regenerate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="music-note" size={24} color={colors.primary} />
            <Text style={styles.headerTitle}>AI Music Prompter</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
              <MaterialIcons name="refresh" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <ThemeToggle />
          </View>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Concept</Text>
            
            <FormField
              label="Subject/Theme"
              value={formData.subject}
              onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
              placeholder="e.g., lost in the city, digital dreams, summer nights..."
              showRandomGenerator={true}
              onRandomPress={handleRandomTrackIdea}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Musical Style</Text>
            
            <MultiSelectField
              label="Primary Genres"
              values={formData.genres_primary}
              onValuesChange={(values) => setFormData(prev => ({ ...prev, genres_primary: values }))}
              options={PRIMARY_GENRES}
              placeholder="Select primary genres..."
              maxSelections={2}
            />
            
            <MultiSelectField
              label="Electronic Subgenres"
              values={formData.genres_electronic}
              onValuesChange={(values) => setFormData(prev => ({ ...prev, genres_electronic: values }))}
              options={ELECTRONIC_GENRES}
              placeholder="Select electronic subgenres..."
              maxSelections={2}
            />
            
            <MultiSelectField
              label="Mood & Atmosphere"
              values={formData.mood}
              onValuesChange={(values) => setFormData(prev => ({ ...prev, mood: values }))}
              options={MOODS}
              placeholder="Select moods..."
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Parameters</Text>
            
            <FormField
              label="Tempo (BPM)"
              value={formData.tempo_bpm}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tempo_bpm: text }))}
              placeholder="e.g., 128, 140, 85-90"
              keyboardType="numeric"
            />
            
            <PickerField
              label="Key/Scale"
              value={formData.key_scale}
              onValueChange={(value) => setFormData(prev => ({ ...prev, key_scale: value }))}
              options={[
                { label: 'Select key...', value: '' },
                ...COMMON_KEYS.map(key => ({ label: key, value: key }))
              ]}
            />
            
            <PickerField
              label="Energy Level"
              value={formData.energy}
              onValueChange={(value) => setFormData(prev => ({ ...prev, energy: value }))}
              options={[
                { label: 'Select energy...', value: '' },
                ...ENERGY_LEVELS
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rhythm & Groove</Text>
            
            <MultiSelectField
              label="Beat Style"
              values={formData.beat}
              onValuesChange={(values) => setFormData(prev => ({ ...prev, beat: values }))}
              options={BEAT_STYLES}
              placeholder="Select beat styles..."
            />
            
            <MultiSelectField
              label="Bass Character"
              values={formData.bass}
              onValuesChange={(values) => setFormData(prev => ({ ...prev, bass: values }))}
              options={BASS_CHARACTERISTICS}
              placeholder="Select bass characteristics..."
            />
            
            <PickerField
              label="Groove & Swing"
              value={formData.groove_swing}
              onValueChange={(value) => setFormData(prev => ({ ...prev, groove_swing: value }))}
              options={[
                { label: 'Select groove...', value: '' },
                ...GROOVE_SWINGS
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vocals</Text>
            
            <PickerField
              label="Vocal Gender"
              value={formData.vocal_gender}
              onValueChange={(value) => setFormData(prev => ({ ...prev, vocal_gender: value }))}
              options={VOCAL_GENDERS}
            />
            
            <PickerField
              label="Vocal Delivery"
              value={formData.vocal_delivery}
              onValueChange={(value) => setFormData(prev => ({ ...prev, vocal_delivery: value }))}
              options={VOCAL_DELIVERIES}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Production & Style</Text>
            
            <FormField
              label="Era/Time Period"
              value={formData.era}
              onChangeText={(text) => setFormData(prev => ({ ...prev, era: text }))}
              placeholder="e.g., 1980s synthwave, 2000s garage, modern 2025"
            />
            
            <FormField
              label="Track Length"
              value={formData.length}
              onChangeText={(text) => setFormData(prev => ({ ...prev, length: text }))}
              placeholder="e.g., 3:30, radio edit, extended club mix"
            />
            
            <PickerField
              label="Weirdness Level"
              value={formData.weirdness_level}
              onValueChange={(value) => setFormData(prev => ({ ...prev, weirdness_level: value }))}
              options={WEIRDNESS_LEVELS}
            />
            
            <FormField
              label="Master/Mix Notes"
              value={formData.master_notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, master_notes: text }))}
              placeholder="e.g., warm analog saturation, crisp digital clarity"
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Creative Direction</Text>
            
            <FormField
              label="Freeform Description"
              value={formData.general_freeform}
              onChangeText={(text) => setFormData(prev => ({ ...prev, general_freeform: text }))}
              placeholder="Add any additional creative direction, inspiration, or specific elements you want to include..."
              multiline
              style={{ minHeight: 100 }}
            />
          </View>

          <TouchableOpacity style={styles.generateButton} onPress={generatePrompt}>
            <MaterialIcons name="auto-awesome" size={24} color={colors.background} />
            <Text style={styles.generateButtonText}>Generate AI Music Prompt</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    padding: 8,
    marginRight: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 32,
    marginBottom: 16,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
    marginLeft: 8,
  },
  promptContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  promptCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  promptText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 20,
  },
  promptActions: {
    flexDirection: 'row',
    gap: 12,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
    marginLeft: 8,
  },
  newPromptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  newPromptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});