import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import EmailCapture from './EmailCapture';
import PayPalButton from './PayPalButton';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export default function UpgradeModal({
  visible,
  onClose,
  onUpgradeSuccess,
}: UpgradeModalProps) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const handleEmailSubmit = (userEmail: string) => {
    setEmail(userEmail);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    onUpgradeSuccess();
    onClose();
    setShowPayment(false);
    setEmail('');
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modal: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 24,
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    price: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    priceSubtext: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    checkmark: {
      fontSize: 18,
      color: colors.primary,
      marginRight: 12,
      width: 20,
    },
    featureText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    guarantee: {
      backgroundColor: colors.background,
      padding: 16,
      borderRadius: 8,
      marginTop: 20,
      marginBottom: 20,
    },
    guaranteeText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Upgrade to Premium</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>Get Unlimited Access</Text>
            
            <Text style={styles.price}>$5.99</Text>
            <Text style={styles.priceSubtext}>One-time payment • 30 days access</Text>

            <View style={styles.feature}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>Unlimited prompt generations</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>No daily limits</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>Priority support</Text>
            </View>
            
            <View style={styles.feature}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>Advanced prompt features</Text>
            </View>

            <View style={styles.guarantee}>
              <Text style={styles.guaranteeText}>
                💰 30-day money-back guarantee{'\n'}
                Not satisfied? Get a full refund, no questions asked.
              </Text>
            </View>

            {!showPayment ? (
              <EmailCapture onEmailSubmit={handleEmailSubmit} />
            ) : (
              <PayPalButton 
                email={email} 
                onPaymentSuccess={handlePaymentSuccess}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
