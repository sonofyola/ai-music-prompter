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
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            <View style={styles.heroContent}>
              {/* Main Icon with Glow Effect */}
              <View style={styles.iconContainer}>
                <View style={styles.iconGlow} />
                <IconFallback name="auto-awesome" size={80} color="#FFFFFF" />
              </View>
              
              {/* Main Title */}
              <Text style={styles.heroTitle}>AI Music Prompter</Text>
              <Text style={styles.heroSubtitle}>
                Transform your musical ideas into perfect AI prompts
              </Text>
              
              {/* Value Proposition */}
              <View style={styles.valueProps}>
                <View style={styles.valueProp}>
                  <IconFallback name="flash-on" size={20} color="#FFD700" />
                  <Text style={styles.valuePropText}>Instant Generation</Text>
                </View>
                <View style={styles.valueProp}>
                  <IconFallback name="palette" size={20} color="#FFD700" />
                  <Text style={styles.valuePropText}>Creative Templates</Text>
                </View>
                <View style={styles.valueProp}>
                  <IconFallback name="trending-up" size={20} color="#FFD700" />
                  <Text style={styles.valuePropText}>Professional Results</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Auth Section */}
        <View style={styles.authSection}>
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <View style={styles.loginButtonGradient}>
              <IconFallback name="login" size={24} color="#FFFFFF" />
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Start Creating Music Prompts'}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.authNote}>
            🎵 Join thousands of creators • Save prompts • Access premium templates
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Powerful Features for Music Creators</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <IconFallback name="music-note" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Smart Prompt Generation</Text>
              <Text style={styles.featureCardText}>
                Generate detailed, professional prompts for Suno AI, Udio, and MusicGen
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <IconFallback name="shuffle" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Random Inspiration</Text>
              <Text style={styles.featureCardText}>
                Get instant creative ideas with our intelligent random track generator
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <IconFallback name="dashboard" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Professional Templates</Text>
              <Text style={styles.featureCardText}>
                Choose from curated templates for different genres and styles
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <IconFallback name="history" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Prompt History</Text>
              <Text style={styles.featureCardText}>
                Save, organize, and reuse your best prompts with cloud sync
              </Text>
            </View>
          </View>
        </View>

        {/* Social Proof */}
        <View style={styles.socialProofSection}>
          <Text style={styles.socialProofTitle}>Trusted by Music Creators Worldwide</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Prompts Generated</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Active Creators</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Music Genres</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Create Amazing Music?</Text>
          <Text style={styles.ctaSubtitle}>
            Join the AI music revolution and turn your ideas into professional prompts
          </Text>
          
          <TouchableOpacity 
            style={[styles.ctaButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.ctaButtonText}>
              {isLoading ? 'Signing In...' : 'Get Started Free'}
            </Text>
            <IconFallback name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});