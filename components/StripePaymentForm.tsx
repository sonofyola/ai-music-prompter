import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
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
  const { confirmPayment, createPaymentMethod } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handlePayment = async () => {
    if (!cardComplete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment method
      const { paymentMethod, error: pmError } = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: email,
          },
        },
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Create subscription with the payment method
      // In a real app, this would call your backend
      const subscriptionResponse = await fetch('YOUR_BACKEND_URL/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          payment_method_id: paymentMethod.id,
          price_id: 'price_YOUR_STRIPE_PRICE_ID', // Your monthly price ID
        }),
      });

      const subscriptionData = await subscriptionResponse.json();

      if (subscriptionData.client_secret) {
        // Handle 3D Secure authentication if required
        const { error: confirmError } = await confirmPayment(
          subscriptionData.client_secret,
          {
            paymentMethodType: 'Card',
          }
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      // Payment successful
      onPaymentSuccess(subscriptionData.subscription_id);
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
    },
    cardContainer: {
      marginBottom: 20,
    },
    cardField: {
      width: '100%',
      height: 50,
      marginVertical: 10,
    },
    securityText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 16,
    },
    processingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    processingText: {
      fontSize: 16,
      color: colors.text,
    },
  });

  if (isProcessing) {
    return (
      <View style={styles.processingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.processingText}>Processing payment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242',
            expiration: 'MM/YY',
            cvc: 'CVC',
            postalCode: 'ZIP',
          }}
          cardStyle={{
            backgroundColor: colors.surface,
            textColor: colors.text,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            fontSize: 16,
            placeholderColor: colors.textSecondary,
          }}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setCardComplete(cardDetails.complete);
          }}
        />
      </View>

      <Text style={styles.securityText}>
        🔒 Your payment information is encrypted and secure.{'\n'}
        Powered by Stripe. We never store your card details.
      </Text>
    </View>
  );
}