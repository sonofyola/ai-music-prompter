import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import PromptFormScreen from './screens/PromptFormScreen';
import AdminScreen from './screens/AdminScreen';
import HistoryScreen from './screens/HistoryScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import BlogScreen from './screens/BlogScreen';
import ModernLandingPage from './components/ModernLandingPage';
import CookieConsent from './components/CookieConsent';
import AuthDebug from './components/AuthDebug';
import { ThemeProvider } from './contexts/ThemeContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';

type Screen = 'prompt' | 'history' | 'admin' | 'subscription' | 'blog' | 'debug';

function AppContent() {
  const { isLoading, isSignedIn, user, login, signout } = useBasic();
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('prompt');
  const [showLandingPage, setShowLandingPage] = React.useState(true);

  // Debug logging
  React.useEffect(() => {
    console.log('Auth State Debug:', {
      isLoading,
      isSignedIn,
      user: user ? { email: user.email, name: user.name } : null,
      showLandingPage
    });
  }, [isLoading, isSignedIn, user, showLandingPage]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
        <Text style={styles.subtitle}>Checking authentication...</Text>
      </View>
    );
  }

  // Show landing page if not signed in and landing page hasn't been dismissed
  if (!isSignedIn && showLandingPage) {
    return (
      <ModernLandingPage 
        onGetStarted={() => {
          console.log('Landing page dismissed');
          setShowLandingPage(false);
        }}
      />
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎵 AI Music Prompter</Text>
        <Text style={styles.subtitle}>Sign in to create professional music prompts</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            console.log('Login button pressed');
            login();
          }}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => setShowLandingPage(true)}
        >
          <Text style={styles.buttonText}>← Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.blogButton]} 
          onPress={() => setCurrentScreen('blog')}
        >
          <Text style={styles.buttonText}>📚 Read Blog</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#FF9800' }]} 
          onPress={() => setCurrentScreen('debug')}
        >
          <Text style={styles.buttonText}>🔍 Debug Auth</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // This should show after successful login
  console.log('Rendering authenticated app interface');
  
  const navigateToSubscription = () => {
    setCurrentScreen('subscription');
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await signout();
      setShowLandingPage(true);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'prompt':
        return <PromptFormScreen onNavigateToSubscription={navigateToSubscription} />;
      case 'history':
        return <HistoryScreen />;
      case 'admin':
        return <AdminScreen />;
      case 'subscription':
        return <SubscriptionScreen />;
      case 'blog':
        return <BlogScreen />;
      case 'debug':
        return <AuthDebug />;
      default:
        return <PromptFormScreen onNavigateToSubscription={navigateToSubscription} />;
    }
  };

  const isAdmin = user?.email === 'drremotework@gmail.com';

  return (
    <PromptHistoryProvider>
      <View style={styles.appContainer}>
        {/* Debug Info */}
        <View style={{ padding: 10, backgroundColor: '#333', borderBottomWidth: 1, borderBottomColor: '#555' }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>
            Debug: User: {user?.email || 'No email'} | Signed In: {isSignedIn ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Navigation Bar */}
        <View style={styles.navbar}>
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'prompt' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('prompt')}
          >
            <Text style={[styles.navButtonText, currentScreen === 'prompt' && styles.activeNavButtonText]}>
              🎵 Prompter
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'history' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('history')}
          >
            <Text style={[styles.navButtonText, currentScreen === 'history' && styles.activeNavButtonText]}>
              📝 History
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'blog' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('blog')}
          >
            <Text style={[styles.navButtonText, currentScreen === 'blog' && styles.activeNavButtonText]}>
              📚 Blog
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'subscription' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('subscription')}
          >
            <Text style={[styles.navButtonText, currentScreen === 'subscription' && styles.activeNavButtonText]}>
              💎 Pro
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 'debug' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('debug')}
          >
            <Text style={[styles.navButtonText, currentScreen === 'debug' && styles.activeNavButtonText]}>
              🔍 Debug
            </Text>
          </TouchableOpacity>
          
          {isAdmin && (
            <TouchableOpacity 
              style={[styles.navButton, currentScreen === 'admin' && styles.activeNavButton]}
              onPress={() => setCurrentScreen('admin')}
            >
              <Text style={[styles.navButtonText, currentScreen === 'admin' && styles.activeNavButtonText]}>
                ⚙️ Admin
              </Text>
            </TouchableOpacity>
          )}

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>🚪</Text>
          </TouchableOpacity>
        </View>

        {/* Screen Content */}
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>
      </View>
    </PromptHistoryProvider>
  );
}

export default function App() {
  return (
    <BasicProvider project_id={schema.project_id} schema={schema}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
          <CookieConsent />
        </ThemeProvider>
      </SafeAreaProvider>
    </BasicProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
    alignItems: 'center',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginHorizontal: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: '#4CAF50',
  },
  navButtonText: {
    color: '#cccccc',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeNavButtonText: {
    color: '#ffffff',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 5,
    borderRadius: 6,
    backgroundColor: '#f44336',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#666666',
    marginTop: 10,
  },
  blogButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
