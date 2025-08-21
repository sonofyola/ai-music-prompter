import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PromptFormScreen from './screens/PromptFormScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          id="MainTabs"
          screenOptions={{
            tabBarActiveTintColor: '#6366f1',
            tabBarInactiveTintColor: '#64748b',
            headerShown: false,
          }}
        >
          <Tab.Screen 
            name="Generate" 
            component={PromptFormScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="auto-awesome" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Subscription" 
            component={SubscriptionScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="card-membership" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}