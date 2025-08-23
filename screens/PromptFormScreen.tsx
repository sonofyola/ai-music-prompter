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
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
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
import { useBasic } from '@basictech/expo';

import FormField from '../components/FormField';
import MultiSelectField from '../components/MultiSelectField';
import PickerField from '../components/PickerField';
import ThemeToggle from '../components/ThemeToggle';
import UsageIndicator from '../components/UsageIndicator';
import SubscriptionStatus from '../components/SubscriptionStatus';
import UpgradeModal from '../components/UpgradeModal';
import PromptHistoryModal from '../components/PromptHistoryModal';
import TemplatesModal from '../components/TemplatesModal';
import EmailCaptureModal from '../components/EmailCaptureModal';

export default function PromptFormScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { canGenerate, incrementGeneration, isEmailCaptured } = useUsage();
  const { savePrompt } = usePromptHistory();
  const { isAdmin, setAdminStatus, checkAdminAccess } = useMaintenance();
  const { user, signout } = useBasic();
  const styles = createStyles(colors);

  // Admin access state
  const [titlePressCount, setTitlePressCount] = useState(0);

  // Debug: Log admin status
  console.log('=== DEBUG INFO ===');
  console.log('Admin Status:', isAdmin);
  console.log('User Email:', user?.email);
  console.log('User Object:', user);

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const handleTitlePress = async () => {
    console.log('🔥 TITLE PRESSED! Count:', titlePressCount + 1);
    console.log('🔥 Current user email:', user?.email);
    console.log('🔥 Current admin status:', isAdmin);
    
    setTitlePressCount(prev => {
      const newCount = prev + 1;
      console.log('🔥 New count:', newCount);
      
      if (newCount === 7) {
        console.log('🔥🔥🔥 7 CLICKS REACHED! Checking admin access...');
        // Check if user has admin access
        checkAdminAccessHandler();
        return 0; // Reset counter
      }
      
      // Reset counter after 3 seconds of no presses
      setTimeout(() => {
        console.log('🔥 Resetting title press counter');
        setTitlePressCount(0);
      }, 3000);
      
      return newCount;
    });
  };

  const checkAdminAccessHandler = async () => {
    console.log('🚀 === ADMIN ACCESS CHECK ===');
    console.log('🚀 Checking admin access for user:', user?.email);
    console.log('🚀 User object:', user);
    
    try {
      const hasAccess = await checkAdminAccess();
      console.log('🚀 Admin access result:', hasAccess);
      console.log('🚀 Admin emails whitelist:', ['drremotework@gmail.com', 'admin@aimusicpromptr.com']);
      
      if (hasAccess) {
        console.log('✅ Admin access granted!');
        await setAdminStatus(true);
        Alert.alert(
          '🔓 Admin Access Granted',
          `Welcome, admin! You now have access to administrative features.\n\nEmail: ${user?.email}`,
          [
            { text: 'Continue', onPress: () => {} },
            { 
              text: 'Open Admin Panel', 
              onPress: () => {
                console.log('🚀 Navigating to Admin panel...');
                console.log('🚀 Navigation object:', navigation);
                if (navigation?.navigate) {
                  navigation.navigate('Admin');
                } else {
                  console.error('❌ Navigation not available!');
                  Alert.alert('Error', 'Navigation not available. Please try refreshing the app.');
                }
              }
            }
          ]
        );
      } else {
        console.log('❌ Admin access denied');
        Alert.alert(
          '🚫 Access Denied',
          `You are not authorized for admin access.\n\nYour email: ${user?.email}\nOnly whitelisted email addresses can access admin features.\n\nWhitelisted emails:\n• drremotework@gmail.com\n• admin@aimusicpromptr.com`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Admin access error:', error);
      Alert.alert('Error', `Failed to check admin access: ${error.message}`);
    }
  };

  const handleUserLogout = () => {
    console.log('🚪🚪🚪 HANDLE USER LOGOUT CALLED!');
    console.log('🚪 User object:', user);
    console.log('🚪 User email:', user?.email);
    console.log('🚪 Signout function:', typeof signout);
    
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚪 Starting signout process...');
              console.log('🚪 Signing out user:', user?.email);
              await signout();
              console.log('✅ User signed out successfully');
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleAdminLogout = () => {
    Alert.alert(
      'Logout Admin',
      'Are you sure you want to logout from admin access?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await setAdminStatus(false);
              Alert.alert('Logged Out', 'Admin access has been revoked.');
            } catch (error) {
              console.error('Admin logout error:', error);
              Alert.alert('Error', 'Failed to logout from admin mode.');
            }
          }
        }
      ]
    );
  };

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

  const generatePrompt = async () => {
    if (!formData.subject.trim() && formData.genres_primary.length === 0 && formData.genres_electronic.length === 0) {
      Alert.alert(
        'Missing Information',
        'Please add at least a subject/theme or select some genres to generate a prompt.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if user can generate
    if (!canGenerate) {
      setShowUpgradeModal(true);
      return;
    }

    // Check if email is captured for free users
    if (!isEmailCaptured) {
      setShowEmailCapture(true);
      return;
    }

    const prompt = formatMusicPrompt(formData);
    setGeneratedPrompt(prompt);
    setShowPrompt(true);
    
    // Increment usage count
    await incrementGeneration();
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(generatedPrompt);
      Alert.alert(
        'Prompt Copied!',
        'The generated prompt has been copied to your clipboard.',
        [{ text: 'OK' }]
      );
    } catch {
      Alert.alert('Error', 'Failed to copy prompt to clipboard.');
    }
  };

  const saveCurrentPrompt = () => {
    Alert.prompt(
      'Save Prompt',
      'Enter a name for this prompt:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (name) => {
            if (name?.trim()) {
              await savePrompt(name.trim(), formData, generatedPrompt);
              Alert.alert('Success', 'Prompt saved to history!');
            }
          }
        }
      ],
      'plain-text',
      formData.subject || 'My Prompt'
    );
  };

  const loadTemplate = (templateData: Partial<MusicPromptData>) => {
    setFormData(prev => ({
      ...prev,
      ...templateData
    }));
    setShowTemplatesModal(false);
  };

  const loadFromHistory = (historyData: MusicPromptData) => {
    setFormData(historyData);
    setShowHistoryModal(false);
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
              
              <TouchableOpacity style={styles.saveButton} onPress={saveCurrentPrompt}>
                <MaterialIcons name="bookmark" size={20} color={colors.primary} />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.newPromptButton} onPress={generatePrompt}>
              <MaterialIcons name="refresh" size={20} color={colors.primary} />
              <Text style={styles.newPromptButtonText}>Generate New Prompt</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* EMERGENCY TEST BUTTON - Should appear at very top */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 100,
          right: 20,
          backgroundColor: 'red',
          padding: 20,
          zIndex: 99999,
          elevation: 20,
        }}
        onPress={() => {
          console.log('🚨 EMERGENCY TEST BUTTON PRESSED!');
          Alert.alert('EMERGENCY TEST', 'This button works! Touch events are functional.');
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>EMERGENCY TEST</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <TouchableOpacity 
              onPress={handleTitlePress}
              style={[styles.titleButton, titlePressCount > 0 && styles.titleButtonPressed]}
              activeOpacity={0.7}
            >
              <Text style={styles.title}>🎵 AI Music Prompter</Text>
              {titlePressCount > 0 && (
                <Text style={styles.clickCounter}>({titlePressCount}/7)</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle />
            
            {/* Prompt History Button */}
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => {
                console.log('🔥 History button pressed');
                setShowHistoryModal(true);
              }}
            >
              <MaterialIcons name="history" size={20} color={colors.text} />
            </TouchableOpacity>

            {/* Templates Button */}
            <TouchableOpacity
              style={styles.templatesButton}
              onPress={() => {
                console.log('🔥 Templates button pressed');
                setShowTemplatesModal(true);
              }}
            >
              <MaterialIcons name="library-books" size={20} color={colors.text} />
            </TouchableOpacity>

            {/* TEST: Simple button to verify touch events work in this area */}
            <TouchableOpacity
              style={styles.userLogoutButtonTest}
              onPress={() => {
                console.log('🔥🔥🔥 TEST BUTTON PRESSED!');
                Alert.alert('SUCCESS!', 'Touch events work in this header area!');
              }}
              activeOpacity={0.3}
            >
              <Text style={styles.testButtonText}>TEST</Text>
            </TouchableOpacity>

            {/* Admin logout - only when admin is active */}
            {isAdmin && (
              <TouchableOpacity
                style={styles.adminLogoutButton}
                onPress={() => {
                  console.log('🔥🔥🔥 RED ADMIN LOGOUT BUTTON PRESSED!');
                  console.log('🔥 Admin status:', isAdmin);
                  console.log('🔥 User:', user?.email);
                  
                  // Show immediate alert to test if button works at all
                  Alert.alert(
                    '🔴 RED BUTTON PRESSED!',
                    'The red admin logout button is working! Do you want to logout from admin mode?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Logout Admin', 
                        style: 'destructive',
                        onPress: handleAdminLogout
                      }
                    ]
                  );
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <MaterialIcons name="logout" size={24} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* SUPER OBVIOUS ADMIN STATUS BAR */}
        {isAdmin && (
          <TouchableOpacity 
            style={styles.adminIndicatorLarge}
            onPress={() => {
              console.log('🚀 Admin bar tapped - navigating to admin panel');
              if (navigation?.navigate) {
                navigation.navigate('Admin');
              } else {
                Alert.alert('Navigation Error', 'Unable to navigate to admin panel. Please try refreshing the app.');
              }
            }}
          >
            <MaterialIcons name="admin-panel-settings" size={24} color="#fff" />
            <Text style={styles.adminIndicatorTextLarge}>🔓 ADMIN MODE ACTIVE - TAP TO OPEN ADMIN PANEL</Text>
            <TouchableOpacity 
              style={styles.logoutButtonInBar}
              onPress={handleAdminLogout}
            >
              <MaterialIcons name="logout" size={16} color="#fff" />
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        <UsageIndicator onUpgradePress={() => setShowUpgradeModal(true)} />

        <View style={styles.subscriptionContainer}>
          <SubscriptionStatus 
            onManagePress={() => navigation?.navigate('Subscription')}
            compact={true}
          />
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
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

        {/* Modals */}
        <UpgradeModal 
          visible={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeSuccess={() => {
            setShowUpgradeModal(false);
            Alert.alert('Success!', 'You now have unlimited access to AI Music Prompter!');
          }}
        />
        
        {showEmailCapture && (
          <EmailCaptureModal 
            visible={showEmailCapture} 
            onClose={() => setShowEmailCapture(false)}
            onEmailSubmitted={(email) => {
              setShowEmailCapture(false);
              generatePrompt();
            }}
          />
        )}
        
        <PromptHistoryModal 
          visible={showHistoryModal} 
          onClose={() => setShowHistoryModal(false)}
          onLoadPrompt={loadFromHistory}
          onSaveCurrentPrompt={saveCurrentPrompt}
          currentFormData={formData}
          currentGeneratedPrompt={generatedPrompt}
        />
        
        <TemplatesModal 
          visible={showTemplatesModal} 
          onClose={() => setShowTemplatesModal(false)}
          onSelectTemplate={loadTemplate}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 64,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 8,
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
  subscriptionContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
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
    marginBottom: 12,
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
  saveButton: {
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  newPromptButton: {
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
  adminIndicatorLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  adminIndicatorTextLarge: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  logoutButtonInBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  logoutButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    marginRight: 8,
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  titleButton: {
    alignItems: 'flex-start',
    padding: 6,
    borderRadius: 8,
    flex: 1,
    minWidth: 0,
  },
  titleButtonPressed: {
    backgroundColor: colors.primary + '20',
  },
  clickCounter: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  userMenuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminLogoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminPanelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    minWidth: 70,
    minHeight: 40,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  historyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templatesButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLogoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLogoutButtonTest: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
