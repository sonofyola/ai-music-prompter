import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import { performCompleteAuthReset, performQuickAuthReset, performNuclearReset } from '../utils/authReset';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { login, signout, isLoading, user, isSignedIn } = useBasic();
  const [isResetting, setIsResetting] = useState(false);

  const styles = createStyles(colors);

  // Check if we're stuck with sonofyola
  const isStuckWithSonofyola = user?.email?.includes('sonofyola') || 
                               user?.name?.includes('sonofyola');

  // Debug logging to see what user data we have
  console.log('🔍 AuthScreen Debug:', {
    user: user ? {
      email: user.email,
      name: user.name,
      id: user.id,
      // Log all user properties to see what's available
      allProps: Object.keys(user)
    } : null,
    isStuckWithSonofyola,
    isSignedIn,
    isLoading
  });

  const handleLogin = async () => {
    try {
      console.log('🔑 Starting login process...');
      console.log('🔍 Current user before login:', user);
      await login();
      console.log('🔍 User after login attempt:', user);
    } catch (error) {
      console.error('❌ Login error:', error);
      Alert.alert(
        'Login Error',
        'There was an issue signing in. Please try again or use the reset options below.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('🔓 Signing out...');
      await signout();
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  const handleSonofyolaReset = async () => {
    Alert.alert(
      'Force Different User',
      'This will clear any cached user data and let you sign in with a different account. This is specifically designed to fix the "sonofyola" login issue. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              console.log('🧹 Forcing different user login...');
              console.log('🔍 Current user data:', user);
              
              await signout();
              await performQuickAuthReset();
              
              // Give it a moment then try to clear more aggressively
              setTimeout(async () => {
                await performCompleteAuthReset();
              }, 1000);
              
            } catch (error) {
              console.error('❌ Force different user error:', error);
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleQuickReset = async () => {
    setIsResetting(true);
    try {
      console.log('🔄 Quick reset...');
      await performQuickAuthReset();
      await signout();
    } catch (error) {
      console.error('❌ Quick reset error:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleCompleteReset = async () => {
    Alert.alert(
      'Complete Reset',
      'This will clear all authentication data and reload the app. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await signout();
              await performCompleteAuthReset();
            } catch (error) {
              console.error('❌ Complete reset error:', error);
            }
          }
        }
      ]
    );
  };

  const handleNuclearReset = async () => {
    Alert.alert(
      '💥 Nuclear Reset',
      'This is the most aggressive reset option. It will clear EVERYTHING and force multiple reloads. Only use if nothing else works. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '💥 Nuclear Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await signout();
              await performNuclearReset();
            } catch (error) {
              console.error('❌ Nuclear reset error:', error);
            }
          }
        }
      ]
    );
  };

  const handleSuperNuclearReset = async () => {
    Alert.alert(
      '🚀 SUPER NUCLEAR RESET',
      'This is the ULTIMATE reset option. It will destroy ALL cached data multiple times and force several reloads. This is specifically designed to obliterate the sonofyola issue. Use only as last resort!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🚀 SUPER NUCLEAR',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await signout();
              const { performSuperNuclearReset } = await import('../utils/authReset');
              await performSuperNuclearReset();
            } catch (error) {
              console.error('❌ Super nuclear reset error:', error);
            }
          }
        }
      ]
    );
  };

  const handleProjectReset = async () => {
    Alert.alert(
      '🏗️ Project Reset',
      'This will force Basic Tech to start completely fresh by resetting the project-level session. This specifically targets server-side cached authentication data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🏗️ Project Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await signout();
              const { performProjectReset } = await import('../utils/authReset');
              await performProjectReset();
            } catch (error) {
              console.error('❌ Project reset error:', error);
            }
          }
        }
      ]
    );
  };

  const handleUltimateReset = async () => {
    Alert.alert(
      '🌟 ULTIMATE RESET',
      'This is the FINAL BOSS of resets. It will destroy everything 5 times, clear all possible caches, cookies, and storage, then create a completely new session context. This is specifically designed to break free from persistent server-side authentication issues.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🌟 ULTIMATE RESET',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await signout();
              const { performUltimateReset } = await import('../utils/authReset');
              await performUltimateReset();
            } catch (error) {
              console.error('❌ Ultimate reset error:', error);
            }
          }
        }
      ]
    );
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

        {/* Debug Section - Show current user data */}
        {user && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>🔍 Debug Info</Text>
            <Text style={styles.debugText}>Email: {user.email || 'none'}</Text>
            <Text style={styles.debugText}>Name: {user.name || 'none'}</Text>
            <Text style={styles.debugText}>ID: {user.id || 'none'}</Text>
            <Text style={styles.debugText}>Signed In: {isSignedIn ? 'Yes' : 'No'}</Text>
          </View>
        )}

        {/* Sonofyola Warning */}
        {isStuckWithSonofyola && (
          <View style={styles.warningSection}>
            <MaterialIcons name="warning" size={24} color="#FF3B30" />
            <Text style={styles.warningTitle}>Account Issue Detected</Text>
            <Text style={styles.warningText}>
              You&apos;re stuck with the &quot;sonofyola&quot; account. Use the reset button below to clear this and sign in with a different account.
            </Text>
            <TouchableOpacity 
              style={styles.warningButton}
              onPress={handleSonofyolaReset}
              disabled={isResetting}
            >
              <Text style={styles.warningButtonText}>
                🧹 Reset Sonofyola Account
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Current User Status */}
        {user && (
          <View style={styles.userStatus}>
            <Text style={styles.userStatusText}>
              Signed in as: {user.email || user.name || 'Unknown User'}
            </Text>
            <Text style={styles.userStatusSubtext}>
              Status: {isSignedIn ? '✅ Authenticated' : '⚠️ Authentication Issue'}
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
            style={[styles.loginButton, (isLoading || isResetting) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading || isResetting}
          >
            <MaterialIcons name="login" size={24} color={colors.background} />
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 
               isResetting ? 'Resetting...' :
               user ? 'Continue to App' : 'Sign In to Get Started'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.authNote}>
            Sign in to save your prompts, access templates, and unlock premium features
          </Text>
        </View>

        {/* Troubleshooting Section */}
        <View style={styles.troubleshootSection}>
          <Text style={styles.troubleshootTitle}>Having issues?</Text>
          
          {/* Always show this button for sonofyola issues */}
          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#FF3B30' }]}
            onPress={handleSonofyolaReset}
            disabled={isResetting}
          >
            <Text style={styles.troubleshootButtonText}>🧹 Force Different User</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.troubleshootButton}
            onPress={handleQuickReset}
            disabled={isResetting}
          >
            <Text style={styles.troubleshootButtonText}>🔄 Quick Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#FF3B30' }]}
            onPress={handleCompleteReset}
            disabled={isResetting}
          >
            <Text style={styles.troubleshootButtonText}>🧹 Complete Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#8E44AD' }]}
            onPress={handleNuclearReset}
            disabled={isResetting}
          >
            <Text style={styles.troubleshootButtonText}>💥 Nuclear Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#000000' }]}
            onPress={handleSuperNuclearReset}
            disabled={isResetting}
          >
            <Text style={styles.troubleshootButtonText}>🚀 SUPER NUCLEAR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#2E8B57' }]}
            onPress={handleProjectReset}
            disabled={isResetting}
          >
            <Text style={styles.troubleshootButtonText}>🏗️ Project Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#FFD700', borderWidth: 3, borderColor: '#FF4500' }]}
            onPress={handleUltimateReset}
            disabled={isResetting}
          >
            <Text style={[styles.troubleshootButtonText, { color: '#000000', fontWeight: 'bold' }]}>🌟 ULTIMATE RESET</Text>
          </TouchableOpacity>
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
  warningSection: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FF3B30',
    borderWidth: 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF3B30',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  warningButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  warningButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  debugSection: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
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
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  userStatusSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
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
  troubleshootSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  troubleshootButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 150,
  },
  troubleshootButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  featuresSection: {
    marginTop: 30,
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
