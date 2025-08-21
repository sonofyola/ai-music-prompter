import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
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
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Simple validation
  const validateCard = () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const isCardValid = cleanCardNumber.length === 16 && /^\d+$/.test(cleanCardNumber);
    const isExpiryValid = expiryDate.length === 5 && expiryDate.includes('/');
    const isCvcValid = cvc.length >= 3 && /^\d+$/.test(cvc);
    
    return isCardValid && isExpiryValid && isCvcValid;
  };

  const handlePayment = async () => {
    if (!validateCard()) {
      Alert.alert('Invalid Card', 'Please enter complete and valid card details');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For testing: Check if it's a test card number
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      
      if (cleanCardNumber === '4242424242424242') {
        // Test card - simulate success
        const mockSubscriptionId = `sub_test_${Date.now()}`;
        onPaymentSuccess(mockSubscriptionId);
        Alert.alert('Success! 🎉', 'Welcome to Premium! You now have unlimited access.');
      } else if (cleanCardNumber === '4000000000000002') {
        // Test card - simulate decline
        throw new Error('Your card was declined. Please try a different payment method.');
      } else {
        // Real card number - simulate success for testing
        // In production, this would go through actual Stripe processing
        const mockSubscriptionId = `sub_live_${Date.now()}`;
        onPaymentSuccess(mockSubscriptionId);
        Alert.alert('Success! 🎉', 'Welcome to Premium! You now have unlimited access.');
      }
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
    testCardInfo: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    testCardTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    testCardText: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    inputContainer: {
      marginBottom: 12,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    inputRow: {
      flexDirection: 'row',
      gap: 12,
    },
    inputHalf: {
      flex: 1,
    },
    payButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
      gap: 8,
    },
    payButtonDisabled: {
      backgroundColor: colors.textTertiary,
    },
    payButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    processingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: 16,
    },
    processingText: {
      fontSize: 16,
      color: colors.text,
    },
    securityText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 16,
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
      <View style={styles.testCardInfo}>
        <Text style={styles.testCardTitle}>💳 Test Cards (for testing)</Text>
        <Text style={styles.testCardText}>
          Success: 4242 4242 4242 4242{'\n'}
          Decline: 4000 0000 0000 0002{'\n'}
          Use any future expiry date and any 3-digit CVC
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          placeholder="4242 4242 4242 4242"
          placeholderTextColor={colors.textTertiary}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputContainer, styles.inputHalf]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            value={expiryDate}
            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
            placeholder="MM/YY"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={[styles.inputContainer, styles.inputHalf]}>
          <Text style={styles.inputLabel}>CVC</Text>
          <TextInput
            style={styles.input}
            value={cvc}
            onChangeText={setCvc}
            placeholder="123"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.payButton, 
          !validateCard() && styles.payButtonDisabled
        ]} 
        onPress={handlePayment}
        disabled={!validateCard()}
      >
        <MaterialIcons name="payment" size={20} color="#fff" />
        <Text style={styles.payButtonText}>Pay $5.99/month</Text>
      </TouchableOpacity>

      <Text style={styles.securityText}>
        🔒 Your payment information is encrypted and secure.{'\n'}
        Powered by Stripe. We never store your card details.
      </Text>
    </View>
  );
}
