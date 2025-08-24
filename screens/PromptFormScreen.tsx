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
import { useBasic } from '@basictech/expo';

// Components
import ThemeToggle from '../components/ThemeToggle';
import IconFallback from '../components/IconFallback';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import FormField from '../components/FormField';
import MultiSelectField from '../components/MultiSelectField';
import PickerField from '../components/PickerField';
import GeneratedPrompt from '../components/GeneratedPrompt';
import TemplatesModal from '../components/TemplatesModal';
import RandomTrackModal from '../components/RandomTrackModal';
import PromptHistoryModal from '../components/PromptHistoryModal';
import Disclaimer from '../components/Disclaimer';
import Logo from '../components/Logo';

// Contexts
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';

// Utils
import { formatMusicPrompt } from '../utils/promptFormatter';
import { 
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
  WEIRDNESS_LEVELS
} from '../utils/musicData';

// Types
import { MusicPromptData } from '../types';

// Screens
import AdminScreen from './AdminScreen';

export default function PromptFormScreen() {
  const { colors } = useTheme();
  const { signout, user } = useBasic();
  const { 
    dailyUsage,
    canGenerate, 
    subscriptionStatus, 
    incrementGeneration
  } = useUsage();
  const { savePrompt } = usePromptHistory();
  
  // Admin state - hidden from regular users
  const [showAdminScreen, setShowAdminScreen] = useState(false);
  const isAdmin = user?.email === 'ibeme8@gmail.com' || user?.email === 'drremotework@gmail.com' || user?.email === 'sonofyola@gmail.com';
  
  // Modal states
  const [showTemplates, setShowTemplates] = useState(false);
  const [showRandomTrack, setShowRandomTrack] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Form state
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
    weirdness_level: '',
    general_freeform: ''
  });

  // Generated prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = createStyles(colors);

  const updateFormData = (field: keyof MusicPromptData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    // Check usage limits first
    if (!canGenerate) {
      Alert.alert('Daily Limit Reached', 'You have reached your daily limit. Please upgrade for unlimited access.');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate the sophisticated prompt using the formatter
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

  const handleClearForm = () => {
    Alert.alert(
      'Clear Form',
      'Are you sure you want to clear all fields?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // Reset form data to initial state
            const initialFormData: MusicPromptData = {
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
              weirdness_level: '',
              general_freeform: ''
            };
            
            setFormData(initialFormData);
            setGeneratedPrompt('');
            
            // Force a re-render by updating state
            setTimeout(() => {
              console.log('Form cleared successfully');
            }, 100);
          }
        }
      ]
    );
  };

  const handleRandomTrackSelect = (trackData: any) => {
    // Load the complete random track configuration
    setFormData(trackData);
    setShowRandomTrack(false);
  };

  const handleLoadPrompt = (savedFormData: MusicPromptData) => {
    setFormData(savedFormData);
    setShowHistory(false);
  };

  const handleSaveCurrentPrompt = async (name: string) => {
    if (generatedPrompt) {
      await savePrompt(name, formData, generatedPrompt);
      setShowHistory(false);
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
            <View style={styles.headerTitleContainer}>
              <Logo size={28} style={styles.headerLogo} />
              <Text style={styles.headerTitle}>AI Music Prompter</Text>
            </View>
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
            <TouchableOpacity onPress={handleSignOut} style={styles.headerButton}>
              <IconFallback name="logout" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemeToggle />
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Usage indicator */}
            <View style={styles.usageContainer}>
              <Text style={styles.usageText}>
                {subscriptionStatus === 'unlimited' 
                  ? 'Unlimited generations' 
                  : `${dailyUsage}/3 generations used today`
                }
              </Text>
              {subscriptionStatus === 'unlimited' && (
                <Text style={styles.premiumBadge}>Premium</Text>
              )}
            </View>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setShowTemplates(true)}
              >
                <Text style={styles.actionButtonText}>Templates</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setShowRandomTrack(true)}
              >
                <Text style={styles.actionButtonText}>Random</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setShowHistory(true)}
              >
                <Text style={styles.actionButtonText}>History</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleClearForm}
              >
                <Text style={[styles.actionButtonText, { color: colors.error }]}>Clear</Text>
              </TouchableOpacity>
            </View>

            {/* Form sections */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>🎯 Core Concept</Text>
              
              <FormField
                label="Subject/Theme"
                value={formData.subject}
                onChangeText={(value) => updateFormData('subject', value)}
                placeholder="e.g., summer nights, lost love, city lights, freedom..."
                multiline
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>🎵 Genre & Style</Text>
              
              <MultiSelectField
                label="Primary Genres"
                values={formData.genres_primary}
                options={PRIMARY_GENRES}
                onValuesChange={(values) => updateFormData('genres_primary', values)}
                placeholder="Select primary genres..."
              />
              
              <MultiSelectField
                label="Electronic Sub-genres"
                values={formData.genres_electronic}
                options={ELECTRONIC_GENRES}
                onValuesChange={(values) => updateFormData('genres_electronic', values)}
                placeholder="Select electronic sub-genres..."
              />
              
              <FormField
                label="Era/Time Period"
                value={formData.era}
                onChangeText={(value) => updateFormData('era', value)}
                placeholder="e.g., 1990s rave, 2000s French house, modern 2025..."
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>🎭 Mood & Energy</Text>
              
              <MultiSelectField
                label="Mood"
                values={formData.mood}
                options={MOODS}
                onValuesChange={(values) => updateFormData('mood', values)}
                placeholder="Select moods..."
              />
              
              <PickerField
                label="Energy Level"
                value={formData.energy}
                options={ENERGY_LEVELS}
                onValueChange={(value) => updateFormData('energy', value)}
              />
              
              <PickerField
                label="Weirdness Level"
                value={formData.weirdness_level}
                options={WEIRDNESS_LEVELS}
                onValueChange={(value) => updateFormData('weirdness_level', value)}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>🎼 Musical Structure</Text>
              
              <FormField
                label="Tempo (BPM)"
                value={formData.tempo_bpm}
                onChangeText={(value) => updateFormData('tempo_bpm', value)}
                placeholder="e.g., 128, 120-130, slow, fast..."
                keyboardType="numeric"
              />
              
              <PickerField
                label="Key/Scale"
                value={formData.key_scale}
                options={COMMON_KEYS.map(key => ({ label: key, value: key }))}
                onValueChange={(value) => updateFormData('key_scale', value)}
              />
              
              <PickerField
                label="Groove/Swing"
                value={formData.groove_swing}
                options={GROOVE_SWINGS}
                onValueChange={(value) => updateFormData('groove_swing', value)}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>🥁 Rhythm & Bass</Text>
              
              <MultiSelectField
                label="Beat Style"
                values={formData.beat}
                options={BEAT_STYLES}
                onValuesChange={(values) => updateFormData('beat', values)}
                placeholder="Select beat styles..."
              />
              
              <MultiSelectField
                label="Bass Characteristics"
                values={formData.bass}
                options={BASS_CHARACTERISTICS}
                onValuesChange={(values) => updateFormData('bass', values)}
                placeholder="Select bass characteristics..."
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>🎤 Vocals</Text>
              
              <PickerField
                label="Vocal Gender"
                value={formData.vocal_gender}
                options={VOCAL_GENDERS}
                onValueChange={(value) => updateFormData('vocal_gender', value)}
              />
              
              {formData.vocal_gender !== 'none' && (
                <PickerField
                  label="Vocal Delivery"
                  value={formData.vocal_delivery}
                  options={VOCAL_DELIVERIES}
                  onValueChange={(value) => updateFormData('vocal_delivery', value)}
                />
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>🎛️ Production & Technical</Text>
              
              <FormField
                label="Track Length"
                value={formData.length}
                onChangeText={(value) => updateFormData('length', value)}
                placeholder="e.g., 3:30, radio edit, club mix, loop..."
              />
              
              <FormField
                label="Master/Mix Notes"
                value={formData.master_notes}
                onChangeText={(value) => updateFormData('master_notes', value)}
                placeholder="e.g., warm analog, crisp digital, vintage compression..."
                multiline
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>✨ Creative Direction</Text>
              
              <FormField
                label="Additional Details"
                value={formData.general_freeform}
                onChangeText={(value) => updateFormData('general_freeform', value)}
                placeholder="Any specific creative direction, inspiration, or additional details..."
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Generate button */}
            <TouchableOpacity 
              style={[
                styles.generateButton,
                !canGenerate && styles.generateButtonDisabled
              ]}
              onPress={handleGenerate}
              disabled={!canGenerate || isGenerating}
            >
              <Text style={[
                styles.generateButtonText,
                !canGenerate && styles.generateButtonTextDisabled
              ]}>
                {isGenerating ? 'Generating...' : 'Generate Professional Prompt'}
              </Text>
            </TouchableOpacity>

            {/* Generated prompt */}
            {generatedPrompt && (
              <GeneratedPrompt prompt={generatedPrompt} />
            )}
          </View>
        </ScrollView>

        {/* Modals */}
        <TemplatesModal
          visible={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={(template) => {
            setFormData({ ...formData, ...template });
            setShowTemplates(false);
          }}
        />
        
        <RandomTrackModal
          visible={showRandomTrack}
          onClose={() => setShowRandomTrack(false)}
          onSelectIdea={handleRandomTrackSelect}
        />
        
        <PromptHistoryModal
          visible={showHistory}
          onClose={() => setShowHistory(false)}
          onLoadPrompt={handleLoadPrompt}
          onSaveCurrentPrompt={handleSaveCurrentPrompt}
          currentFormData={formData}
          currentGeneratedPrompt={generatedPrompt}
        />

        {/* Footer */}
        <Footer />

        {/* Disclaimer */}
        <Disclaimer compact style={{ marginBottom: 8 }} />

        {/* Cookie Consent */}
        <CookieConsent />
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    // Logo styling handled by Logo component
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
  usageContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
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
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  generateButtonTextDisabled: {
    color: colors.textTertiary,
  },
});
