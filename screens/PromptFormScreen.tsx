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

import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { formatMusicPrompt } from '../utils/promptFormatter';
import { 
  PRIMARY_GENRES as primaryGenres, 
  ELECTRONIC_GENRES as electronicGenres, 
  MOODS as moodOptions, 
  COMMON_KEYS,
  TIME_SIGNATURES,
  ENERGY_LEVELS,
  GROOVE_SWINGS,
  VOCAL_GENDERS,
  VOCAL_DELIVERIES
} from '../utils/musicData';
import { MusicPromptData } from '../types';

export default function PromptFormScreen() {
  const { colors } = useTheme();
  const { canGenerate, incrementGeneration } = useUsage();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [formData, setFormData] = useState<MusicPromptData>({
    subject: '',
    genres_primary: [],
    genres_electronic: [],
    mood: [],
    tempo_bpm: '',
    key_scale: '',
    time_signature: '',
    energy: '',
    beat: [],
    bass: [],
    groove_swing: '',
    sound_palette: '',
    vocal_gender: '',
    vocal_delivery: '',
    arrangement: '',
    fx_processing: '',
    space: '',
    references: '',
    era: '',
    mix_notes: '',
    master_notes: '',
    length: '',
    general_freeform: ''
  });

  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);

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
      time_signature: '',
      energy: '',
      beat: [],
      bass: [],
      groove_swing: '',
      sound_palette: '',
      vocal_gender: '',
      vocal_delivery: '',
      arrangement: '',
      fx_processing: '',
      space: '',
      references: '',
      era: '',
      mix_notes: '',
      master_notes: '',
      length: '',
      general_freeform: ''
    });
    setShowPrompt(false);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={handleTitlePress}>
              <Text style={styles.title}>AI Music Prompt Generator</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>Create detailed prompts for AI music tools</Text>
          </View>
          <ThemeToggle />
        </View>

        <UsageIndicator onUpgradePress={onUpgradePress} />

        <View style={styles.form}>
          <FormField
            label="Subject/Theme"
            value={formData.subject}
            onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
            placeholder="e.g., summer vibes, heartbreak, celebration"
          />

          <MultiSelectField
            label="Primary Genres"
            values={formData.genres_primary}
            onValuesChange={(values) => updateField('genres_primary', values)}
            options={primaryGenres}
            placeholder="Select primary genres..."
          />

          <MultiSelectField
            label="Electronic Subgenres"
            values={formData.genres_electronic}
            onValuesChange={(values) => updateField('genres_electronic', values)}
            options={electronicGenres}
            placeholder="Select electronic subgenres..."
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

          <PickerField
            label="Key/Scale"
            value={formData.key_scale}
            onValueChange={(value) => updateField('key_scale', value)}
            options={[
              { label: 'No preference', value: '' },
              ...COMMON_KEYS.map(key => ({ label: key, value: key }))
            ]}
          />

          <PickerField
            label="Time Signature"
            value={formData.time_signature}
            onValueChange={(value) => updateField('time_signature', value)}
            options={[
              { label: 'No preference', value: '' },
              ...TIME_SIGNATURES.map(sig => ({ label: sig, value: sig }))
            ]}
          />

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
            options={[
              'four-on-the-floor', 'broken beat', 'rolling DnB', 'trap hi-hats',
              'breakbeat', 'shuffle', 'swing', 'straight', 'syncopated'
            ]}
            placeholder="Select beat styles..."
          />

          <MultiSelectField
            label="Bass Character"
            values={formData.bass}
            onValuesChange={(values) => updateField('bass', values)}
            options={[
              'sub-heavy', 'rubbery 303', 'warm analog', 'punchy', 'deep',
              'distorted', 'filtered', 'wobbly', 'tight', 'boomy'
            ]}
            placeholder="Select bass characteristics..."
          />

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

          <FormField
            label="Sound Palette"
            value={formData.sound_palette}
            onChangeText={(text) => updateField('sound_palette', text)}
            placeholder="e.g., Juno pads, DX7 keys, 909 drums, modular blips..."
            multiline
            numberOfLines={2}
          />

          <FormField
            label="Arrangement"
            value={formData.arrangement}
            onChangeText={(text) => updateField('arrangement', text)}
            placeholder="e.g., intro-verse-chorus-drop-breakdown-outro..."
          />

          <FormField
            label="FX Processing"
            value={formData.fx_processing}
            onChangeText={(text) => updateField('fx_processing', text)}
            placeholder="e.g., sidechain, tape saturation, bitcrush fills..."
          />

          <FormField
            label="Space/Ambience"
            value={formData.space}
            onChangeText={(text) => updateField('space', text)}
            placeholder="e.g., intimate dry booth, club, cavernous hall..."
          />

          <FormField
            label="References"
            value={formData.references}
            onChangeText={(text) => updateField('references', text)}
            placeholder="Artists, tracks, or labels for inspiration..."
          />

          <FormField
            label="Era/Style"
            value={formData.era}
            onChangeText={(text) => updateField('era', text)}
            placeholder="e.g., 1993 warehouse, Y2K bloghouse, modern 2025..."
          />

          <FormField
            label="Length"
            value={formData.length}
            onChangeText={(text) => updateField('length', text)}
            placeholder="e.g., 2:30 radio edit, loopable 1:00, club 5:30..."
          />

          <FormField
            label="Mix Notes"
            value={formData.mix_notes}
            onChangeText={(text) => updateField('mix_notes', text)}
            placeholder="e.g., -10 to -8 LUFS, kick-bass separation..."
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
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
