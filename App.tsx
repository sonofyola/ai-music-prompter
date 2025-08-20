import '@expo/metro-runtime';
import './utils/global-error-handler';
import './polyfills';
import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ThemeProvider } from './contexts/ThemeContext';
import { UsageProvider } from './contexts/UsageContext';
import PromptFormScreen from './screens/PromptFormScreen';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <ThemeProvider>
        <UsageProvider>
          <PromptFormScreen />
        </UsageProvider>
      </ThemeProvider>
    </StripeProvider>
  );
}

registerRootComponent(App);
