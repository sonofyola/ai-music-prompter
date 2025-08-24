
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  Alert,
  KeyboardAvoidingView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';

// Components
import ThemeToggle from '../components/ThemeToggle';
import IconFallback from '../components/IconFallback';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';

// Contexts
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';

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
  
  // Admin state - hidden from regular users
  const [showAdminScreen, setShowAdminScreen] = useState(false);
  const isAdmin = user?.email === 'ibeme8@gmail.com' || user?.email === 'drremotework@gmail.com' || user?.email === 'sonofyola@gmail.com';
  
  // Simple form state for basic inputs
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [instruments, setInstruments] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Generated prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = createStyles(colors);

  const handleGenerate = async () => {
    // Check usage limits first
    if (!canGenerate) {
      Alert.alert('Daily Limit Reached', 'You have reached your daily limit. Please upgrade for unlimited access.');
      return;
    }

    setIsGenerating(true);
    try {
      // Create a simple prompt from basic inputs
      const simplePrompt = `Create a ${genre || 'music'} track with a ${mood || 'balanced'} mood${instruments ? ` featuring ${instruments}` : ''}${additionalDetails ? `. Additional details: ${additionalDetails}` : ''}.`;
      
      setGeneratedPrompt(simplePrompt);
      
      // Increment usage count after successful generation
      await incrementGeneration();
    } catch (error) {
      console.error('Error generating prompt:', error);
      Alert.alert('Error', 'Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
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

            {/* Form section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Create Your Music Prompt</Text>
              
              {/* Genre input */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Genre *</Text>
                <TextInput
                  style={styles.input}
                  value={genre}
                  onChangeText={setGenre}
                  placeholder="e.g., Pop, Rock, Jazz, Electronic"
                />
              </View>

              {/* Mood input */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Mood & Energy</Text>
                <TextInput
                  style={styles.input}
                  value={mood}
                  onChangeText={setMood}
                  placeholder="e.g., Upbeat, Melancholic, Energetic, Chill"
                />
              </View>

              {/* Instruments input */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Instruments</Text>
                <TextInput
                  style={styles.input}
                  value={instruments}
                  onChangeText={setInstruments}
                  placeholder="e.g., Guitar, Piano, Drums, Synthesizer"
                />
              </View>

              {/* Additional details input */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Additional Details</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={additionalDetails}
                  onChangeText={setAdditionalDetails}
                  placeholder="Any specific requirements, tempo, key, or creative direction..."
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
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
                {isGenerating ? 'Generating...' : 'Generate Prompt'}
              </Text>
            </TouchableOpacity>

            {/* Generated prompt */}
            {generatedPrompt && (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Generated Prompt</Text>
                </View>
                <Text style={styles.promptText}>{generatedPrompt}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <Footer />

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
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  generateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
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
  resultContainer: {
    backgroundColor: colors.surface,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  promptText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
