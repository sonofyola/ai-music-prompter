import React, { useState, useEffect } from 'react';
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
import RandomTrackModal from '../components/RandomTrackModal';
import TemplatesModal from '../components/TemplatesModal';

// Contexts
import { useTheme } from '../contexts/ThemeContext';

// Utils
import { formatPrompt } from '../utils/promptFormatter';
import { GENRES, MOODS, INSTRUMENTS, TEMPOS, KEYS, TIME_SIGNATURES } from '../utils/musicData';

export default function PromptFormScreen() {
  const { colors } = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    genre: '',
    subgenre: '',
    mood: '',
    tempo: '',
    key: '',
    timeSignature: '',
    instruments: [] as string[],
    vocals: '',
    lyrics: '',
    structure: '',
    production: '',
    reference: '',
    weirdness: 0,
    customPrompt: '',
  });

  // Modal states
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);

  // Generated prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = createStyles(colors);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      const prompt = formatPrompt(formData);
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      Alert.alert('Error', 'Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRandomTrack = () => {
    setShowRandomModal(true);
  };

  const applyRandomTrack = (randomData: any) => {
    setFormData(prev => ({ ...prev, ...randomData }));
    setShowRandomModal(false);
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
            <TouchableOpacity onPress={() => setShowTemplatesModal(true)} style={styles.headerButton}>
              <MaterialIcons name="dashboard" size={24} color={colors.text} />
            </TouchableOpacity>
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
              <TouchableOpacity style={styles.quickActionButton} onPress={() => setShowTemplatesModal(true)}>
                <MaterialIcons name="dashboard" size={20} color={colors.background} />
                <Text style={styles.quickActionText}>Templates</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <PickerField
                label="Genre"
                value={formData.genre}
                onValueChange={(value) => updateFormData('genre', value)}
                items={GENRES}
                placeholder="Select a genre"
              />

              <FormField
                label="Subgenre (Optional)"
                value={formData.subgenre}
                onChangeText={(value) => updateFormData('subgenre', value)}
                placeholder="e.g., Progressive House, Melodic Dubstep"
              />

              <PickerField
                label="Mood"
                value={formData.mood}
                onValueChange={(value) => updateFormData('mood', value)}
                items={MOODS}
                placeholder="Select a mood"
              />

              <PickerField
                label="Tempo"
                value={formData.tempo}
                onValueChange={(value) => updateFormData('tempo', value)}
                items={TEMPOS}
                placeholder="Select tempo"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Musical Elements</Text>
              
              <PickerField
                label="Key"
                value={formData.key}
                onValueChange={(value) => updateFormData('key', value)}
                items={KEYS}
                placeholder="Select key"
              />

              <PickerField
                label="Time Signature"
                value={formData.timeSignature}
                onValueChange={(value) => updateFormData('timeSignature', value)}
                items={TIME_SIGNATURES}
                placeholder="Select time signature"
              />

              <MultiSelectField
                label="Instruments"
                selectedItems={formData.instruments}
                onSelectionChange={(items) => updateFormData('instruments', items)}
                items={INSTRUMENTS}
                placeholder="Select instruments"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Additional Details</Text>
              
              <FormField
                label="Vocals (Optional)"
                value={formData.vocals}
                onChangeText={(value) => updateFormData('vocals', value)}
                placeholder="e.g., Male vocals, Female harmonies, Vocoder"
                multiline
              />

              <FormField
                label="Lyrics Theme (Optional)"
                value={formData.lyrics}
                onChangeText={(value) => updateFormData('lyrics', value)}
                placeholder="e.g., Love, Adventure, Nostalgia"
                multiline
              />

              <FormField
                label="Song Structure (Optional)"
                value={formData.structure}
                onChangeText={(value) => updateFormData('structure', value)}
                placeholder="e.g., Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro"
                multiline
              />

              <FormField
                label="Production Style (Optional)"
                value={formData.production}
                onChangeText={(value) => updateFormData('production', value)}
                placeholder="e.g., Lo-fi, Polished, Raw, Ambient"
                multiline
              />

              <FormField
                label="Reference Track (Optional)"
                value={formData.reference}
                onChangeText={(value) => updateFormData('reference', value)}
                placeholder="e.g., Similar to 'Song Name' by Artist"
                multiline
              />
            </View>

            {/* Weirdness Slider */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Creativity Level</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Weirdness: {formData.weirdness}/10</Text>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${formData.weirdness * 10}%` }]} />
                  <TouchableOpacity
                    style={[styles.sliderThumb, { left: `${formData.weirdness * 10}%` }]}
                    onPressIn={() => {
                      const newValue = formData.weirdness >= 10 ? 0 : formData.weirdness + 1;
                      updateFormData('weirdness', newValue);
                    }}
                  />
                </View>
                <Text style={styles.sliderDescription}>
                  {formData.weirdness <= 3 ? 'Traditional' : 
                   formData.weirdness <= 6 ? 'Creative' : 
                   formData.weirdness <= 8 ? 'Experimental' : 'Avant-garde'}
                </Text>
              </View>
            </View>

            {/* Custom Prompt */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Custom Additions</Text>
              <FormField
                label="Additional Prompt Text (Optional)"
                value={formData.customPrompt}
                onChangeText={(value) => updateFormData('customPrompt', value)}
                placeholder="Add any specific details or requirements..."
                multiline
                numberOfLines={3}
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
              <GeneratedPrompt 
                prompt={generatedPrompt}
                onEmailCapture={() => {}}
              />
            )}
          </View>
        </ScrollView>

        {/* Modals */}
        <TemplatesModal
          visible={showTemplatesModal}
          onClose={() => setShowTemplatesModal(false)}
          onApplyTemplate={(template) => {
            setFormData(prev => ({ ...prev, ...template }));
            setShowTemplatesModal(false);
          }}
        />

        <RandomTrackModal
          visible={showRandomModal}
          onClose={() => setShowRandomModal(false)}
          onApply={applyRandomTrack}
        />
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
  headerButton: {
    padding: 8,
    marginLeft: 8,
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
  sliderContainer: {
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    position: 'relative',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    backgroundColor: colors.primary,
    borderRadius: 9,
    marginLeft: -9,
  },
  sliderDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
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
