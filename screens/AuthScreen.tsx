import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import IconFallback from '../components/IconFallback';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { login, isLoading } = useBasic();

  const styles = createStyles(colors);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text 
          style={styles.title}
          accessibilityRole="header"
          accessibilityLevel={1}
        >
          🎵 AI Music Prompter
        </Text>
        <Text 
          style={styles.subtitle}
          accessibilityRole="text"
        >
          Create detailed prompts for AI music generation tools like Suno, Riffusion, and MusicGen
        </Text>
      </View>

      {/* Features preview */}
      <View 
        style={styles.featuresContainer}
        accessible={true}
        accessibilityLabel="App features preview"
        accessibilityRole="list"
      >
        <View 
          style={styles.feature}
          accessible={true}
          accessibilityRole="listitem"
          accessibilityLabel="Generate detailed music prompts with AI assistance"
        >
          <Text style={styles.featureIcon} accessible={false}>🎼</Text>
          <Text style={styles.featureText} accessible={false}>Generate detailed music prompts</Text>
        </View>

        <View 
          style={styles.feature}
          accessible={true}
          accessibilityRole="listitem"
          accessibilityLabel="Browse professional prompt templates"
        >
          <Text style={styles.featureIcon} accessible={false}>📚</Text>
          <Text style={styles.featureText} accessible={false}>Browse professional templates</Text>
        </View>

        <View 
          style={styles.feature}
          accessible={true}
          accessibilityRole="listitem"
          accessibilityLabel="Save and manage your prompt history"
        >
          <Text style={styles.featureIcon} accessible={false}>💾</Text>
          <Text style={styles.featureText} accessible={false}>Save & manage your history</Text>
        </View>

        <View 
          style={styles.feature}
          accessible={true}
          accessibilityRole="listitem"
          accessibilityLabel="Get random inspiration for creative blocks"
        >
          <Text style={styles.featureIcon} accessible={false}>🎲</Text>
          <Text style={styles.featureText} accessible={false}>Random inspiration generator</Text>
        </View>
      </View>

      {/* Sign in button */}
      <View style={styles.authContainer}>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={login}
          disabled={isLoading}
          accessible={true}
          accessibilityLabel={isLoading ? "Signing in, please wait" : "Sign in with Kiki Auth"}
          accessibilityHint="Opens authentication flow to create account or sign in"
          accessibilityRole="button"
          accessibilityState={{
            disabled: isLoading,
            busy: isLoading
          }}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? '🔄 Signing In...' : '🚀 Sign In with Kiki Auth'}
          </Text>
        </TouchableOpacity>

        <Text 
          style={styles.authNote}
          accessibilityRole="text"
        >
          Secure authentication • No passwords required • Sync across devices
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text 
          style={styles.footerText}
          accessibilityRole="text"
        >
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: Platform.OS === 'web' ? 500 : 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }),
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 600,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  iconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: -20,
    left: -20,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 50px rgba(255, 255, 255, 0.3)',
    }),
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    ...(Platform.OS === 'web' && {
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    }),
  },
  heroSubtitle: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    fontWeight: '300',
  },
  valueProps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  valuePropText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  authSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  noCreditCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.success + '30',
    gap: 8,
  },
  noCreditCardText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  loginButton: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }),
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    minWidth: 300,
    ...(Platform.OS === 'web' && {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }),
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  authNote: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: colors.surface,
  },
  featuresTitle: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 50,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 1000,
    alignSelf: 'center',
  },
  featureCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: Platform.OS === 'web' ? 240 : '100%',
    maxWidth: 280,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }),
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  featureCardText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  socialProofSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  socialProofTitle: {
    fontSize: Platform.OS === 'web' ? 28 : 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 100,
  },
  statNumber: {
    fontSize: Platform.OS === 'web' ? 36 : 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 500,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    ...(Platform.OS === 'web' && {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }),
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 12,
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
    padding: 20,
    backgroundColor: colors.surface,
  },
  feature: {
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  featureIcon: {
    fontSize: 24,
    color: colors.primary,
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  authContainer: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  signInButton: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }),
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  authNote: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: colors.background,
  },
  footerText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});
