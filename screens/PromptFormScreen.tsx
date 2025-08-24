import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  AccessibilityInfo
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
import UsageIndicator from '../components/UsageIndicator';
import UpgradeModal from '../components/UpgradeModal';
import SubscriptionStatus from '../components/SubscriptionStatus';

// Contexts
import { useTheme } from '../contexts/ThemeContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';
import { useUsage } from '../contexts/UsageContext';

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
  const { 
    dailyUsage,
    canGenerate, 
    subscriptionStatus, 
    incrementGeneration, 
    upgradeToUnlimited 
  } = useUsage();
  
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

  // New modal state for upgrade
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const styles = createStyles(colors);

  const updateFormData = (field: keyof MusicPromptData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneratePrompt = async () => {
    // Check usage limits first
    if (!canGenerate) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = formatMusicPrompt(formData);
      setGeneratedPrompt(prompt);
      
      // Increment usage count after successful generation
      await incrementGeneration();
    } catch (error) {
      console.error('Error generating prompt:', error);
      Alert.alert('Error', 'Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpgradeSuccess = async () => {
    try {
      await upgradeToUnlimited();
      Alert.alert('Success!', 'You now have unlimited access to AI Music Prompter!');
    } catch (error) {
      console.error('Error upgrading:', error);
      Alert.alert('Error', 'Failed to activate upgrade. Please contact support.');
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
                {isAdmin ? (
                  <Text style={styles.adminBadge}> • Admin (Unlimited)</Text>
                ) : subscriptionStatus === 'unlimited' ? (
                  <Text style={styles.premiumBadge}> • Premium</Text>
                ) : (
                  <Text style={styles.usageHint}> • {3 - (dailyUsage || 0)} free left today</Text>
                )}
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

        <ScrollView 
          style={styles.container}
          accessible={false}
          accessibilityRole="main"
        >
          {/* Header with proper heading hierarchy */}
          <View style={styles.header}>
            <Text 
              style={styles.title}
              accessibilityRole="header"
              accessibilityLevel={1}
            >
              AI Music Prompter
            </Text>
            <Text 
              style={styles.subtitle}
              accessibilityRole="text"
            >
              Create detailed prompts for AI music generation
            </Text>
          </View>

          {/* Usage indicator with live region for screen readers */}
          <View 
            accessible={true}
            accessibilityLabel={`Daily usage: ${dailyUsage} of ${subscriptionStatus === 'unlimited' ? 'unlimited' : '3'} generations used`}
            accessibilityLiveRegion="polite"
          >
            <UsageIndicator />
          </View>

          {/* Form section with proper fieldset semantics */}
          <View 
            style={styles.formSection}
            accessibilityRole="group"
            accessibilityLabel="Music prompt form"
          >
            {/* Genre input */}
            <View style={styles.fieldContainer}>
              <Text 
                style={styles.fieldLabel}
                accessibilityRole="text"
              >
                Genre *
              </Text>
              <TextInput
                style={styles.input}
                value={genre}
                onChangeText={setGenre}
                placeholder="e.g., Pop, Rock, Jazz, Electronic"
                accessible={true}
                accessibilityLabel="Music genre"
                accessibilityHint="Enter the musical genre or style for your prompt. This field is required."
                accessibilityRequired={true}
              />
            </View>

            {/* Mood input */}
            <View style={styles.fieldContainer}>
              <Text 
                style={styles.fieldLabel}
                accessibilityRole="text"
              >
                Mood & Energy
              </Text>
              <TextInput
                style={styles.input}
                value={mood}
                onChangeText={setMood}
                placeholder="e.g., Upbeat, Melancholic, Energetic, Chill"
                accessible={true}
                accessibilityLabel="Music mood and energy"
                accessibilityHint="Describe the emotional tone and energy level of your music"
              />
            </View>

            {/* Instruments input */}
            <View style={styles.fieldContainer}>
              <Text 
                style={styles.fieldLabel}
                accessibilityRole="text"
              >
                Instruments
              </Text>
              <TextInput
                style={styles.input}
                value={instruments}
                onChangeText={setInstruments}
                placeholder="e.g., Guitar, Piano, Drums, Synthesizer"
                accessible={true}
                accessibilityLabel="Musical instruments"
                accessibilityHint="List the instruments you want featured in your music"
              />
            </View>

            {/* Additional details input */}
            <View style={styles.fieldContainer}>
              <Text 
                style={styles.fieldLabel}
                accessibilityRole="text"
              >
                Additional Details
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={additionalDetails}
                onChangeText={setAdditionalDetails}
                placeholder="Any specific requirements, tempo, key, or creative direction..."
                multiline={true}
                numberOfLines={3}
                accessible={true}
                accessibilityLabel="Additional music details"
                accessibilityHint="Enter any specific requirements, tempo, key signature, or creative direction for your music prompt"
              />
            </View>
          </View>

          {/* Action buttons with proper button semantics */}
          <View style={styles.buttonContainer}>
            {/* Generate button */}
            <TouchableOpacity 
              style={[
                styles.generateButton,
                !canGenerate && styles.generateButtonDisabled
              ]}
              onPress={handleGenerate}
              disabled={!canGenerate || isGenerating}
              accessible={true}
              accessibilityLabel={
                !canGenerate 
                  ? "Generate music prompt - daily limit reached" 
                  : isGenerating 
                    ? "Generating music prompt, please wait"
                    : "Generate music prompt"
              }
              accessibilityHint={
                !canGenerate 
                  ? "You have reached your daily limit. Upgrade for unlimited access."
                  : "Creates an AI music prompt based on your inputs"
              }
              accessibilityRole="button"
              accessibilityState={{
                disabled: !canGenerate || isGenerating,
                busy: isGenerating
              }}
            >
              <Text style={[
                styles.generateButtonText,
                !canGenerate && styles.generateButtonTextDisabled
              ]}>
                {isGenerating ? 'Generating...' : 'Generate Prompt'}
              </Text>
            </TouchableOpacity>

            {/* Secondary action buttons */}
            <View style={styles.secondaryButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowTemplates(true)}
                accessible={true}
                accessibilityLabel="Open prompt templates"
                accessibilityHint="Browse pre-made music prompt templates"
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>Templates</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowHistory(true)}
                accessible={true}
                accessibilityLabel="View prompt history"
                accessibilityHint="See your previously generated music prompts"
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>History</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowRandomTrack(true)}
                accessible={true}
                accessibilityLabel="Generate random track"
                accessibilityHint="Get a randomly generated music prompt for inspiration"
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>🎲 Random</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Generated prompt with live region */}
          {generatedPrompt && (
            <View 
              style={styles.resultContainer}
              accessible={true}
              accessibilityLabel="Generated music prompt"
              accessibilityLiveRegion="assertive"
            >
              <GeneratedPrompt prompt={generatedPrompt} />
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <Footer />

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

        {/* Upgrade Modal */}
        <UpgradeModal
          visible={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
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
  adminBadge: {
    color: colors.success,
    fontWeight: '700',
  },
  premiumBadge: {
    color: colors.primary,
    fontWeight: '600',
  },
  usageHint: {
    color: colors.primary,
    fontWeight: '600',
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  resultContainer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 24,
  },
});
