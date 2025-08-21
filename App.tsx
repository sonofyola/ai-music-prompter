import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { UsageProvider } from './contexts/UsageContext';
import { PromptHistoryProvider } from './contexts/PromptHistoryContext';
import PromptFormScreen from './screens/PromptFormScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
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
          options={{ title: 'AI Music Prompts' }}
        />
        <Tab.Screen 
          name="Subscription" 
          component={SubscriptionScreen} 
          options={{ title: 'Subscription' }}
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
            <AppContent />
          </PromptHistoryProvider>
        </UsageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
