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
  const { isSignedIn, user, isLoading } = useBasic();
  const { isMaintenanceMode, maintenanceMessage, isAdmin } = useMaintenance();

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

export default function App() {
  return (
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
  );
}