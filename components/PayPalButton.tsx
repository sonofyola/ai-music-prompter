import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// This component is deprecated - we're using Stripe instead
export default function PayPalButton() {
  const { colors } = useTheme();
  
  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
        PayPal integration has been replaced with Stripe
      </Text>
    </View>
  );
}
