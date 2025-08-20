import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './contexts/ThemeContext';
import { UsageProvider, useUsage } from './contexts/UsageContext';
import PromptFormScreen from './screens/PromptFormScreen';
import EmailCapture from './components/EmailCapture';

function AppContent() {
  const { isEmailCaptured, setUserEmail } = useUsage();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleEmailSubmitted = async (email: string) => {
    await setUserEmail(email);
  };

  if (!isEmailCaptured) {
    return <EmailCapture onEmailSubmitted={handleEmailSubmitted} />;
  }

  return (
    <PromptFormScreen 
      onUpgradePress={() => setShowUpgradeModal(true)}
      showUpgradeModal={showUpgradeModal}
      onCloseUpgradeModal={() => setShowUpgradeModal(false)}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UsageProvider>
          <AppContent />
          <StatusBar style="auto" />
        </UsageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
