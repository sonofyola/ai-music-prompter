import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CookieConsent() {
  const { colors } = useTheme();
  const [showConsent, setShowConsent] = useState(false);
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

  const handleAccept = async () => {
    try {
      await AsyncStorage.setItem('cookieConsent', 'accepted');
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

  const handleDecline = async () => {
    try {
      await AsyncStorage.setItem('cookieConsent', 'declined');
      setShowConsent(false);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  };

  if (!showConsent) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🍪 Cookie Notice</Text>
        <Text style={styles.text}>
          We use cookies and similar technologies to improve your experience, analyze usage, and show personalized ads. 
          By continuing to use AI Music Prompter, you consent to our use of cookies.
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>Accept All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    zIndex: 1000,
  },
  content: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
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
  declineButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  declineButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
