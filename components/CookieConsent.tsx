import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useTheme } from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CookieConsent() {
  const { colors } = useTheme();
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const styles = createStyles(colors);

  useEffect(() => {
    checkCookieConsent();
  }, []);

  const checkCookieConsent = async () => {
    try {
      const consent = await AsyncStorage.getItem('cookieConsent');
      if (!consent && Platform.OS === 'web') {
        setShowConsent(true);
      }
    } catch (error) {
      console.error('Error checking cookie consent:', error);
    }
  };

  const handleAcceptAll = async () => {
    try {
      await AsyncStorage.setItem('cookieConsent', 'accepted');
      await AsyncStorage.setItem('analyticsConsent', 'accepted');
      await AsyncStorage.setItem('advertisingConsent', 'accepted');
      setShowConsent(false);
      
      // Initialize Google AdSense if on web
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  const handleAcceptNecessary = async () => {
    try {
      await AsyncStorage.setItem('cookieConsent', 'necessary');
      await AsyncStorage.setItem('analyticsConsent', 'declined');
      await AsyncStorage.setItem('advertisingConsent', 'declined');
      setShowConsent(false);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  const handleCustomize = async (analytics: boolean, advertising: boolean) => {
    try {
      await AsyncStorage.setItem('cookieConsent', 'customized');
      await AsyncStorage.setItem('analyticsConsent', analytics ? 'accepted' : 'declined');
      await AsyncStorage.setItem('advertisingConsent', advertising ? 'accepted' : 'declined');
      setShowConsent(false);
      
      // Initialize Google AdSense if advertising is accepted
      if (advertising && Platform.OS === 'web' && typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  const openPrivacyPolicy = () => {
    if (Platform.OS === 'web') {
      window.open('/privacy-policy', '_blank');
    } else {
      Linking.openURL('https://aimusicpromptr.com/privacy-policy');
    }
  };

  if (!showConsent) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>🍪 We Value Your Privacy</Text>
          <Text style={styles.text}>
            AI Music Prompter uses cookies and similar technologies to enhance your experience, 
            analyze usage patterns, and display personalized advertisements through Google AdSense.
          </Text>
          
          {showDetails && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Cookie Categories:</Text>
              <Text style={styles.detailsText}>
                • <Text style={styles.bold}>Necessary:</Text> Essential for app functionality
              </Text>
              <Text style={styles.detailsText}>
                • <Text style={styles.bold}>Analytics:</Text> Help us understand usage patterns
              </Text>
              <Text style={styles.detailsText}>
                • <Text style={styles.bold}>Advertising:</Text> Enable personalized ads via Google AdSense
              </Text>
              <Text style={styles.detailsText}>
                • <Text style={styles.bold}>Third-party:</Text> Google Analytics, Google AdSense
              </Text>
            </View>
          )}

          <TouchableOpacity onPress={openPrivacyPolicy} style={styles.linkButton}>
            <Text style={styles.linkText}>Read our Privacy Policy</Text>
          </TouchableOpacity>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptAll}>
              <Text style={styles.acceptButtonText}>Accept All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.necessaryButton} onPress={handleAcceptNecessary}>
              <Text style={styles.necessaryButtonText}>Necessary Only</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.detailsButton} 
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.detailsButtonText}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Text>
          </TouchableOpacity>
        </View>
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
    maxHeight: '80%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  linkButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  necessaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  necessaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  detailsButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
