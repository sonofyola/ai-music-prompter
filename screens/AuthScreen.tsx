import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { user, login, isLoading, isSignedIn, db } = useBasic();
  const styles = createStyles(colors);

  useEffect(() => {
    if (isSignedIn && user) {
      // User is authenticated, create/update their profile
      initializeUserProfile();
    }
  }, [isSignedIn, user, db]);

  const initializeUserProfile = async () => {
    if (!db || !user) return;

    try {
      // Check if user profile exists
      const existingProfile = await db.from('user_profiles').get(user.id);
      
      if (!existingProfile) {
        // Create new user profile
        await db.from('user_profiles').add({
          id: user.id,
          email: user.email || '',
          subscription_status: 'free',
          usage_count: 0,
          last_reset_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          stripe_customer_id: '',
        });
        console.log('✅ Created new user profile for:', user.email);
      } else {
        console.log('✅ User profile exists for:', user.email);
      }
    } catch (error) {
      console.error('❌ Error initializing user profile:', error);
    }
  };

  const handleLogin = async () => {
    try {
      console.log('🔄 Starting login process...');
      await login();
      console.log('✅ Login successful');
    } catch (error) {
      console.error('❌ Login error:', error);
      Alert.alert('Login Error', 'Failed to sign in. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <ThemeToggle />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="auto-awesome" size={80} color={colors.primary} />
          <Text style={styles.title}>AI Music Prompter</Text>
          <Text style={styles.subtitle}>
            Generate professional AI music prompts for Suno, Riffusion, and MusicGen
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <MaterialIcons name="music-note" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Professional music prompts</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="history" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Save & manage prompt history</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="dashboard" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Smart prompt templates</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="cloud-sync" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Sync across all devices</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <MaterialIcons name="login" size={24} color={colors.background} />
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In to Get Started'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.authNote}>
          Secure authentication powered by Basic Tech
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 60,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
    marginLeft: 12,
  },
  authNote: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
