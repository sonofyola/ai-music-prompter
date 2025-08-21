import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import FormField from '../components/FormField';
import PickerField from '../components/PickerField';
import MultiSelectField from '../components/MultiSelectField';
import GeneratedPrompt from '../components/GeneratedPrompt';
import ThemeToggle from '../components/ThemeToggle';
import UsageIndicator from '../components/UsageIndicator';
import UpgradeModal from '../components/UpgradeModal';
import AdminScreen from './AdminScreen';
import SmartSuggestions from '../components/SmartSuggestions';
import RandomTrackModal from '../components/RandomTrackModal';
import TemplatesModal from '../components/TemplatesModal';
import PromptHistoryModal from '../components/PromptHistoryModal';

import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';
import { getSmartSuggestions } from '../utils/smartSuggestions';
import { formatMusicPrompt } from '../utils/promptFormatter';
import { 
  PRIMARY_GENRES as primaryGenres, 
  ELECTRONIC_GENRES as electronicGenres, 
  MOODS as moodOptions, 
  COMMON_KEYS,
  ENERGY_LEVELS,
  GROOVE_SWINGS,
  VOCAL_GENDERS,
  VOCAL_DELIVERIES,
  BEAT_STYLES,
  BASS_CHARACTERISTICS,
  WEIRDNESS_LEVELS
} from '../utils/musicData';
import { MusicPromptData } from '../types';

export default function PromptFormScreen() {
  const { colors } = useTheme();
  const { canGenerate, incrementGeneration } = useUsage();
  const { savePrompt } = usePromptHistory();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showRandomTrackModal, setShowRandomTrackModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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

  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);

  const smartSuggestions = getSmartSuggestions(formData);

  // Secret admin access - tap title 7 times
  const handleTitlePress = () => {
    const newCount = adminTapCount + 1;
    setAdminTapCount(newCount);
    
    if (newCount >= 7) {
      setShowAdmin(true);
      setAdminTapCount(0);
    }
    
    // Reset counter after 3 seconds
    setTimeout(() => setAdminTapCount(0), 3000);
  };

  // Add test helper for quick limit testing
  const handleTitleLongPress = () => {
    Alert.alert(
      'Test Mode',
      'Quick test options:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Set to 2 generations', 
          onPress: async () => {
            // Simulate having used 2 generations
            const { resetDailyCount, incrementGeneration } = useUsage();
            await resetDailyCount();
            await incrementGeneration();
            await incrementGeneration();
            Alert.alert('Test', 'Set to 2/3 generations used');
          }
        },
        { 
          text: 'Trigger upgrade modal', 
          onPress: () => setShowUpgradeModal(true)
        }
      ]
    );
  };

  const handleRandomTrackPress = () => {
    setShowRandomTrackModal(true);
  };

  const handleSelectRandomIdea = (subject: string) => {
    setFormData(prev => ({ ...prev, subject }));
  };

  const handleSelectTemplate = (templateData: Partial<MusicPromptData>) => {
    setFormData(prev => ({
      ...prev,
      ...templateData,
      // Ensure arrays are properly handled
      genres_primary: templateData.genres_primary || [],
      genres_electronic: templateData.genres_electronic || [],
      mood: templateData.mood || [],
      beat: templateData.beat || [],
      bass: templateData.bass || [],
    }));
  };

  const handleLoadPrompt = (promptData: MusicPromptData) => {
    setFormData(promptData);
    setShowPrompt(false); // Hide current generated prompt
  };

  const handleSaveCurrentPrompt = async (name: string) => {
    if (generatedPrompt) {
      await savePrompt(name, formData, generatedPrompt);
      Alert.alert('Success', 'Prompt saved successfully!');
    } else {
      Alert.alert('No Prompt', 'Generate a prompt first before saving.');
    }
  };

  const onUpgradePress = () => {
    setShowUpgradeModal(true);
  };

  const onCloseUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  if (showAdmin) {
    return <AdminScreen onBackToApp={() => setShowAdmin(false)} />;
  }

  const updateField = <K extends keyof MusicPromptData>(
    field: K,
    value: MusicPromptData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePrompt = async () => {
    if (!canGenerate) {
      Alert.alert(
        'Daily Limit Reached',
        'You\'ve used all 3 free generations today. Upgrade to unlimited for just $4.99!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade Now', onPress: onUpgradePress }
        ]
      );
      return;
    }

    const prompt = formatMusicPrompt(formData);
    setGeneratedPrompt(prompt);
    setShowPrompt(true);
    
    // Increment usage count
    await incrementGeneration();
  };

  const clearForm = () => {
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
      vocal_gender: '',
      vocal_delivery: '',
      era: '',
      master_notes: '',
      length: '',
      weirdness_level: '',
      general_freeform: ''
    });
    setShowPrompt(false);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={handleTitlePress}
              onLongPress={handleTitleLongPress}
              activeOpacity={0.7}
            >
              <Text style={styles.title}>AI Music Prompts</Text>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowHistoryModal(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="history" size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setShowTemplatesModal(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="dashboard" size={16} color={colors.primary} />
              </TouchableOpacity>
              <ThemeToggle />
            </View>
          </View>
          <Text style={styles.subtitle}>
            Create detailed prompts for AI music tools like Suno, Udio & MusicGen
          </Text>
        </View>

        <UsageIndicator onUpgradePress={onUpgradePress} />

        <View style={styles.form}>
          <FormField
            label="Subject/Theme"
            value={formData.subject}
            onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
            placeholder="e.g., summer vibes, heartbreak, celebration"
            showRandomGenerator={true}
            onRandomPress={handleRandomTrackPress}
          />

          <MultiSelectField
            label="Primary Genres"
            values={formData.genres_primary}
            onValuesChange={(values) => updateField('genres_primary', values)}
            options={primaryGenres}
            placeholder="Select primary genres..."
            maxSelections={2}
          />

          <MultiSelectField
            label="Electronic Subgenres"
            values={formData.genres_electronic}
            onValuesChange={(values) => updateField('genres_electronic', values)}
            options={electronicGenres}
            placeholder="Select electronic subgenres..."
            maxSelections={2}
          />

          <MultiSelectField
            label="Mood"
            values={formData.mood}
            onValuesChange={(values) => updateField('mood', values)}
            options={moodOptions}
            placeholder="Select moods..."
          />

          <FormField
            label="Tempo (BPM)"
            value={formData.tempo_bpm}
            onChangeText={(text) => updateField('tempo_bpm', text)}
            placeholder="e.g., 128, 120-130, slow..."
          />
          
          {smartSuggestions.bpm.length > 0 && (
            <SmartSuggestions
              title="Suggested BPM for your genres"
              suggestions={smartSuggestions.bpm}
              onSuggestionPress={(bpm) => updateField('tempo_bpm', bpm)}
            />
          )}

          <PickerField
            label="Key/Scale"
            value={formData.key_scale}
            onValueChange={(value) => updateField('key_scale', value)}
            options={[
              { label: 'No preference', value: '' },
              ...COMMON_KEYS.map(key => ({ label: key, value: key }))
            ]}
          />
          
          {smartSuggestions.keys.length > 0 && (
            <SmartSuggestions
              title="Keys that match your mood"
              suggestions={smartSuggestions.keys}
              onSuggestionPress={(key) => updateField('key_scale', key)}
            />
          )}

          <PickerField
            label="Energy Level"
            value={formData.energy}
            onValueChange={(value) => updateField('energy', value)}
            options={[
              { label: 'No preference', value: '' },
              ...ENERGY_LEVELS
            ]}
          />

          <MultiSelectField
            label="Beat Style"
            values={formData.beat}
            onValuesChange={(values) => updateField('beat', values)}
            options={BEAT_STYLES}
            placeholder="Select beat styles..."
          />
          
          {smartSuggestions.beats.length > 0 && (
            <SmartSuggestions
              title="Beat styles for your genre"
              suggestions={smartSuggestions.beats}
              onSuggestionPress={(beat) => {
                if (!formData.beat.includes(beat)) {
                  updateField('beat', [...formData.beat, beat]);
                }
              }}
            />
          )}

          <MultiSelectField
            label="Bass Character"
            values={formData.bass}
            onValuesChange={(values) => updateField('bass', values)}
            options={BASS_CHARACTERISTICS}
            placeholder="Select bass characteristics..."
          />
          
          {smartSuggestions.bass.length > 0 && (
            <SmartSuggestions
              title="Bass styles for your genre"
              suggestions={smartSuggestions.bass}
              onSuggestionPress={(bass) => {
                if (!formData.bass.includes(bass)) {
                  updateField('bass', [...formData.bass, bass]);
                }
              }}
            />
          )}

          <PickerField
            label="Groove/Swing"
            value={formData.groove_swing}
            onValueChange={(value) => updateField('groove_swing', value)}
            options={[
              { label: 'No preference', value: '' },
              ...GROOVE_SWINGS
            ]}
          />

          <PickerField
            label="Vocal Gender"
            value={formData.vocal_gender}
            onValueChange={(value) => updateField('vocal_gender', value)}
            options={VOCAL_GENDERS}
          />

          <PickerField
            label="Vocal Delivery"
            value={formData.vocal_delivery}
            onValueChange={(value) => updateField('vocal_delivery', value)}
            options={VOCAL_DELIVERIES}
          />

          <PickerField
            label="Weirdness Level"
            value={formData.weirdness_level}
            onValueChange={(value) => updateField('weirdness_level', value)}
            options={[
              { label: 'No preference', value: '' },
              ...WEIRDNESS_LEVELS
            ]}
          />

          <FormField
            label="Era/Style"
            value={formData.era}
            onChangeText={(text) => updateField('era', text)}
            placeholder="e.g., 1993 warehouse, Y2K bloghouse, modern 2025..."
          />

          {smartSuggestions.era.length > 0 && (
            <SmartSuggestions
              title="Era suggestions for your genre"
              suggestions={smartSuggestions.era}
              onSuggestionPress={(era) => updateField('era', era)}
            />
          )}

          <FormField
            label="Length"
            value={formData.length}
            onChangeText={(text) => updateField('length', text)}
            placeholder="e.g., 2:30 radio edit, loopable 1:00, club 5:30..."
          />

          <FormField
            label="Master Notes"
            value={formData.master_notes}
            onChangeText={(text) => updateField('master_notes', text)}
            placeholder="e.g., gentle glue comp, airy top, no brickwall..."
          />

          <FormField
            label="General Freeform"
            value={formData.general_freeform}
            onChangeText={(text) => updateField('general_freeform', text)}
            placeholder="Any additional guidance or specific requirements..."
            multiline
            numberOfLines={3}
          />
        </View>

        {showPrompt && (
          <GeneratedPrompt prompt={generatedPrompt} />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.generateButton, 
              !canGenerate && styles.disabledButton
            ]} 
            onPress={generatePrompt}
            disabled={!canGenerate}
          >
            <MaterialIcons name="auto-awesome" size={20} color="#fff" />
            <Text style={styles.generateButtonText}>
              {canGenerate ? 'Generate Prompt' : 'Daily Limit Reached'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
            <MaterialIcons name="clear" size={20} color={colors.textSecondary} />
            <Text style={styles.clearButtonText}>Clear Form</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>

      <UpgradeModal 
        visible={showUpgradeModal}
        onClose={onCloseUpgradeModal}
        onUpgradeSuccess={() => {
          // Handle successful upgrade - could refresh usage context
          setShowUpgradeModal(false);
        }}
      />

      <RandomTrackModal
        visible={showRandomTrackModal}
        onClose={() => setShowRandomTrackModal(false)}
        onSelectIdea={handleSelectRandomIdea}
      />

      <TemplatesModal
        visible={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <PromptHistoryModal
        visible={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onLoadPrompt={handleLoadPrompt}
        onSaveCurrentPrompt={handleSaveCurrentPrompt}
        currentFormData={formData}
        currentGeneratedPrompt={generatedPrompt}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 28,
    flex: 1,
    marginRight: 12,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    opacity: 0.75,
    marginTop: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headerButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeToggleContainer: {
    marginLeft: 4,
  },
  form: {
    backgroundColor: colors.surface,
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    height: 20,
  },
});
