import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import { MaintenanceProvider, useMaintenance } from './contexts/MaintenanceContext';
import PromptFormScreen from './screens/PromptFormScreen';
import AdminScreen from './screens/AdminScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import MaintenanceScreen from './components/MaintenanceScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isMaintenanceMode, maintenanceMessage, isAdmin, setAdminStatus } = useMaintenance();

  // If maintenance mode is active and user is not admin, show maintenance screen
  if (isMaintenanceMode && !isAdmin) {
    return (
      <MaintenanceScreen 
        message={maintenanceMessage}
        onAdminAccess={() => setAdminStatus(true)}
        showAdminAccess={true}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="PromptForm"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="PromptForm" 
          component={PromptFormScreen}
        />
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen}
        />
        <Stack.Screen 
          name="Subscription" 
          component={SubscriptionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MaintenanceProvider>
          <NotificationProvider>
            <UsageProvider>
              <PromptHistoryProvider>
                <AppNavigator />
              </PromptHistoryProvider>
            </UsageProvider>
          </NotificationProvider>
        </MaintenanceProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
