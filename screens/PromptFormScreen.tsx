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
import { useBasic } from '@basictech/expo';

// Components
import FormField from '../components/FormField';
import MultiSelectField from '../components/MultiSelectField';
import PickerField from '../components/PickerField';
import ThemeToggle from '../components/ThemeToggle';
import GeneratedPrompt from '../components/GeneratedPrompt';
import TemplatesModal from '../components/TemplatesModal';
import RandomTrackModal from '../components/RandomTrackModal';
import PromptHistoryModal from '../components/PromptHistoryModal';
import IconFallback from '../components/IconFallback';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';

// Contexts
import { useTheme } from '../contexts/ThemeContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';

// Screens
import AdminScreen from './AdminScreen';

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
  COMMON_KEYS, 
  BEAT_STYLES, 
  BASS_CHARACTERISTICS, 
  WEIRDNESS_LEVELS, 
  ERA_SUGGESTIONS 
} from '../utils/promptFormatter';
import { generateRandomTrackIdea } from '../utils/randomTrackGenerator';

export default function PromptFormScreen() {
  const { colors } = useTheme();
  const { savePrompt } = usePromptHistory();
  const { signout, user, db } = useBasic();
  
  // Admin state - hidden from regular users
  const [showAdminScreen, setShowAdminScreen] = useState(false);
  const isAdmin = user?.email === 'ibeme8@gmail.com' || user?.email === 'drremotework@gmail.com' || user?.email === 'sonofyola@gmail.com';
  
  // Track user in database
  useEffect(() => {
    const trackUser = async () => {
      if (!user || !db) return;

      try {
        // Check if user already exists
        const existingUsers = await db.from('users').getAll();
        const existingUser = existingUsers?.find(u => u.email === user.email);

        if (!existingUser) {
          // Create new user record
          await db.from('users').add({
            email: user.email,
            name: user.name || '',
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            is_admin: isAdmin
          });
        } else {
          // Update last login
          await db.from('users').update(existingUser.id, {
            last_login: new Date().toISOString(),
            is_admin: isAdmin // Update admin status if needed
          });
        }
      } catch (error) {
        console.error('Error tracking user:', error);
      }
    };

    trackUser();
  }, [user, db, isAdmin]);

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

  // Modal states
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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

  const handleRandomSubject = () => {
    const randomIdea = generateRandomTrackIdea();
    setFormData(prev => ({ ...prev, subject: randomIdea.subject }));
  };

  const handleLoadFromHistory = (formData: MusicPromptData) => {
    setFormData(formData);
    setShowHistoryModal(false);
  };

  const handleSaveCurrentPrompt = async (name: string) => {
    if (!generatedPrompt) {
      Alert.alert('No Prompt', 'Please generate a prompt first before saving.');
      return;
    }

    try {
      await savePrompt(name, formData, generatedPrompt);
      Alert.alert('Success', 'Prompt saved successfully!');
    } catch (error) {
      console.error('Error saving prompt:', error);
      Alert.alert('Error', 'Failed to save prompt. Please try again.');
    }
  };

  // Hidden admin access (triple tap on logo)
  const [adminTapCount, setAdminTapCount] = useState(0);
  
  const handleLogoPress = () => {
    if (!isAdmin) return;
    
    setAdminTapCount(prev => prev + 1);
    
    if (adminTapCount >= 2) {
      setShowAdminScreen(true);
      setAdminTapCount(0);
    }
    
    // Reset tap count after 2 seconds
    setTimeout(() => setAdminTapCount(0), 2000);
  };

  const handleSignOut = async () => {
    try {
      await signout();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  if (showAdminScreen) {
    return <AdminScreen onBackToApp={() => setShowAdminScreen(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress} style={styles.headerLeft}>
            <Text style={styles.headerTitle}>🎵 AI Music Prompter</Text>
            {user && (
              <Text style={styles.userIndicator}>
                Welcome, {user.name || user.email?.split('@')[0] || 'User'}!
              </Text>
            )}
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setShowHistoryModal(true)} style={styles.headerButton}>
              <IconFallback name="history" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={styles.headerButton}>
              <IconFallback name="logout" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemeToggle />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleRandomTrack}>
                <IconFallback name="shuffle" size={20} color={colors.background} />
                <Text style={styles.quickActionText}>Random Track</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => setShowTemplatesModal(true)}>
                <IconFallback name="dashboard" size={20} color={colors.background} />
                <Text style={styles.quickActionText}>Templates</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => setShowRandomModal(true)}>
                <IconFallback name="casino" size={20} color={colors.background} />
                <Text style={styles.quickActionText}>Ideas</Text>
              </TouchableOpacity>
            </View>

            {/* Subject/Theme */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Track Theme</Text>
              <View style={styles.fieldWithDice}>
                <View style={styles.fieldContainer}>
                  <FormField
                    label="Subject/Theme"
                    value={formData.subject}
                    onChangeText={(value) => updateFormData('subject', value)}
                    placeholder="e.g., Lost love, Urban nightlife, Digital dreams"
                  />
                </View>
                <TouchableOpacity style={styles.diceButton} onPress={handleRandomSubject}>
                  <IconFallback name="casino" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
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
              <IconFallback 
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
          
          {/* Footer */}
          <Footer />
        </ScrollView>

        {/* Cookie Consent */}
        <CookieConsent />

        {/* Modals */}
        <TemplatesModal
          visible={showTemplatesModal}
          onClose={() => setShowTemplatesModal(false)}
          onSelectTemplate={(template) => {
            setFormData(prev => ({ ...prev, ...template }));
            setShowTemplatesModal(false);
          }}
        />

        <RandomTrackModal
          visible={showRandomModal}
          onClose={() => setShowRandomModal(false)}
          onSelectIdea={(subject) => {
            setFormData(prev => ({ ...prev, subject }));
            setShowRandomModal(false);
          }}
        />

        <PromptHistoryModal
          visible={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          onLoadPrompt={handleLoadFromHistory}
          onSaveCurrentPrompt={handleSaveCurrentPrompt}
          currentFormData={formData}
          currentGeneratedPrompt={generatedPrompt}
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
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  userIndicator: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
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
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  quickActionText: {
    color: colors.background,
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
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
  fieldWithDice: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  fieldContainer: {
    flex: 1,
  },
  diceButton: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
    marginBottom: 12,
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