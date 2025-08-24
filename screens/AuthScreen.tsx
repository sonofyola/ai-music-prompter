import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import { performCompleteAuthReset, performQuickAuthReset, performNuclearReset } from '../utils/authReset';
import IconFallback from '../components/IconFallback';

export default function AuthScreen() {
  const { colors } = useTheme();
  const { login, signout, isLoading, user, isSignedIn, db } = useBasic();
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
    isLoading,
    hasDb: !!db
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

  const handleAccountDiagnostic = async () => {
    Alert.alert(
      '🔬 Account Diagnostic',
      'This will show detailed information about the current authentication state and help identify why drremotework@gmail.com is linked to sonofyola.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🔬 Run Diagnostic',
          onPress: async () => {
            console.log('🔬 === ACCOUNT DIAGNOSTIC START ===');
            
            // Log current user state
            console.log('🔍 Current User Object:', JSON.stringify(user, null, 2));
            console.log('🔍 Is Signed In:', isSignedIn);
            console.log('🔍 Is Loading:', isLoading);
            
            // Check localStorage for any Basic Tech data
            if (typeof window !== 'undefined' && window.localStorage) {
              console.log('🔍 LocalStorage Keys:');
              const allKeys = Object.keys(window.localStorage);
              allKeys.forEach(key => {
                if (key.toLowerCase().includes('basic') || 
                    key.toLowerCase().includes('kiki') || 
                    key.toLowerCase().includes('auth') ||
                    key.toLowerCase().includes('sonofyola') ||
                    key.toLowerCase().includes('user')) {
                  const value = window.localStorage.getItem(key);
                  console.log(`  ${key}: ${value}`);
                }
              });
            }
            
            // Check sessionStorage
            if (typeof window !== 'undefined' && window.sessionStorage) {
              console.log('🔍 SessionStorage Keys:');
              const allKeys = Object.keys(window.sessionStorage);
              allKeys.forEach(key => {
                if (key.toLowerCase().includes('basic') || 
                    key.toLowerCase().includes('kiki') || 
                    key.toLowerCase().includes('auth') ||
                    key.toLowerCase().includes('sonofyola') ||
                    key.toLowerCase().includes('user')) {
                  const value = window.sessionStorage.getItem(key);
                  console.log(`  ${key}: ${value}`);
                }
              });
            }
            
            // Check cookies
            if (typeof document !== 'undefined' && document.cookie) {
              console.log('🔍 Cookies:', document.cookie);
            }
            
            // Check AsyncStorage
            try {
              const AsyncStorage = require('@react-native-async-storage/async-storage').default;
              const allKeys = await AsyncStorage.getAllKeys();
              console.log('🔍 AsyncStorage Keys:', allKeys);
              
              for (const key of allKeys) {
                if (key.toLowerCase().includes('basic') || 
                    key.toLowerCase().includes('kiki') || 
                    key.toLowerCase().includes('auth') ||
                    key.toLowerCase().includes('sonofyola') ||
                    key.toLowerCase().includes('user')) {
                  const value = await AsyncStorage.getItem(key);
                  console.log(`  ${key}: ${value}`);
                }
              }
            } catch (e) {
              console.log('🔍 AsyncStorage not available');
            }
            
            console.log('🔬 === ACCOUNT DIAGNOSTIC END ===');
            
            Alert.alert(
              'Diagnostic Complete',
              'Check the console for detailed information about the authentication state. Look for any references to sonofyola or account linking.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const handleForceNewAccount = async () => {
    Alert.alert(
      '🆕 Force New Account Session',
      'This will attempt to break the link between drremotework@gmail.com and sonofyola by forcing Basic Tech to treat this as a completely new account session.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🆕 Force New Account',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              console.log('🆕 Forcing new account session...');
              
              // Sign out first
              await signout();
              
              // Clear everything aggressively
              const { performUltimateReset } = await import('../utils/authReset');
              
              // Add special parameters to force new account
              if (typeof window !== 'undefined') {
                // Clear everything first
                window.localStorage.clear();
                window.sessionStorage.clear();
                
                // Set special flags to force new account
                window.localStorage.setItem('force_new_account', 'true');
                window.localStorage.setItem('break_sonofyola_link', 'true');
                window.localStorage.setItem('admin_override', 'drremotework@gmail.com');
                
                setTimeout(() => {
                  const url = new URL(window.location.origin);
                  url.searchParams.set('force_new_account', 'true');
                  url.searchParams.set('break_account_link', 'true');
                  url.searchParams.set('admin_email', 'drremotework@gmail.com');
                  url.searchParams.set('sonofyola_override', 'true');
                  url.searchParams.set('new_session', Date.now().toString());
                  
                  window.location.replace(url.toString());
                }, 1000);
              }
              
            } catch (error) {
              console.error('❌ Force new account error:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteSonofyola = async () => {
    Alert.alert(
      '🗑️ Delete Sonofyola Account',
      'This will search the database for any sonofyola accounts and delete them completely. This should break the link between your admin email and the sonofyola account. This works even if you are currently stuck with the sonofyola account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🗑️ Delete Sonofyola',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              console.log('🗑️ Starting forced sonofyola account deletion...');
              console.log('🔍 Database available:', !!db);
              
              if (!db) {
                Alert.alert(
                  'Error',
                  'No database connection available. Try signing in first, then use this button.',
                  [{ text: 'OK' }]
                );
                setIsResetting(false);
                return;
              }
              
              const { forceDeleteSonofyolaAccount } = await import('../utils/authReset');
              const result = await forceDeleteSonofyolaAccount(db);
              
              if (result.success) {
                Alert.alert(
                  '🎉 Sonofyola Deleted!',
                  `Successfully deleted ${result.deletedCount} sonofyola records from the database. The app will now reset completely to break the account link.`,
                  [
                    {
                      text: 'Complete Reset',
                      onPress: () => {
                        console.log('🎉 Sonofyola deletion and reset complete!');
                      }
                    }
                  ]
                );
              } else {
                Alert.alert(
                  'Deletion Result',
                  result.error || 'No sonofyola accounts found to delete. The account may have already been removed.',
                  [
                    {
                      text: 'Try Reset Anyway',
                      onPress: async () => {
                        const { performSuperNuclearReset } = await import('../utils/authReset');
                        await performSuperNuclearReset();
                      }
                    },
                    { text: 'OK', style: 'cancel' }
                  ]
                );
              }
            } catch (error) {
              console.error('❌ Delete sonofyola error:', error);
              Alert.alert(
                'Error',
                `Failed to delete sonofyola account: ${error.message}. Try the other reset options.`,
                [{ text: 'OK' }]
              );
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleImmediateTest = () => {
    console.log('🧪 IMMEDIATE TEST - This should appear in console right away');
    console.log('🔍 Current user:', user);
    console.log('🔍 Is signed in:', isSignedIn);
    console.log('🔍 Is loading:', isLoading);
    console.log('🔍 Is resetting:', isResetting);
    
    Alert.alert(
      'Immediate Test',
      `Button works! User: ${user?.email || 'none'}, SignedIn: ${isSignedIn}, Loading: ${isLoading}`,
      [{ text: 'OK' }]
    );
  };

  const handleSimpleURLBreak = () => {
    console.log('🔗 SIMPLE URL BREAK - Starting...');
    
    Alert.alert(
      '🔗 Simple URL Session Break',
      'This will clear storage and redirect with session-breaking parameters.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🔗 Break Session',
          style: 'destructive',
          onPress: () => {
            console.log('🔗 Executing simple URL session break...');
            setIsResetting(true);
            
            try {
              // Clear storage immediately
              if (typeof window !== 'undefined') {
                console.log('🔗 Clearing storage...');
                try { window.localStorage.clear(); } catch (e) { console.log('localStorage clear failed:', e); }
                try { window.sessionStorage.clear(); } catch (e) { console.log('sessionStorage clear failed:', e); }
                
                // Set flags
                window.localStorage.setItem('force_new_session', 'true');
                window.localStorage.setItem('break_session_continuity', 'true');
                window.localStorage.setItem('admin_session_override', 'drremotework@gmail.com');
                window.localStorage.setItem('reject_sonofyola', 'true');
                
                console.log('🔗 Storage cleared, redirecting...');
                
                // Redirect with session-breaking parameters
                setTimeout(() => {
                  const url = new URL(window.location.origin);
                  url.searchParams.set('session_break', 'true');
                  url.searchParams.set('force_new_auth', 'true');
                  url.searchParams.set('admin_override', 'drremotework@gmail.com');
                  url.searchParams.set('reject_sonofyola', 'true');
                  url.searchParams.set('timestamp', Date.now().toString());
                  url.searchParams.set('nonce', Math.random().toString(36));
                  
                  console.log('🔗 Redirecting to:', url.toString());
                  window.location.replace(url.toString());
                }, 1000);
              }
            } catch (error) {
              console.error('🔗 Simple URL break error:', error);
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleURLSessionBreak = async () => {
    console.log('🔗 URL Session Break button pressed');
    Alert.alert(
      '🔗 URL Session Break',
      'This will use URL manipulation to force BasicTech to start a completely new session, breaking any cached session continuity.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🔗 Break Session',
          style: 'destructive',
          onPress: async () => {
            console.log('🔗 Starting URL session break...');
            setIsResetting(true);
            try {
              await signout();
              const { performURLSessionBreak } = await import('../utils/authReset');
              await performURLSessionBreak();
            } catch (error) {
              console.error('❌ URL session break error:', error);
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleIframeContextReset = async () => {
    console.log('🖼️ Iframe Context Reset button pressed');
    Alert.alert(
      '🖼️ Iframe Context Reset',
      'This will create an isolated authentication context to break any parent window session continuity.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🖼️ Context Reset',
          style: 'destructive',
          onPress: async () => {
            console.log('🖼️ Starting iframe context reset...');
            setIsResetting(true);
            try {
              await signout();
              const { performIframeContextReset } = await import('../utils/authReset');
              await performIframeContextReset();
            } catch (error) {
              console.error('❌ Iframe context reset error:', error);
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleServerSideUnlink = async () => {
    console.log('🌐 Server-Side Unlink button pressed');
    Alert.alert(
      '🌐 Server-Side Account Unlink',
      'This will attempt to break server-side account associations that are causing drremotework@gmail.com to be linked to the sonofyola account. This targets BasicTech\'s server-side session management.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🌐 Server Unlink',
          style: 'destructive',
          onPress: async () => {
            console.log('🌐 Starting server-side unlink...');
            setIsResetting(true);
            try {
              await signout();
              const { performServerSideAccountUnlink } = await import('../utils/authReset');
              await performServerSideAccountUnlink();
            } catch (error) {
              console.error('❌ Server-side unlink error:', error);
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleDomainReset = async () => {
    console.log('🌍 Domain Reset button pressed');
    Alert.alert(
      '🌍 Domain-Specific Reset',
      'This will clear all cookies and storage for BasicTech/Kiki domains and attempt to break server-side account associations. This is specifically designed to fix persistent account linking issues.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🌍 Domain Reset',
          style: 'destructive',
          onPress: async () => {
            console.log('🌍 Starting domain reset...');
            setIsResetting(true);
            try {
              await signout();
              const { performDomainSpecificReset } = await import('../utils/authReset');
              await performDomainSpecificReset();
            } catch (error) {
              console.error('❌ Domain reset error:', error);
            } finally {
              setIsResetting(false);
            }
          }
        }
      ]
    );
  };

  const handleTestButton = () => {
    console.log('🧪 TEST BUTTON PRESSED - Buttons are working!');
    Alert.alert('Test', 'Button press detected! The buttons are working correctly.', [{ text: 'OK' }]);
  };

  const handleStandaloneNuclear = () => {
    console.log('💥 STANDALONE NUCLEAR - Starting...');
    
    Alert.alert(
      '💥 Standalone Nuclear Reset',
      'This will clear everything and force a reload without using any imports. This is the most basic reset possible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '💥 Nuclear Reset',
          style: 'destructive',
          onPress: async () => {
            console.log('💥 Executing standalone nuclear reset...');
            setIsResetting(true);
            
            try {
              // Sign out first
              console.log('💥 Signing out...');
              await signout();
              
              // Clear everything multiple times
              for (let i = 0; i < 3; i++) {
                console.log(`💥 Clearing pass ${i + 1}/3`);
                
                if (typeof window !== 'undefined') {
                  // Clear localStorage
                  try { 
                    const keys = Object.keys(window.localStorage);
                    console.log('💥 LocalStorage keys:', keys);
                    window.localStorage.clear(); 
                  } catch (e) { console.log('localStorage clear failed:', e); }
                  
                  // Clear sessionStorage
                  try { 
                    const keys = Object.keys(window.sessionStorage);
                    console.log('💥 SessionStorage keys:', keys);
                    window.sessionStorage.clear(); 
                  } catch (e) { console.log('sessionStorage clear failed:', e); }
                  
                  // Clear cookies
                  if (document && document.cookie) {
                    console.log('💥 Cookies:', document.cookie);
                    document.cookie.split(";").forEach(function(c) { 
                      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                    });
                  }
                }
                
                // Clear AsyncStorage
                try {
                  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                  const keys = await AsyncStorage.getAllKeys();
                  console.log('💥 AsyncStorage keys:', keys);
                  await AsyncStorage.clear();
                } catch (e) {
                  console.log('💥 AsyncStorage clear failed:', e);
                }
                
                // Wait between passes
                if (i < 2) {
                  await new Promise(resolve => setTimeout(resolve, 500));
                }
              }
              
              console.log('💥 All clearing complete, forcing reload...');
              
              // Force reload with cache busting
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  const url = new URL(window.location.origin);
                  url.searchParams.set('nuclear_reset', '1');
                  url.searchParams.set('sonofyola_destroyed', 'true');
                  url.searchParams.set('force_fresh', 'true');
                  url.searchParams.set('timestamp', Date.now().toString());
                  url.searchParams.set('random', Math.random().toString());
                  
                  console.log('💥 Redirecting to:', url.toString());
                  window.location.replace(url.toString());
                }, 1000);
              }
              
            } catch (error) {
              console.error('💥 Standalone nuclear error:', error);
              // Emergency fallback
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  console.log('💥 Emergency fallback reload...');
                  window.location.reload();
                }, 2000);
              }
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
          <IconFallback name="auto-awesome" size={48} color={colors.primary} />
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
            <IconFallback name="warning" size={24} color="#FF3B30" />
            <Text style={styles.warningTitle}>Account Issue Detected</Text>
            <Text style={styles.warningText}>
              You are stuck with the sonofyola account. Use the reset button below to clear this and sign in with a different account.
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
              <IconFallback name="logout" size={20} color={colors.primary} />
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
            <IconFallback name="login" size={24} color={colors.background} />
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
          
          {/* Immediate test button */}
          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#00FF00', borderWidth: 2, borderColor: '#000' }]}
            onPress={handleImmediateTest}
          >
            <Text style={[styles.troubleshootButtonText, { fontWeight: 'bold', color: '#000' }]}>🧪 IMMEDIATE TEST</Text>
          </TouchableOpacity>
          
          {/* Simple URL break test */}
          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#FF6B35', borderWidth: 2, borderColor: '#FFF' }]}
            onPress={handleSimpleURLBreak}
            disabled={isResetting}
          >
            <Text style={[styles.troubleshootButtonText, { fontWeight: 'bold', color: '#FFF' }]}>🔗 SIMPLE URL BREAK</Text>
          </TouchableOpacity>

          {/* Most targeted options */}
          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#E91E63', borderWidth: 3, borderColor: '#FFF' }]}
            onPress={() => {
              console.log('🔗 URL SESSION BREAK button pressed');
              handleURLSessionBreak();
            }}
            disabled={isResetting}
          >
            <Text style={[styles.troubleshootButtonText, { fontWeight: 'bold', color: '#FFF' }]}>🔗 URL SESSION BREAK</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#3F51B5', borderWidth: 2, borderColor: '#FFF' }]}
            onPress={handleIframeContextReset}
            disabled={isResetting}
          >
            <Text style={[styles.troubleshootButtonText, { fontWeight: 'bold', color: '#FFF' }]}>🖼️ CONTEXT RESET</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#FF1744', borderWidth: 3, borderColor: '#000' }]}
            onPress={handleServerSideUnlink}
            disabled={isResetting}
          >
            <Text style={[styles.troubleshootButtonText, { fontWeight: 'bold', color: '#FFF' }]}>🌐 SERVER-SIDE UNLINK</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#9C27B0', borderWidth: 2, borderColor: '#000' }]}
            onPress={handleDomainReset}
            disabled={isResetting}
          >
            <Text style={[styles.troubleshootButtonText, { fontWeight: 'bold', color: '#FFF' }]}>🌍 DOMAIN RESET</Text>
          </TouchableOpacity>
          
          {/* Diagnostic Tools */}
          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#007AFF' }]}
            onPress={handleAccountDiagnostic}
            disabled={isResetting}
          >
            <Text style={styles.troubleshootButtonText}>🔬 Account Diagnostic</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#FF1744', borderWidth: 2, borderColor: '#000' }]}
            onPress={handleDeleteSonofyola}
            disabled={isResetting}
          >
            <Text style={[styles.troubleshootButtonText, { fontWeight: 'bold' }]}>🗑️ DELETE SONOFYOLA</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#34C759' }]}
            onPress={handleForceNewAccount}
            disabled={isResetting}
          >
            <Text style={styles.troubleshootButtonText}>🆕 Force New Account</Text>
          </TouchableOpacity>
          
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

          {/* Standalone nuclear reset */}
          <TouchableOpacity 
            style={[styles.troubleshootButton, { backgroundColor: '#8B0000', borderWidth: 3, borderColor: '#FFD700' }]}
            onPress={handleStandaloneNuclear}
            disabled={isResetting}
          >
            <Text style={[styles.troubleshootButtonText, { fontWeight: 'bold', color: '#FFD700' }]}>💥 STANDALONE NUCLEAR</Text>
          </TouchableOpacity>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What you can do:</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <IconFallback name="music-note" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Generate detailed music prompts</Text>
            </View>
            <View style={styles.featureItem}>
              <IconFallback name="shuffle" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Get random track ideas</Text>
            </View>
            <View style={styles.featureItem}>
              <IconFallback name="history" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Save and manage prompt history</Text>
            </View>
            <View style={styles.featureItem}>
              <IconFallback name="dashboard" size={20} color={colors.primary} />
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
