import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { login, isLoading } = useBasic();

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎵 AI Music Prompter</Text>
        <Text style={styles.subtitle}>
          Create detailed prompts for AI music generation tools like Suno, Riffusion, and MusicGen
        </Text>
      </View>

      {/* Features preview */}
      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🎼</Text>
          <Text style={styles.featureText}>Generate detailed music prompts</Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📚</Text>
          <Text style={styles.featureText}>Browse professional templates</Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>💾</Text>
          <Text style={styles.featureText}>Save & manage your history</Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🎲</Text>
          <Text style={styles.featureText}>Random inspiration generator</Text>
        </View>
      </View>

      {/* Sign in button */}
      <View style={styles.authContainer}>
        <TouchableOpacity 
          style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
          onPress={login}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? '🔄 Signing In...' : '🚀 Sign In with Kiki Auth'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.authNote}>
          Secure authentication • No passwords required • Sync across devices
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
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
  header: {
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.surface,
  },
  feature: {
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  authContainer: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  authNote: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.background,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});