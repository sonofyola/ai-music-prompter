import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface StripePaymentFormProps {
  email: string;
  onPaymentSuccess: (subscriptionId: string) => void;
  onPaymentError: (error: string) => void;
}

export default function StripePaymentForm({
  email,
  onPaymentSuccess,
  onPaymentError,
}: StripePaymentFormProps) {
  const { colors } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/6oU14nfB23nVajl9mD3AY00';

  const handleStripeCheckout = async () => {
    try {
      setIsProcessing(true);
      
      // Add email as a parameter to pre-fill the checkout
      const checkoutUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`;
      
      const supported = await Linking.canOpenURL(checkoutUrl);
      
      if (supported) {
        await Linking.openURL(checkoutUrl);
        
        // For now, we'll simulate success after opening the link
        // In a production app, you'd want to implement proper webhook handling
        // or use Stripe's return URLs to confirm payment
        setTimeout(() => {
          Alert.alert(
            'Payment Processing',
            'Please complete your payment in the browser. Once completed, restart the app to activate your premium subscription.',
            [
              {
                text: 'I completed payment',
                onPress: () => {
                  // Simulate successful subscription
                  const mockSubscriptionId = `sub_${Date.now()}`;
                  onPaymentSuccess(mockSubscriptionId);
                }
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => setIsProcessing(false)
              }
            ]
          );
        }, 1000);
        
      } else {
        throw new Error('Cannot open Stripe checkout');
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Failed to open checkout');
      setIsProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
    },
    infoBox: {
      backgroundColor: colors.background,
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      textAlign: 'center',
    },
    emailDisplay: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emailLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    emailText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
    checkoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#635BFF', // Stripe brand color
      borderRadius: 8,
      padding: 16,
      gap: 8,
    },
    checkoutButtonDisabled: {
      backgroundColor: colors.textTertiary,
    },
    checkoutButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    securityText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 16,
    },
    stripeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      gap: 4,
    },
    stripeText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🔒 Secure Checkout</Text>
        <Text style={styles.infoText}>
          You'll be redirected to Stripe's secure checkout page to complete your payment safely.
        </Text>
      </View>

      <View style={styles.emailDisplay}>
        <Text style={styles.emailLabel}>Email for receipt:</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.checkoutButton,
          isProcessing && styles.checkoutButtonDisabled
        ]} 
        onPress={handleStripeCheckout}
        disabled={isProcessing}
      >
        <MaterialIcons name="payment" size={20} color="#fff" />
        <Text style={styles.checkoutButtonText}>
          {isProcessing ? 'Opening Checkout...' : 'Pay $5.99/month with Stripe'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.securityText}>
        🔒 Your payment is processed securely by Stripe.{'\n'}
        We never see or store your payment information.
      </Text>

      <View style={styles.stripeInfo}>
        <Text style={styles.stripeText}>Powered by</Text>
        <Text style={[styles.stripeText, { fontWeight: '600', color: '#635BFF' }]}>
          Stripe
        </Text>
      </View>
    </View>
  );
}
