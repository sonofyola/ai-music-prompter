import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import { NotificationProvider } from './contexts/NotificationContext';
import PromptFormScreen from './screens/PromptFormScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof MaterialIcons.glyphMap;

            if (route.name === 'Generate') {
              iconName = 'auto-awesome';
            } else if (route.name === 'Subscription') {
              iconName = 'card-membership';
            } else {
              iconName = 'help';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
        })}
      >
        <Tab.Screen 
          name="Generate" 
          component={PromptFormScreen} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Subscription" 
          component={SubscriptionScreen} 
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UsageProvider>
          <PromptHistoryProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </PromptHistoryProvider>
        </UsageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
