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
          <Text style={styles.actionTitle}>See it in Action</Text>
          
          <View style={styles.examplesTable}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.headerCell, styles.leftCell]}>
                <Text style={styles.headerText}>Input Idea</Text>
              </View>
              <View style={[styles.tableCell, styles.headerCell, styles.rightCell]}>
                <Text style={styles.headerText}>Generated Prompt</Text>
              </View>
            </View>
            
            {/* Table Rows */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.leftCell]}>
                <Text style={styles.cellText}>80s house vibe, summer rooftop party</Text>
              </View>
              <View style={[styles.tableCell, styles.rightCell]}>
                <Text style={styles.cellText}>
                  Minimal deep-house, warm Rhodes, silky female vocals, smooth basslines, 120 BPM – evokes sunset rooftop
                </Text>
              </View>
            </View>
            
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.leftCell]}>
                <Text style={styles.cellText}>Dark experimental techno</Text>
              </View>
              <View style={[styles.tableCell, styles.rightCell]}>
                <Text style={styles.cellText}>
                  Industrial techno with distorted kicks, granular textures, cold metallic synths, and whispered male vocals, BPM 128 – dark, immersive, underground vibe
                </Text>
              </View>
            </View>
            
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.leftCell]}>
                <Text style={styles.cellText}>Lo-fi beats for focus</Text>
              </View>
              <View style={[styles.tableCell, styles.rightCell]}>
                <Text style={styles.cellText}>
                  Dreamy lo-fi-hip-hop with vinyl crackle, dusty Rhodes keys, soft male humming, chill BPM 78 – perfect for study sessions.
                </Text>
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
});
