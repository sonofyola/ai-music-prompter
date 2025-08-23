import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Components
import FormField from '../components/FormField';
import MultiSelectField from '../components/MultiSelectField';
import PickerField from '../components/PickerField';
import ThemeToggle from '../components/ThemeToggle';
import GeneratedPrompt from '../components/GeneratedPrompt';

// Contexts
import { useTheme } from '../contexts/ThemeContext';

// Types
import { MusicPromptData } from '../types';

// Utils
import { 
  formatMusicPrompt,
  PRIMARY_GENRES, 
  ELECTRONIC_GENRES, 
  MOODS, 
  VOCAL_GENDERS, 
  VOCAL_DELIVERIES, 
  ENERGY_LEVELS, 
  GROOVE_SWINGS, 
  TIME_SIGNATURES, 
  COMMON_KEYS, 
  BEAT_STYLES, 
  BASS_CHARACTERISTICS, 
  WEIRDNESS_LEVELS, 
  ERA_SUGGESTIONS 
} from '../utils/promptFormatter';

export default function PromptFormScreen() {
  const { colors } = useTheme();
  
  // Form state with full original parameters
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
    general_freeform: '',
  });

  // Generated prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = createStyles(colors);

  const updateFormData = (field: keyof MusicPromptData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      const prompt = formatMusicPrompt(formData);
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      Alert.alert('Error', 'Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRandomTrack = () => {
    // Generate comprehensive random values
    const randomPrimaryGenres = PRIMARY_GENRES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
    const randomElectronicGenres = ELECTRONIC_GENRES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
    const randomMoods = MOODS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
    const randomBeats = BEAT_STYLES.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
    const randomBass = BASS_CHARACTERISTICS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
    
    const randomBPM = Math.floor(Math.random() * 100) + 80; // 80-180 BPM
    const randomKey = COMMON_KEYS[Math.floor(Math.random() * COMMON_KEYS.length)];
    const randomEnergy = ENERGY_LEVELS[Math.floor(Math.random() * ENERGY_LEVELS.length)].value;
    const randomGroove = GROOVE_SWINGS[Math.floor(Math.random() * GROOVE_SWINGS.length)].value;
    const randomVocalGender = VOCAL_GENDERS[Math.floor(Math.random() * VOCAL_GENDERS.length)].value;
    const randomVocalDelivery = VOCAL_DELIVERIES[Math.floor(Math.random() * VOCAL_DELIVERIES.length)].value;
    const randomEra = ERA_SUGGESTIONS[Math.floor(Math.random() * ERA_SUGGESTIONS.length)];
    const randomWeirdness = WEIRDNESS_LEVELS[Math.floor(Math.random() * WEIRDNESS_LEVELS.length)].value;

    const subjects = [
      'Lost love', 'Urban nightlife', 'Digital dreams', 'Ocean waves', 'Neon lights',
      'Midnight drive', 'Cosmic journey', 'Underground culture', 'Future nostalgia',
      'Electric storm', 'Desert mirage', 'City rain', 'Quantum reality', 'Time travel'
    ];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];

    setFormData(prev => ({
      ...prev,
      subject: randomSubject,
      genres_primary: randomPrimaryGenres,
      genres_electronic: randomElectronicGenres,
      mood: randomMoods,
      tempo_bpm: randomBPM.toString(),
      key_scale: randomKey,
      energy: randomEnergy,
      beat: randomBeats,
      bass: randomBass,
      groove_swing: randomGroove,
      vocal_gender: randomVocalGender,
      vocal_delivery: randomVocalDelivery,
      era: randomEra,
      weirdness_level: randomWeirdness,
    }));
  };

  const handleUseTemplate = (templateName: string) => {
    const templates: Record<string, Partial<MusicPromptData>> = {
      'Deep House Vibes': {
        subject: 'Late night introspection',
        genres_primary: ['House'],
        genres_electronic: ['Deep House', 'Minimal House'],
        mood: ['dreamy', 'introspective'],
        tempo_bpm: '122',
        key_scale: 'A minor',
        energy: 'medium',
        beat: ['four-on-the-floor', 'rolling hi-hats'],
        bass: ['warm analog', 'deep sub'],
        groove_swing: 'straight',
        vocal_gender: 'female',
        vocal_delivery: 'whispered',
        era: '2000s deep house',
        weirdness_level: 'slightly_experimental',
      },
      'Peak Time Techno': {
        subject: 'Industrial machinery',
        genres_primary: ['Techno'],
        genres_electronic: ['Peak-Time Techno', 'Hard Techno'],
        mood: ['intense', 'dark'],
        tempo_bpm: '132',
        key_scale: 'F minor',
        energy: 'high',
        beat: ['four-on-the-floor', 'minimal percussion'],
        bass: ['punchy', 'distorted'],
        groove_swing: 'straight',
        vocal_gender: 'none',
        vocal_delivery: '',
        era: '1990s Berlin techno',
        weirdness_level: 'moderately_weird',
      },
      'Liquid DnB Journey': {
        subject: 'Flowing water',
        genres_primary: ['Drum & Bass'],
        genres_electronic: ['Liquid DnB', 'Atmospheric DnB'],
        mood: ['peaceful', 'uplifting'],
        tempo_bpm: '174',
        key_scale: 'D major',
        energy: 'evolving',
        beat: ['rolling DnB', 'amen break'],
        bass: ['warm analog', 'evolving'],
        groove_swing: 'straight',
        vocal_gender: 'female',
        vocal_delivery: 'singing',
        era: 'modern 2025',
        weirdness_level: 'conventional',
      },
    };

    const template = templates[templateName];
    if (template) {
      setFormData(prev => ({ ...prev, ...template }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="auto-awesome" size={28} color={colors.primary} />
            <Text style={styles.headerTitle}>AI Music Prompter</Text>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleRandomTrack}>
                <MaterialIcons name="shuffle" size={20} color={colors.background} />
                <Text style={styles.quickActionText}>Random Track</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert('Templates', 'Choose a template:', [
                { text: 'Deep House Vibes', onPress: () => handleUseTemplate('Deep House Vibes') },
                { text: 'Peak Time Techno', onPress: () => handleUseTemplate('Peak Time Techno') },
                { text: 'Liquid DnB Journey', onPress: () => handleUseTemplate('Liquid DnB Journey') },
                { text: 'Cancel', style: 'cancel' },
              ])}>
                <MaterialIcons name="dashboard" size={20} color={colors.background} />
                <Text style={styles.quickActionText}>Templates</Text>
              </TouchableOpacity>
            </View>

            {/* Subject/Theme */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Track Theme</Text>
              <FormField
                label="Subject/Theme"
                value={formData.subject}
                onChangeText={(value) => updateFormData('subject', value)}
                placeholder="e.g., Lost love, Urban nightlife, Digital dreams"
              />
            </View>

            {/* Genres */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Genres</Text>
              
              <MultiSelectField
                label="Primary Genres"
                values={formData.genres_primary}
                onValuesChange={(items) => updateFormData('genres_primary', items)}
                options={PRIMARY_GENRES}
                placeholder="Select primary genres"
                maxSelections={3}
              />

              <MultiSelectField
                label="Electronic Subgenres"
                values={formData.genres_electronic}
                onValuesChange={(items) => updateFormData('genres_electronic', items)}
                options={ELECTRONIC_GENRES}
                placeholder="Select electronic subgenres"
                maxSelections={4}
              />
            </View>

            {/* Mood & Energy */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Mood & Energy</Text>
              
              <MultiSelectField
                label="Mood"
                values={formData.mood}
                onValuesChange={(items) => updateFormData('mood', items)}
                options={MOODS}
                placeholder="Select moods"
                maxSelections={3}
              />

              <PickerField
                label="Energy Level"
                value={formData.energy}
                onValueChange={(value) => updateFormData('energy', value)}
                options={[
                  { label: 'Select energy level...', value: '' },
                  ...ENERGY_LEVELS
                ]}
              />
            </View>

            {/* Technical Specs */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Technical Specifications</Text>
              
              <FormField
                label="Tempo (BPM)"
                value={formData.tempo_bpm}
                onChangeText={(value) => updateFormData('tempo_bpm', value)}
                placeholder="e.g., 128, 174, 85"
                keyboardType="numeric"
              />

              <PickerField
                label="Key/Scale"
                value={formData.key_scale}
                onValueChange={(value) => updateFormData('key_scale', value)}
                options={[
                  { label: 'Select key...', value: '' },
                  ...COMMON_KEYS.map(key => ({ label: key, value: key }))
                ]}
              />

              <PickerField
                label="Groove/Swing"
                value={formData.groove_swing}
                onValueChange={(value) => updateFormData('groove_swing', value)}
                options={[
                  { label: 'Select groove...', value: '' },
                  ...GROOVE_SWINGS
                ]}
              />
            </View>

            {/* Rhythm & Bass */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Rhythm & Bass</Text>
              
              <MultiSelectField
                label="Beat Styles"
                values={formData.beat}
                onValuesChange={(items) => updateFormData('beat', items)}
                options={BEAT_STYLES}
                placeholder="Select beat styles"
                maxSelections={3}
              />

              <MultiSelectField
                label="Bass Characteristics"
                values={formData.bass}
                onValuesChange={(items) => updateFormData('bass', items)}
                options={BASS_CHARACTERISTICS}
                placeholder="Select bass characteristics"
                maxSelections={3}
              />
            </View>

            {/* Vocals */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Vocals</Text>
              
              <PickerField
                label="Vocal Gender"
                value={formData.vocal_gender}
                onValueChange={(value) => updateFormData('vocal_gender', value)}
                options={VOCAL_GENDERS}
              />

              <PickerField
                label="Vocal Delivery"
                value={formData.vocal_delivery}
                onValueChange={(value) => updateFormData('vocal_delivery', value)}
                options={VOCAL_DELIVERIES}
              />
            </View>

            {/* Production & Style */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Production & Style</Text>
              
              <PickerField
                label="Era/Style"
                value={formData.era}
                onValueChange={(value) => updateFormData('era', value)}
                options={[
                  { label: 'Select era...', value: '' },
                  ...ERA_SUGGESTIONS.map(era => ({ label: era, value: era }))
                ]}
              />

              <FormField
                label="Track Length"
                value={formData.length}
                onChangeText={(value) => updateFormData('length', value)}
                placeholder="e.g., 3:30, Radio edit, Extended club mix"
              />

              <FormField
                label="Master Notes"
                value={formData.master_notes}
                onChangeText={(value) => updateFormData('master_notes', value)}
                placeholder="e.g., Loud and punchy, Warm analog feel, Clean digital"
                multiline
              />
            </View>

            {/* Creativity Level */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Creativity Level</Text>
              
              <PickerField
                label="Weirdness Level"
                value={formData.weirdness_level}
                onValueChange={(value) => updateFormData('weirdness_level', value)}
                options={WEIRDNESS_LEVELS}
              />
            </View>

            {/* Freeform */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              
              <FormField
                label="General Freeform"
                value={formData.general_freeform}
                onChangeText={(value) => updateFormData('general_freeform', value)}
                placeholder="Add any specific details, references, or creative direction..."
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Generate Button */}
            <TouchableOpacity 
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={handleGeneratePrompt}
              disabled={isGenerating}
            >
              <MaterialIcons 
                name={isGenerating ? "hourglass-empty" : "auto-awesome"} 
                size={24} 
                color={colors.background} 
              />
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Generating...' : 'Generate AI Prompt'}
              </Text>
            </TouchableOpacity>

            {/* Generated Prompt */}
            {generatedPrompt && (
              <GeneratedPrompt prompt={generatedPrompt} />
            )}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  quickActionText: {
    color: colors.background,
    fontWeight: '600',
    marginLeft: 8,
  },
  formSection: {
    marginBottom: 24,
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
    marginTop: 24,
    marginBottom: 24,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
    marginLeft: 12,
  },
});