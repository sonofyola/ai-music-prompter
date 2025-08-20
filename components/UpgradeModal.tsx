import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { initializeStripe } from '../utils/stripeService';
import StripePaymentForm from './StripePaymentForm';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ visible, onClose }: UpgradeModalProps) {
  const { colors } = useTheme();
  const { upgradeToPremium } = useUsage();
  const [email, setEmail] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isStripeReady, setIsStripeReady] = useState(false);

  useEffect(() => {
    const setupStripe = async () => {
      const initialized = await initializeStripe();
      setIsStripeReady(initialized);
    };
    
    if (visible) {
      setupStripe();
    }
  }, [visible]);

  const handleEmailSubmit = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!isStripeReady) {
      Alert.alert('Error', 'Payment system is not ready. Please try again.');
      return;
    }

    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (subscriptionId: string) => {
    try {
      // Store subscription info and upgrade user
      await upgradeToPremium();
      
      Alert.alert(
        'Welcome to Premium! 🎉',
        'Your subscription is now active. Enjoy unlimited prompt generations!',
        [{ text: 'Get Started', onPress: onClose }]
      );
    } catch (error) {
      console.error('Error upgrading user:', error);
      Alert.alert('Error', 'There was an issue activating your subscription. Please contact support.');
    }
  };

  const handlePaymentError = (error: string) => {
    Alert.alert('Payment Failed', error);
    setShowPaymentForm(false); // Go back to email form
  };

  const handleBack = () => {
    setShowPaymentForm(false);
  };

  const handleClose = () => {
    setShowPaymentForm(false);
    setEmail('');
    onClose();
  };

  const styles = createStyles(colors);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </Pressable>
            
            {showPaymentForm && (
              <Pressable onPress={handleBack} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={colors.text} />
              </Pressable>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <MaterialIcons name="workspace-premium" size={32} color={colors.primary} />
              <Text style={styles.title}>
                {showPaymentForm ? 'Complete Your Subscription' : 'Upgrade to Premium'}
              </Text>
            </View>

            {!showPaymentForm ? (
              <>
                <Text style={styles.subtitle}>
                  Unlock unlimited AI music prompts and premium features
                </Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$5.99</Text>
                  <Text style={styles.period}>/month</Text>
                </View>

                <View style={styles.features}>
                  <View style={styles.feature}>
                    <MaterialIcons name="all-inclusive" size={22} color={colors.success} />
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureText}>Unlimited prompt generations</Text>
                      <Text style={styles.featureSubtext}>vs. 3 per day on free plan</Text>
                    </View>
                  </View>
                  <View style={styles.feature}>
                    <MaterialIcons name="flash-on" size={22} color={colors.success} />
                    <Text style={styles.featureText}>No daily limits or restrictions</Text>
                  </View>
                  <View style={styles.feature}>
                    <MaterialIcons name="support-agent" size={22} color={colors.success} />
                    <Text style={styles.featureText}>Priority customer support</Text>
                  </View>
                  <View style={styles.feature}>
                    <MaterialIcons name="new-releases" size={22} color={colors.success} />
                    <Text style={styles.featureText}>Early access to new features</Text>
                  </View>
                  <View style={styles.feature}>
                    <MaterialIcons name="cloud-sync" size={22} color={colors.success} />
                    <Text style={styles.featureText}>Cloud sync across devices</Text>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <Pressable 
                  style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
                  onPress={handleEmailSubmit}
                >
                  <Text style={styles.upgradeButtonText}>Continue to Payment</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Enter your payment details to start your premium subscription
                </Text>

                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryText}>Premium Subscription</Text>
                  <Text style={styles.summaryPrice}>$5.99/month</Text>
                </View>

                <StripePaymentForm
                  email={email}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />

                <Pressable 
                  style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    // The payment form handles the actual payment
                    // This button could trigger the payment process
                  }}
                >
                  <Text style={styles.upgradeButtonText}>Start Premium Subscription</Text>
                </Pressable>
              </>
            )}

            <View style={styles.guaranteeContainer}>
              <MaterialIcons name="verified-user" size={16} color={colors.success} />
              <Text style={styles.guarantee}>
                Secure payment • Cancel anytime • 30-day money-back guarantee
              </Text>
            </View>

            <Text style={styles.disclaimer}>
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              Your subscription will automatically renew each month unless cancelled. 
              You can manage your subscription in your account settings.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.primary,
  },
  period: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  features: {
    marginBottom: 28,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  featureSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  upgradeButton: {
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  guaranteeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  guarantee: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
});
