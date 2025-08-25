import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking, ScrollView } from 'react-native';
import { useTheme } from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AdSenseComplianceProps {
  onClose: () => void;
}

export default function AdSenseCompliance({ onClose }: AdSenseComplianceProps) {
  const { colors } = useTheme();
  const [consentSettings, setConsentSettings] = useState({
    analytics: false,
    advertising: false,
    personalization: false,
  });
  const styles = createStyles(colors);

  useEffect(() => {
    loadConsentSettings();
  }, []);

  const loadConsentSettings = async () => {
    try {
      const analytics = await AsyncStorage.getItem('analyticsConsent');
      const advertising = await AsyncStorage.getItem('advertisingConsent');
      const personalization = await AsyncStorage.getItem('personalizationConsent');
      
      setConsentSettings({
        analytics: analytics === 'accepted',
        advertising: advertising === 'accepted',
        personalization: personalization === 'accepted',
      });
    } catch (error) {
      console.error('Error loading consent settings:', error);
    }
  };

  const updateConsent = async (type: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(`${type}Consent`, value ? 'accepted' : 'declined');
      setConsentSettings(prev => ({ ...prev, [type]: value }));
      
      // Reload ads if advertising consent changes
      if (type === 'advertising' && Platform.OS === 'web' && typeof window !== 'undefined') {
        if (value) {
          // Load AdSense
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        } else {
          // Remove AdSense ads (reload page to clear)
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error updating consent:', error);
    }
  };

  const openGoogleAdSettings = () => {
    Linking.openURL('https://adssettings.google.com/');
  };

  const openPrivacyPolicy = () => {
    if (Platform.OS === 'web') {
      window.open('/privacy-policy', '_blank');
    } else {
      Linking.openURL('https://aimusicpromptr.com/privacy-policy');
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🔒 Privacy & Ad Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>
            Control how AI Music Prompter uses cookies and displays advertisements. 
            Your privacy choices are important to us.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Analytics & Performance</Text>
            <Text style={styles.sectionDescription}>
              Help us improve the app by allowing anonymous usage analytics.
            </Text>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Analytics Cookies</Text>
              <TouchableOpacity
                style={[styles.toggle, consentSettings.analytics && styles.toggleActive]}
                onPress={() => updateConsent('analytics', !consentSettings.analytics)}
              >
                <Text style={styles.toggleText}>
                  {consentSettings.analytics ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📢 Advertising</Text>
            <Text style={styles.sectionDescription}>
              We use Google AdSense to show relevant ads that support our free service.
            </Text>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Advertising Cookies</Text>
              <TouchableOpacity
                style={[styles.toggle, consentSettings.advertising && styles.toggleActive]}
                onPress={() => updateConsent('advertising', !consentSettings.advertising)}
              >
                <Text style={styles.toggleText}>
                  {consentSettings.advertising ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Ad Personalization</Text>
            <Text style={styles.sectionDescription}>
              Allow personalized ads based on your interests and activity.
            </Text>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Personalized Ads</Text>
              <TouchableOpacity
                style={[styles.toggle, consentSettings.personalization && styles.toggleActive]}
                onPress={() => updateConsent('personalization', !consentSettings.personalization)}
              >
                <Text style={styles.toggleText}>
                  {consentSettings.personalization ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>ℹ️ About Our Ads</Text>
            <Text style={styles.infoText}>
              • We use Google AdSense to display advertisements
            </Text>
            <Text style={styles.infoText}>
              • Ads help keep AI Music Prompter free to use
            </Text>
            <Text style={styles.infoText}>
              • You can opt out of personalized ads anytime
            </Text>
            <Text style={styles.infoText}>
              • We never sell your personal information
            </Text>
          </View>

          <View style={styles.linkSection}>
            <TouchableOpacity style={styles.linkButton} onPress={openGoogleAdSettings}>
              <Text style={styles.linkText}>🔧 Google Ad Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={openPrivacyPolicy}>
              <Text style={styles.linkText}>📋 Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            Changes take effect immediately. Some changes may require refreshing the page.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    padding: 20,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    maxWidth: 500,
    width: '100%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  toggle: {
    backgroundColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  linkSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  linkButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});