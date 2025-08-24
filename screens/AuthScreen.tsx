import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { login, isLoading } = useBasic();

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🎵</Text>
        </View>
        <Text style={styles.appTitle}>AI Music Prompter</Text>
        <Text style={styles.tagline}>
          Professional AI prompts for Suno, Udio, and other music generation platforms
        </Text>
      </View>

      {/* Value Proposition */}
      <View style={styles.valueSection}>
        <View style={styles.valueItem}>
          <View style={styles.valueIcon}>
            <Text style={styles.valueEmoji}>⚡</Text>
          </View>
          <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>Instant Professional Prompts</Text>
            <Text style={styles.valueDescription}>Generate detailed, effective prompts in seconds</Text>
          </View>
        </View>

        <View style={styles.valueItem}>
          <View style={styles.valueIcon}>
            <Text style={styles.valueEmoji}>🎯</Text>
          </View>
          <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>Precision Control</Text>
            <Text style={styles.valueDescription}>Fine-tune every aspect of your music generation</Text>
          </View>
        </View>

        <View style={styles.valueItem}>
          <View style={styles.valueIcon}>
            <Text style={styles.valueEmoji}>💾</Text>
          </View>
          <View style={styles.valueContent}>
            <Text style={styles.valueTitle}>Save & Organize</Text>
            <Text style={styles.valueDescription}>Keep your best prompts organized and accessible</Text>
          </View>
        </View>
      </View>

      {/* Auth Section */}
      <View style={styles.authSection}>
        <View style={styles.securityBadge}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>Secure Authentication</Text>
        </View>

        <TouchableOpacity 
          style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
          onPress={login}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? 'Connecting...' : 'Get Started'}
          </Text>
          <Text style={styles.signInButtonSubtext}>
            {isLoading ? 'Please wait' : 'Create your account'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.authNote}>
          Secure sign-in • Your data is encrypted • Cancel anytime
        </Text>
      </View>

      {/* Trust Indicators */}
      <View style={styles.trustSection}>
        <Text style={styles.trustText}>
          Trusted by music producers and AI enthusiasts worldwide
        </Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  logoEmoji: {
    fontSize: 36,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    fontWeight: '500',
  },
  valueSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  valueEmoji: {
    fontSize: 20,
  },
  valueContent: {
    flex: 1,
    paddingTop: 2,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  authSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '10',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.success + '20',
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 280,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  signInButtonSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  authNote: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  trustSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 250,
  },
});