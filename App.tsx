import React from 'react';
import { View, Text } from 'react-native';
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
  const { isMaintenanceMode, maintenanceMessage, isAdmin } = useMaintenance();

  // Debug logging
  console.log('🔍 APP RENDER STATE:', {
    isSignedIn,
    userEmail: user?.email,
    isLoading,
    isMaintenanceMode,
    isAdmin,
    maintenanceMessage
  });

  // Show loading state
  if (isLoading) {
    console.log('📱 Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If maintenance mode is active and user is not admin, show maintenance screen
  // This should catch both non-authenticated users and authenticated non-admin users
  if (isMaintenanceMode && !isAdmin) {
    console.log('🚧 Showing maintenance screen - maintenance active and user is not admin');
    return (
      <MaintenanceScreen 
        message={maintenanceMessage}
        onAdminAccess={() => {}}
        showAdminAccess={false}
      />
    );
  }

  // Show auth screen if not signed in
  if (!isSignedIn || !user) {
    console.log('🔐 Showing auth screen - user not signed in');
    return <AuthScreen />;
  }

  // Show main app with navigation
  console.log('📱 Showing main app with navigation');
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
        <BasicProvider project_id={schema.project_id} schema={schema}>
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
