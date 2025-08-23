import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import { performCompleteAuthReset } from '../utils/authReset';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { login, signout, isLoading, user, isSignedIn } = useBasic();

  const styles = createStyles(colors);

  // Debug logging
  console.log('🔐 AuthScreen - Current state:', {
    isSignedIn,
    user: user ? {
      email: user.email,
      name: user.name,
      id: user.id
    } : null,
    isLoading
  });

  const handleSignOut = async () => {
    try {
      console.log('🔓 Signing out...');
      await signout();
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  };

  const handleCompleteReset = async () => {
    try {
      console.log('🧹 Performing complete reset...');
      await signout();
      await performCompleteAuthReset();
    } catch (error) {
      console.error('❌ Error during complete reset:', error);
    }
  };

  const handleNuclearReset = async () => {
    try {
      console.log('💥 NUCLEAR RESET - Clearing everything...');
      
      // Sign out first
      try {
        await signout();
      } catch (e) {
        console.log('Sign out failed, continuing...');
      }
      
      // Clear everything we can think of
      await performCompleteAuthReset();
      
      // Additional aggressive clearing
      if (typeof window !== 'undefined') {
        // Clear all storage
        try {
          window.localStorage.clear();
          window.sessionStorage.clear();
        } catch (e) {}
        
        // Clear service workers
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => registration.unregister());
          });
        }
        
        // Clear cache
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
      }
      
      // Force hard reload
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.replace(window.location.origin + '?t=' + Date.now());
        }
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error during nuclear reset:', error);
    }
  };

  const handleLogin = async () => {
    try {
      console.log('🔑 Starting login process...');
      await login();
    } catch (error) {
      console.error('❌ Error during login:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="auto-awesome" size={48} color={colors.primary} />
          <Text style={styles.title}>AI Music Prompter</Text>
          <Text style={styles.subtitle}>
            Generate perfect prompts for AI music tools like Suno, Riffusion, and MusicGen
          </Text>
        </View>

        {/* Current User Status */}
        {user && (
          <View style={styles.userStatus}>
            <Text style={styles.userStatusText}>
              Currently signed in as: {user.email || user.name || 'Unknown User'}
            </Text>
            <TouchableOpacity 
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <MaterialIcons name="logout" size={20} color={colors.primary} />
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Auth Section */}
        <View style={styles.authSection}>
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <MaterialIcons name="login" size={24} color={colors.background} />
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : user ? 'Continue to App' : 'Sign In to Get Started'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.authNote}>
            Sign in to save your prompts, access templates, and unlock premium features
          </Text>
        </View>

        {/* Debug Section - Always show for troubleshooting */}
        <View style={styles.debugSection}>
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={handleCompleteReset}
          >
            <Text style={styles.debugButtonText}>🔄 Complete Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: '#FF1744', marginTop: 8 }]}
            onPress={handleNuclearReset}
          >
            <Text style={styles.debugButtonText}>💥 Nuclear Reset</Text>
          </TouchableOpacity>
          
          {user && (
            <Text style={styles.debugInfo}>
              Current user: {user.email || user.name || 'Unknown'}
            </Text>
          )}
        </View>

        {/* Features Preview */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What you can do:</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <MaterialIcons name="music-note" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Generate detailed music prompts</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="shuffle" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Get random track ideas</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="history" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Save and manage prompt history</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="dashboard" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Use smart templates</Text>
            </View>
          </View>
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
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
  userStatus: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  userStatusText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  signOutButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '600',
  },
  authSection: {
    marginTop: 20,
    alignItems: 'center',
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
  loginButtonDisabled: {
    opacity: 0.6,
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
  debugSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  debugButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  debugButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  debugInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  featuresSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
  },
});
