import React from 'react';
import { Pressable, Text, StyleSheet, Linking, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface PayPalButtonProps {
  email: string;
  onPaymentSuccess: () => void;
}

export default function PayPalButton({ email, onPaymentSuccess }: PayPalButtonProps) {
  const { colors } = useTheme();

  const handlePayPalPayment = async () => {
    try {
      // PayPal checkout URL with your details
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?` +
        `cmd=_xclick&` +
        `business=your-paypal-email@example.com&` + // Replace with your PayPal email
        `item_name=AI Music Prompt Generator - 1 Month Premium&` +
        `amount=5.99&` +
        `currency_code=USD&` +
        `return=https://your-app.com/success&` + // Replace with your success URL
        `cancel_return=https://your-app.com/cancel&` + // Replace with your cancel URL
        `notify_url=https://your-backend.com/paypal-webhook`; // Replace with your webhook URL

      const supported = await Linking.canOpenURL(paypalUrl);
      
      if (supported) {
        await Linking.openURL(paypalUrl);
        
        // For demo purposes, we'll simulate success after a delay
        // In a real app, you'd handle this through webhooks
        setTimeout(() => {
          Alert.alert(
            'Payment Status',
            'Did you complete the PayPal payment?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Yes, I paid', 
                onPress: () => {
                  onPaymentSuccess();
                  Alert.alert('Success!', 'Welcome to Premium! You now have unlimited prompts for 30 days.');
                }
              }
            ]
          );
        }, 3000);
      } else {
        Alert.alert('Error', 'Cannot open PayPal. Please try again.');
      }
    } catch (error) {
      console.error('PayPal error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: '#0070ba', // PayPal blue
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <Pressable style={styles.button} onPress={handlePayPalPayment}>
      <Text style={styles.buttonText}>Pay $5.99 with PayPal</Text>
    </Pressable>
  );
}