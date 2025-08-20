import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import FormField from '../components/FormField';
import PickerField from '../components/PickerField';
import MultiSelectField from '../components/MultiSelectField';
import GeneratedPrompt from '../components/GeneratedPrompt';
import ThemeToggle from '../components/ThemeToggle';
import UsageIndicator from '../components/UsageIndicator';
import UpgradeModal from '../components/UpgradeModal';
import AudioAnalyzer, { AudioAnalysisResult } from '../components/AudioAnalyzer';
import AdminScreen from './AdminScreen';
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
  TIME_SIGNATURES,
  COMMON_KEYS,
} from '../utils/musicData';

interface PromptFormScreenProps {
  onUpgradePress: () => void;
  showUpgradeModal: boolean;
  onCloseUpgradeModal: () => void;
}

export default function PromptFormScreen({ 
  onUpgradePress, 
  showUpgradeModal, 
  onCloseUpgradeModal 
}: PromptFormScreenProps) {
  const { colors } = useTheme();
  const { canGenerate, incrementGeneration, isUnlimited } = useUsage();
  
  const [formData, setFormData] = useState<MusicPromptData>({
    genres_primary: [],
    genres_electronic: [],
    subject: '',
    vocal_gender: '',
    vocal_delivery: '',
    mood: [],
    tempo_bpm: '',
    key_scale: '',
    time_signature: '',
    energy: '',
    bass: '',
    beat: '',
    groove_swing: '',
    sound_palette: '',
    arrangement: '',
    fx_processing: '',
    space: '',
    references: '',
    mix_notes: '',
    master_notes: '',
    era: '',
    length: '',
    general_freeform: '',
    audio_analysis: undefined,
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
      genres_primary: [],
      genres_electronic: [],
      subject: '',
      vocal_gender: '',
      vocal_delivery: '',
      mood: [],
      tempo_bpm: '',
      key_scale: '',
      time_signature: '',
      energy: '',
      bass: '',
      beat: '',
      groove_swing: '',
      sound_palette: '',
      arrangement: '',
      fx_processing: '',
      space: '',
      references: '',
      mix_notes: '',
      master_notes: '',
      era: '',
      length: '',
      general_freeform: '',
      audio_analysis: undefined,
    });
    setShowPrompt(false);
  };

  const handleAudioAnalysis = (analysis: AudioAnalysisResult) => {
    console.log('Audio analysis received in form:', analysis);
    
    // Store the analysis
    const audioAnalysisData = {
      detected_genres: analysis.genres,
      detected_mood: analysis.mood,
      detected_tempo: analysis.tempo,
      detected_energy: analysis.energy,
      detected_style: analysis.style,
      detected_instruments: analysis.instruments,
      detected_vibe: analysis.vibe,
    };

    console.log('Updating form data with analysis:', audioAnalysisData);

    setFormData(prev => ({
      ...prev,
      audio_analysis: audioAnalysisData,
      // Auto-populate relevant fields if they're empty
      genres_electronic: prev.genres_electronic.length === 0 ? analysis.genres.slice(0, 2) : prev.genres_electronic,
      mood: prev.mood.length === 0 ? analysis.mood.slice(0, 2) : prev.mood,
      tempo_bpm: prev.tempo_bpm === '' ? analysis.tempo : prev.tempo_bpm,
      energy: prev.energy === '' ? analysis.energy as any : prev.energy,
      sound_palette: prev.sound_palette === '' ? analysis.instruments : prev.sound_palette,
      general_freeform: prev.general_freeform === '' 
        ? `Audio analysis detected: ${analysis.style}. ${analysis.vibe}` 
        : prev.general_freeform,
    }));
    
    console.log('Form data updated successfully');
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleTitlePress} activeOpacity={0.8}>
              <Text style={styles.title}>AI Music Prompt Generator</Text>
            </TouchableOpacity>
            <ThemeToggle />
          </View>
          <Text style={styles.subtitle}>
            Create optimized prompts for AI music tools like Suno, Riffusion, and MusicGen
          </Text>
        </View>

        <UsageIndicator onUpgradePress={onUpgradePress} />

        <View style={styles.section}>
          <AudioAnalyzer onAnalysisComplete={handleAudioAnalysis} />
          
          {formData.audio_analysis && (
            <View style={styles.analysisResults}>
              <View style={styles.analysisHeader}>
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                <Text style={styles.analysisTitle}>Audio Analysis Applied</Text>
              </View>
              <Text style={styles.analysisText}>
                Detected: {formData.audio_analysis.detected_genres.join(', ')} • {formData.audio_analysis.detected_mood.join(', ')} • {formData.audio_analysis.detected_tempo}
              </Text>
              <TouchableOpacity 
                style={styles.clearAnalysisButton}
                onPress={() => setFormData(prev => ({ ...prev, audio_analysis: undefined }))}
              >
                <MaterialIcons name="clear" size={16} color={colors.textSecondary} />
                <Text style={styles.clearAnalysisText}>Clear Analysis</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎵 Genres</Text>
          <MultiSelectField
            label="Primary Genres"
            values={formData.genres_primary}
            onValuesChange={(values) => updateField('genres_primary', values)}
            options={PRIMARY_GENRES}
            placeholder="Select primary genres..."
          />
          <MultiSelectField
            label="Electronic Subgenres"
            values={formData.genres_electronic}
            onValuesChange={(values) => updateField('genres_electronic', values)}
            options={ELECTRONIC_GENRES}
            placeholder="Select electronic subgenres..."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 Theme & Mood</Text>
          <FormField
            label="Subject/Theme"
            value={formData.subject}
            onChangeText={(text) => updateField('subject', text)}
            placeholder="e.g., summer vibes, late night drive, celebration..."
          />
          <MultiSelectField
            label="Mood"
            values={formData.mood}
            onValuesChange={(values) => updateField('mood', values)}
            options={MOODS}
            placeholder="Select moods..."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎼 Technical Specs</Text>
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
            onValueChange={(value) => updateField('energy', value as any)}
            options={[
              { label: 'No preference', value: '' },
              ...ENERGY_LEVELS
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥁 Rhythm & Bass</Text>
          <FormField
            label="Beat Style"
            value={formData.beat}
            onChangeText={(text) => updateField('beat', text)}
            placeholder="e.g., four-on-the-floor, broken beat, rolling DnB..."
          />
          <FormField
            label="Bass Character"
            value={formData.bass}
            onChangeText={(text) => updateField('bass', text)}
            placeholder="e.g., sub-heavy, rubbery 303, warm analog..."
          />
          <PickerField
            label="Groove/Swing"
            value={formData.groove_swing}
            onValueChange={(value) => updateField('groove_swing', value as any)}
            options={[
              { label: 'No preference', value: '' },
              ...GROOVE_SWINGS
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎤 Vocals</Text>
          <PickerField
            label="Vocal Gender"
            value={formData.vocal_gender}
            onValueChange={(value) => updateField('vocal_gender', value as any)}
            options={VOCAL_GENDERS}
          />
          <PickerField
            label="Vocal Delivery"
            value={formData.vocal_delivery}
            onValueChange={(value) => updateField('vocal_delivery', value as any)}
            options={VOCAL_DELIVERIES}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎹 Sound & Production</Text>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 References & Style</Text>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎚️ Mix & Master</Text>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Additional Notes</Text>
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
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  section: {
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
  analysisResults: {
    backgroundColor: colors.success + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
  },
  analysisText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  clearAnalysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  clearAnalysisText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
