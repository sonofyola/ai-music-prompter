import React from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BasicProvider, useBasic } from '@basictech/expo';
import { schema } from './basic.config';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import { MaintenanceProvider, useMaintenance } from './contexts/MaintenanceContext';
import PromptFormScreen from './screens/PromptFormScreen';
import AdminScreen from './screens/AdminScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import MaintenanceScreen from './components/MaintenanceScreen';
import AuthScreen from './screens/AuthScreen';

const Stack = createStackNavigator();

function AppContent() {
  const { isSignedIn, user, isLoading } = useBasic();
  const { isMaintenanceMode, maintenanceMessage, isAdmin, checkAdminAccess, setAdminStatus } = useMaintenance();

  // Enhanced debug logging
  console.log('🔍 APP RENDER - Full state check:', {
    isSignedIn,
    userEmail: user?.email,
    isLoading,
    isMaintenanceMode,
    isAdmin,
    maintenanceMessage,
    timestamp: new Date().toISOString()
  });

  // Handle admin access attempt from maintenance screen
  const handleAdminAccessFromMaintenance = async () => {
    console.log('🔓 Admin access requested from maintenance screen');
    console.log('🔓 User email:', user?.email);
    
    try {
      if (!user?.email) {
        Alert.alert('Sign In Required', 'Please sign in to access admin features.');
        return;
      }
      
      const hasAccess = await checkAdminAccess();
      
      if (hasAccess) {
        console.log('✅ Admin access granted from maintenance screen!');
        await setAdminStatus(true);
        Alert.alert(
          '🔓 Admin Access Granted',
          `Welcome, admin! Maintenance mode bypassed.\n\nEmail: ${user?.email}`,
          [{ text: 'Continue' }]
        );
      } else {
        console.log('❌ Admin access denied from maintenance screen');
        Alert.alert(
          '🚫 Access Denied',
          `You are not authorized for admin access.\n\nYour email: ${user?.email}\n\nOnly whitelisted email addresses can access admin features.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Admin access error from maintenance screen:', error);
      Alert.alert('Error', `Failed to check admin access: ${error.message}`);
    }
  };

  // Show loading state - including while admin check is happening
  if (isLoading) {
    console.log('📱 RENDER DECISION: Loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // CRITICAL FIX: For signed-in users, wait a moment for admin check to complete
  // This prevents the flash of maintenance screen for admins
  if (isSignedIn && user?.email) {
    // Give admin check a moment to complete (prevent flash)
    const adminEmails = [
      'drremotework@gmail.com',
      'admin@aimusicpromptr.com',
    ];
    const userEmail = user.email.toLowerCase().trim();
    const shouldBeAdmin = adminEmails.some(adminEmail => 
      adminEmail.toLowerCase().trim() === userEmail
    );
    
    // If user should be admin but isAdmin is still false, show loading briefly
    if (shouldBeAdmin && !isAdmin) {
      console.log('⏳ RENDER DECISION: Waiting for admin check to complete');
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
    }
  }

  // Check maintenance mode for ALL users (authenticated and non-authenticated)
  // Only admins should bypass maintenance mode
  if (isMaintenanceMode && !isAdmin) {
    console.log('🚧 RENDER DECISION: Maintenance screen', {
      isMaintenanceMode,
      isAdmin,
      isSignedIn,
      userEmail: user?.email
    });
    return (
      <MaintenanceScreen 
        message={maintenanceMessage}
        onAdminAccess={handleAdminAccessFromMaintenance}
        showAdminAccess={isSignedIn} // Only show admin access button for signed-in users
      />
    );
  }

  // Show auth screen if not signed in (and not in maintenance mode)
  if (!isSignedIn || !user) {
    console.log('🔐 RENDER DECISION: Auth screen');
    return <AuthScreen />;
  }

  // Show main app with navigation
  console.log('📱 RENDER DECISION: Main app with navigation');
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Home" component={PromptFormScreen} />
        <Stack.Screen 
          name="Admin" 
          component={AdminScreenWrapper} 
        />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrapper component for AdminScreen to handle navigation
function AdminScreenWrapper({ navigation }: any) {
  return (
    <AdminScreen 
      onBackToApp={() => navigation.goBack()} 
    />
  );
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
            The app encountered an unexpected error. Please refresh the page to try again.
          </Text>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <BasicProvider project_id={schema.project_id} schema={schema as any}>
          <ThemeProvider>
            <MaintenanceProvider>
              <NotificationProvider>
                <UsageProvider>
                  <PromptHistoryProvider>
                    <AppContent />
                  </PromptHistoryProvider>
                </UsageProvider>
              </NotificationProvider>
            </MaintenanceProvider>
          </ThemeProvider>
        </BasicProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
