import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface SEOLandingPageProps {
  onGetStarted: () => void;
}

export default function SEOLandingPage({ onGetStarted }: SEOLandingPageProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          AI Music Prompter
        </Text>
        <Text style={styles.heroSubtitle}>
          Create Professional Music Prompts for Suno AI, Udio, MusicGen & More
        </Text>
        <Text style={styles.heroDescription}>
          AI Music Prompter generates detailed, optimized prompts that produce amazing results with AI music tools. 
          Perfect for musicians, content creators, and music enthusiasts.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={onGetStarted}>
          <MaterialIcons name="music-note" size={24} color="#fff" />
          <Text style={styles.ctaButtonText}>Start Using AI Music Prompter</Text>
        </TouchableOpacity>
        <Text style={styles.freeText}>✨ 3 Free Generations Daily • No Credit Card Required</Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose AI Music Prompter?</Text>
        
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <MaterialIcons name="auto-awesome" size={32} color={colors.primary} />
            <Text style={styles.featureTitle}>AI-Powered Optimization</Text>
            <Text style={styles.featureDescription}>
              Advanced algorithms create prompts that work perfectly with Suno AI, Udio, and other platforms
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <MaterialIcons name="library-music" size={32} color={colors.primary} />
            <Text style={styles.featureTitle}>Professional Music Control</Text>
            <Text style={styles.featureDescription}>
              Specify genre, mood, instruments, tempo, key, and advanced parameters for precise results
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <MaterialIcons name="speed" size={32} color={colors.primary} />
            <Text style={styles.featureTitle}>Instant Generation</Text>
            <Text style={styles.featureDescription}>
              Create professional music prompts in seconds, not minutes. Perfect for rapid prototyping
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <MaterialIcons name="history" size={32} color={colors.primary} />
            <Text style={styles.featureTitle}>Prompt History</Text>
            <Text style={styles.featureDescription}>
              Save and revisit your best prompts. Build a library of successful music generation templates
            </Text>
          </View>
        </View>
      </View>

      {/* Supported Platforms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Works With Popular AI Music Tools</Text>
        <View style={styles.platformsGrid}>
          <View style={styles.platformCard}>
            <Text style={styles.platformName}>Suno AI</Text>
            <Text style={styles.platformDescription}>Perfect prompts for Suno's v3 and v4 models</Text>
          </View>
          <View style={styles.platformCard}>
            <Text style={styles.platformName}>Udio</Text>
            <Text style={styles.platformDescription}>Optimized for Udio's advanced generation</Text>
          </View>
          <View style={styles.platformCard}>
            <Text style={styles.platformName}>MusicGen</Text>
            <Text style={styles.platformDescription}>Compatible with Meta's MusicGen models</Text>
          </View>
          <View style={styles.platformCard}>
            <Text style={styles.platformName}>AIVA</Text>
            <Text style={styles.platformDescription}>Works with AIVA's composition engine</Text>
          </View>
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How AI Music Prompter Works</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choose Your Parameters</Text>
              <Text style={styles.stepDescription}>
                Select genre, mood, energy level, instruments, and other musical elements
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Generate Your Prompt</Text>
              <Text style={styles.stepDescription}>
                AI Music Prompter creates a detailed, optimized prompt tailored to your specifications
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Use With Any AI Music Tool</Text>
              <Text style={styles.stepDescription}>
                Copy your prompt and paste it into Suno AI, Udio, or your preferred platform
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfect for Musicians & Creators</Text>
        <View style={styles.benefitsContainer}>
          <View style={styles.benefit}>
            <MaterialIcons name="person" size={24} color={colors.success} />
            <Text style={styles.benefitText}>Solo Musicians & Songwriters</Text>
          </View>
          <View style={styles.benefit}>
            <MaterialIcons name="videocam" size={24} color={colors.success} />
            <Text style={styles.benefitText}>Content Creators & YouTubers</Text>
          </View>
          <View style={styles.benefit}>
            <MaterialIcons name="business" size={24} color={colors.success} />
            <Text style={styles.benefitText}>Music Producers & Studios</Text>
          </View>
          <View style={styles.benefit}>
            <MaterialIcons name="school" size={24} color={colors.success} />
            <Text style={styles.benefitText}>Music Students & Educators</Text>
          </View>
          <View style={styles.benefit}>
            <MaterialIcons name="campaign" size={24} color={colors.success} />
            <Text style={styles.benefitText}>Marketing & Advertising Teams</Text>
          </View>
          <View style={styles.benefit}>
            <MaterialIcons name="games" size={24} color={colors.success} />
            <Text style={styles.benefitText}>Game Developers & App Creators</Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Create Amazing Music?</Text>
        <Text style={styles.ctaDescription}>
          Join thousands of creators using AI Music Prompter to bring their musical ideas to life.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={onGetStarted}>
          <MaterialIcons name="play-arrow" size={24} color="#fff" />
          <Text style={styles.ctaButtonText}>Get Started Free</Text>
        </TouchableOpacity>
        <Text style={styles.freeText}>No signup required • Start creating immediately</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 AI Music Prompter. Create professional music prompts for AI music generation.
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 600,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  freeText: {
    fontSize: 14,
    color: colors.success,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    padding: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: 280,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  platformCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: 200,
    borderWidth: 1,
    borderColor: colors.border,
  },
  platformName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  platformDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  benefitsContainer: {
    gap: 16,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  ctaSection: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginTop: 32,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 500,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
