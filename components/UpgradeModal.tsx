import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useBasic } from '@basictech/expo';
import StripePaymentForm from './StripePaymentForm';
import IconFallback from './IconFallback';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export default function UpgradeModal({ visible, onClose, onUpgradeSuccess }: UpgradeModalProps) {
  const { colors } = useTheme();
  const { user } = useBasic();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const styles = createStyles(colors);

  const handlePaymentSuccess = (subscriptionId: string) => {
    console.log('Payment successful:', subscriptionId);
    onUpgradeSuccess();
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Could show error message to user here
  };

  const handleStartUpgrade = () => {
    setShowPaymentForm(true);
  };

  const handleBackToFeatures = () => {
    setShowPaymentForm(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {!showPaymentForm ? (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <IconFallback name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.title}>🚀 Upgrade to Premium</Text>
                <Text style={styles.subtitle}>Get unlimited music prompt generations!</Text>
                
                {/* Features */}
                <View style={styles.features}>
                  <View style={styles.feature}>
                    <IconFallback name="check-circle" size={20} color={colors.success} />
                    <Text style={styles.featureText}>Unlimited prompt generations</Text>
                  </View>
                  <View style={styles.feature}>
                    <IconFallback name="flash" size={20} color={colors.success} />
                    <Text style={styles.featureText}>No daily limits</Text>
                  </View>
                  <View style={styles.feature}>
                    <IconFallback name="headset" size={20} color={colors.success} />
                    <Text style={styles.featureText}>Priority support</Text>
                  </View>
                  <View style={styles.feature}>
                    <IconFallback name="star" size={20} color={colors.success} />
                    <Text style={styles.featureText}>Advanced templates</Text>
                  </View>
                  <View style={styles.feature}>
                    <IconFallback name="refresh" size={20} color={colors.success} />
                    <Text style={styles.featureText}>Cancel anytime</Text>
                  </View>
                </View>

                {/* Pricing */}
                <View style={styles.pricingBox}>
                  <Text style={styles.price}>$5.99</Text>
                  <Text style={styles.pricePeriod}>/month</Text>
                </View>

                <Text style={styles.pricingNote}>
                  ✨ No credit card needed to try • 3 free generations daily
                </Text>

                {/* Buttons */}
                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.upgradeButton} onPress={handleStartUpgrade}>
                    <Text style={styles.upgradeButtonText}>Continue to Payment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Maybe Later</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Payment Form */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={handleBackToFeatures} style={styles.backButton}>
                    <IconFallback name="arrow-left" size={24} color={colors.textSecondary} />
                    <Text style={styles.backText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <IconFallback name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.title}>💳 Complete Payment</Text>
                <Text style={styles.subtitle}>Secure checkout powered by Stripe</Text>

                <StripePaymentForm
                  email={user?.email || ''}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  features: {
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  pricingBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },
  pricePeriod: {
    fontSize: 18,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  pricingNote: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  buttons: {
    paddingHorizontal: 20,
    gap: 12,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
