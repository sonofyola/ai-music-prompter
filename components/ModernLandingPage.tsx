import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ModernLandingPageProps {
  onGetStarted: () => void;
}

export default function ModernLandingPage({ onGetStarted }: ModernLandingPageProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          {/* Logo */}
          <Image 
            source={require('../assets/images/FINAL_LOGO_AI_MUSIC_PROMPTR.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          {/* Main Headline */}
          <Text style={styles.mainTitle}>
            Create Perfect AI Music{'\n'}Prompts in Seconds
          </Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Turn your ideas into optimized, detailed prompts for{'\n'}
            Suno, Udio, MusicGen, and more – without guesswork.
          </Text>
          
          {/* CTA Button */}
          <TouchableOpacity style={styles.ctaButton} onPress={onGetStarted}>
            <Text style={styles.ctaButtonText}>Generate My Prompt →</Text>
          </TouchableOpacity>
          
          {/* No Credit Card Message */}
          <Text style={styles.noCreditCardText}>
            No credit card required to try
          </Text>
        </View>

        {/* Problem/Solution Section */}
        <View style={styles.problemSection}>
          <Text style={styles.problemText}>
            Making music with AI should feel limitless – but crafting the perfect{'\n'}
            prompt takes time, trial, and wasted tokens.
          </Text>
          
          <Text style={styles.solutionText}>
            <Text style={styles.boldText}>The AI Music Prompter fixes that.</Text> You set the vibe, choose{'\n'}
            genres, tweak the details – and it instantly delivers studio-ready{'\n'}
            prompts tailored for top AI music platforms.
          </Text>
        </View>

        {/* See it in Action Section */}
        <View style={styles.actionSection}>
          <Text style={styles.actionTitle}>Complete Control Over Every Detail</Text>
          
          {/* Parameters Grid */}
          <View style={styles.parametersSection}>
            <Text style={styles.parametersTitle}>🎛️ Available Parameters</Text>
            <View style={styles.parametersGrid}>
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🎵</Text>
                <Text style={styles.parameterName}>Genre</Text>
                <Text style={styles.parameterCount}>60+ options</Text>
                <Text style={styles.parameterExample}>House, Jazz, Hip Hop, Ambient...</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>😊</Text>
                <Text style={styles.parameterName}>Mood</Text>
                <Text style={styles.parameterCount}>17 moods</Text>
                <Text style={styles.parameterExample}>Happy, Dark, Energetic, Dreamy...</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>⚡</Text>
                <Text style={styles.parameterName}>Tempo</Text>
                <Text style={styles.parameterCount}>5 ranges</Text>
                <Text style={styles.parameterExample}>60-70 BPM to 140+ BPM</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>⏱️</Text>
                <Text style={styles.parameterName}>Length</Text>
                <Text style={styles.parameterCount}>6 options</Text>
                <Text style={styles.parameterExample}>30s loops to 6+ minutes</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🎤</Text>
                <Text style={styles.parameterName}>Vocals</Text>
                <Text style={styles.parameterCount}>13 styles</Text>
                <Text style={styles.parameterExample}>Male, Female, Choir, Rap...</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🎸</Text>
                <Text style={styles.parameterName}>Instruments</Text>
                <Text style={styles.parameterCount}>18+ choices</Text>
                <Text style={styles.parameterExample}>Piano, Guitar, Synth, Drums...</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🔊</Text>
                <Text style={styles.parameterName}>Bass Style</Text>
                <Text style={styles.parameterCount}>17 types</Text>
                <Text style={styles.parameterExample}>Deep, Punchy, 808, Wobble...</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🎨</Text>
                <Text style={styles.parameterName}>Tone</Text>
                <Text style={styles.parameterCount}>15 qualities</Text>
                <Text style={styles.parameterExample}>Warm, Bright, Vintage, Clean...</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🏗️</Text>
                <Text style={styles.parameterName}>Structure</Text>
                <Text style={styles.parameterCount}>7 formats</Text>
                <Text style={styles.parameterExample}>Verse-Chorus, AABA, Free Form...</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🎭</Text>
                <Text style={styles.parameterName}>Theme</Text>
                <Text style={styles.parameterCount}>17 concepts</Text>
                <Text style={styles.parameterExample}>Love, Adventure, Dreams, City Life...</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🔥</Text>
                <Text style={styles.parameterName}>Energy</Text>
                <Text style={styles.parameterCount}>5 levels</Text>
                <Text style={styles.parameterExample}>Very Low to Very High</Text>
              </View>
              
              <View style={styles.parameterCard}>
                <Text style={styles.parameterIcon}>🎚️</Text>
                <Text style={styles.parameterName}>Production</Text>
                <Text style={styles.parameterCount}>12 styles</Text>
                <Text style={styles.parameterExample}>Studio, Lo-Fi, Live, Polished...</Text>
              </View>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresListSection}>
            <Text style={styles.featuresListTitle}>✨ Powerful Features</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureItemTitle}>Smart Prompt Generation</Text>
                  <Text style={styles.featureItemDescription}>
                    Advanced algorithms create detailed, contextual prompts that maximize AI music quality
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureItemTitle}>Multi-Platform Optimization</Text>
                  <Text style={styles.featureItemDescription}>
                    Prompts optimized for Suno, Udio, MusicGen, and other leading AI music platforms
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureItemTitle}>Prompt History & Templates</Text>
                  <Text style={styles.featureItemDescription}>
                    Save your best prompts, create templates, and build your personal prompt library
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureItemTitle}>Random Inspiration Generator</Text>
                  <Text style={styles.featureItemDescription}>
                    Stuck for ideas? Generate random combinations to spark creativity and discover new sounds
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureItemTitle}>Professional Prompt Structure</Text>
                  <Text style={styles.featureItemDescription}>
                    Every prompt follows proven formatting that AI models understand and respond to effectively
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureItemTitle}>Token Efficiency</Text>
                  <Text style={styles.featureItemDescription}>
                    Concise yet comprehensive prompts that save you money while delivering better results
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureItemTitle}>Genre Expertise</Text>
                  <Text style={styles.featureItemDescription}>
                    Deep knowledge of 60+ genres from mainstream pop to experimental electronic subgenres
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureItemTitle}>Custom Prompt Addition</Text>
                  <Text style={styles.featureItemDescription}>
                    Add your own creative touches and specific requirements to any generated prompt
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🎯</Text>
              </View>
              <Text style={styles.featureTitle}>Explore Every Genre</Text>
              <Text style={styles.featureDescription}>
                From tech-house to trap, ambient to afrobeat – all the deep dives are built in
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>✓</Text>
              </View>
              <Text style={styles.featureTitle}>Optimized for Token Efficiency</Text>
              <Text style={styles.featureDescription}>
                Get complete, structured prompts that save time and money.
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🎛️</Text>
              </View>
              <Text style={styles.featureTitle}>Control Every Detail</Text>
              <Text style={styles.featureDescription}>
                Choose vocal gender, delivery style, mood, tempo, bass, and more.
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🎵</Text>
              </View>
              <Text style={styles.featureTitle}>Multi-Platform Ready</Text>
              <Text style={styles.featureDescription}>
                Prompts are fine <Text style={styles.italicText}>tuned for</Text> Udio, MusicGen, Riffusion, and other major AI music engines
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Built by Creators, for Creators</Text>
          
          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            This app is not affiliated with Suno AI, Udio, MusicGen, AIVA, Riffusion, or any other AI music platforms mentioned.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 56,
    marginBottom: 24,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    maxWidth: 600,
  },
  ctaButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  noCreditCardText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  problemSection: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  problemText: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
    maxWidth: 700,
  },
  solutionText: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 700,
  },
  boldText: {
    fontWeight: '700',
    color: '#ffffff',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 40,
  },
  examplesTable: {
    width: '100%',
    maxWidth: 800,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tableCell: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  headerCell: {
    backgroundColor: '#2a2a2a',
  },
  leftCell: {
    borderRightWidth: 1,
    borderRightColor: '#333333',
  },
  rightCell: {
    flex: 1.5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  cellText: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  featureCard: {
    width: 280,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureIconText: {
    fontSize: 18,
    color: '#ffffff',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
  },
  italicText: {
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  footerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 600,
    fontStyle: 'italic',
  },
  parametersSection: {
    marginBottom: 60,
    width: '100%',
    maxWidth: 1200,
  },
  parametersTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  parameterCard: {
    width: 180,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  parameterIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  parameterCount: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  parameterExample: {
    fontSize: 11,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 14,
  },
  featuresListSection: {
    marginBottom: 40,
    width: '100%',
    maxWidth: 800,
  },
  featuresListTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  featureCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  featureContent: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  featureItemDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
  },
});
