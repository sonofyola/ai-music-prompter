import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PromptFormScreen from './screens/PromptFormScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <PromptFormScreen />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}