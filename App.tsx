import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import PromptFormScreen from './screens/PromptFormScreen';
import AdminScreen from './screens/AdminScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotificationProvider>
          <UsageProvider>
            <PromptHistoryProvider>
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
            </PromptHistoryProvider>
          </UsageProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
