import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import PromptFormScreen from './screens/PromptFormScreen';
import AdminScreen from './screens/AdminScreen';
import HistoryScreen from './screens/HistoryScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import ModernLandingPage from './components/ModernLandingPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';

type Screen = 'prompt' | 'history' | 'admin' | 'subscription';

function AppContent() {
  const { isLoading, isSignedIn, user, login, signout } = useBasic();
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('prompt');
  const [showLandingPage, setShowLandingPage] = React.useState(true);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  // Show landing page if not signed in and landing page hasn't been dismissed
  if (!isSignedIn && showLandingPage) {
    return (
      <ModernLandingPage 
        onGetStarted={() => {
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
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => setShowLandingPage(true)}
        >
          <Text style={styles.buttonText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const navigateToSubscription = () => {
    setCurrentScreen('subscription');
  };

  const handleLogout = async () => {
    try {
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
      default:
        return <PromptFormScreen onNavigateToSubscription={navigateToSubscription} />;
    }
  };

  const isAdmin = user?.email === 'drremotework@gmail.com';

  return (
    <PromptHistoryProvider>
      <View style={styles.appContainer}>
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
            style={[styles.navButton, currentScreen === 'subscription' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('subscription')}
          >
            <Text style={[styles.navButtonText, currentScreen === 'subscription' && styles.activeNavButtonText]}>
              💎 Pro
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
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: '#4CAF50',
  },
  navButtonText: {
    color: '#cccccc',
    fontSize: 12,
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
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
