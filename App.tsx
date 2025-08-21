import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

function AppContent() {
  const { isSignedIn, user, isLoading, error } = useBasic();
  const { isMaintenanceMode, maintenanceMessage, isAdmin } = useMaintenance();

  // Show error state if there's a network error
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
          Connection Error
        </Text>
        <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 20 }}>
          Unable to connect to the server. Please check your internet connection and try again.
        </Text>
        <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
          Error: {error.message || 'Network error occurred'}
        </Text>
      </View>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If maintenance mode is active and user is not admin, show maintenance screen
  if (isMaintenanceMode && !isAdmin) {
    return (
      <MaintenanceScreen 
        message={maintenanceMessage}
        onAdminAccess={() => {}}
        showAdminAccess={true}
      />
    );
  }

  // Show auth screen if not signed in
  if (!isSignedIn || !user) {
    return <AuthScreen />;
  }

  // Show main app - for now just the prompt form
  return <PromptFormScreen navigation={null} />;
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
