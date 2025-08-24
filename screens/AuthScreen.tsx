import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/Logo';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { login, isLoading } = useBasic();

  const styles = createStyles(colors);

  const exampleData = [
    {
      input: "80s house vibe, summer rooftop party",
      output: "Minimal deep-house, warm Rhodes, silky female vocals, smooth basslines, 120 BPM – evokes sunset rooftop"
    },
    {
      input: "Dark experimental techno",
      output: "Industrial techno with distorted kicks, granular textures, cold metallic synths, and whispered male vocals, BPM 128 – dark, immersive, underground vibe"
    },
    {
      input: "Lo-fi beats for focus",
      output: "Dreamy lo-fi-hip-hop with vinyl crackle, dusty Rhodes keys, soft male humming, chill BPM 78 – perfect for study sessions."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Logo size={80} style={styles.heroLogo} />
          <Text style={styles.mainTitle}>
            Create Perfect AI Music{'\n'}Prompts in Seconds
          </Text>
          <Text style={styles.subtitle}>
            Turn your ideas into optimized, detailed prompts for{'\n'}Riffusion, Suno, Udio, MusicGen, and more – without guesswork.
          </Text>
          
          <TouchableOpacity 
            style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
            onPress={login}
            disabled={isLoading}
          >
            <Text style={styles.ctaButtonText}>
              {isLoading ? 'Connecting...' : 'Generate My Prompt →'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimerText}>
            This app is not affiliated with Riffusion, Suno, Udio, MusicGen, or other AI music platforms.
          </Text>
        </View>

        {/* Problem/Solution Section */}
        <View style={styles.problemSection}>
          <Text style={styles.problemText}>
            Making music with AI should feel limitless – but crafting the perfect{'\n'}prompt takes time, trial, and wasted tokens.
          </Text>
          
          <Text style={styles.solutionText}>
            <Text style={styles.solutionBold}>The AI Music Prompter fixes that.</Text> You set the vibe, choose{'\n'}genres, tweak the details – and it instantly delivers studio-ready{'\n'}prompts tailored for top AI music platforms.
          </Text>
        </View>

        {/* Demo Section */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>See it in Action</Text>
          
          <View style={styles.demoTable}>
            <View style={styles.demoHeader}>
              <Text style={styles.demoHeaderText}>Input Idea</Text>
              <Text style={styles.demoHeaderText}>Generated Prompt</Text>
            </View>
            
            {exampleData.map((example, index) => (
              <View key={index} style={styles.demoRow}>
                <View style={styles.demoInputCell}>
                  <Text style={styles.demoInputText}>{example.input}</Text>
                </View>
                <View style={styles.demoOutputCell}>
                  <Text style={styles.demoOutputText}>{example.output}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🎵</Text>
              </View>
              <Text style={styles.featureTitle}>Explore Every Genre</Text>
              <Text style={styles.featureDescription}>
                From tech-house to trap, ambient to afrobeat – all the deep dives are built in
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>✓</Text>
              </View>
              <Text style={styles.featureTitle}>Optimized for Token Efficiency</Text>
              <Text style={styles.featureDescription}>
                Get complete, structured prompts that save time and money.
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🎛️</Text>
              </View>
              <Text style={styles.featureTitle}>Control Every Detail</Text>
              <Text style={styles.featureDescription}>
                Choose vocal gender, delivery style, mood, tempo, bass, and more.
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🔧</Text>
              </View>
              <Text style={styles.featureTitle}>Multi-Platform Ready</Text>
              <Text style={styles.featureDescription}>
                Prompts are fine-tuned for Riffusion, Suno, Udio, MusicGen, and other major AI music engines
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>Built by Creators, for Creators</Text>
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
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  heroLogo: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 56,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    maxWidth: 600,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disclaimerText: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
    maxWidth: 400,
  },
  problemSection: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  problemText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'justify',
    lineHeight: 26,
    marginBottom: 24,
    maxWidth: 600,
  },
  solutionText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'justify',
    lineHeight: 26,
    maxWidth: 600,
  },
  solutionBold: {
    fontWeight: '700',
    color: colors.text,
  },
  demoSection: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 40,
  },
  demoTable: {
    width: '100%',
    maxWidth: 900,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  demoHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    padding: 16,
    textAlign: 'center',
  },
  demoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  demoInputCell: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    justifyContent: 'center',
  },
  demoOutputCell: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  demoInputText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  demoOutputText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 32,
    maxWidth: 900,
    alignSelf: 'center',
  },
  featureItem: {
    width: 280,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'justify',
  },
  footerSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
