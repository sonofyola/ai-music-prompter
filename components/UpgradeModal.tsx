import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { collectEmail } from '../utils/emailService';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ visible, onClose }: UpgradeModalProps) {
  const { colors } = useTheme();
  const { upgradeToUnlimited } = useUsage();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to continue.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Collect subscription email with premium tier
      await collectEmail({
        email: email.trim(),
        tier: 'premium_monthly',
        timestamp: new Date().toISOString(),
        source: 'subscription',
        amount: 5.99,
        billing_cycle: 'monthly'
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Upgrade user to unlimited
      await upgradeToUnlimited();
      
      Alert.alert(
        'Subscription Activated! 🎉',
        'Welcome to Premium! You now have unlimited prompt generations. Your subscription will renew monthly at $5.99.',
        [{ text: 'Get Started!', onPress: onClose }]
      );
      
      setEmail('');
    } catch (error) {
      Alert.alert(
        'Subscription Failed', 
        'We couldn\'t process your subscription. Please check your payment method and try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <MaterialIcons name="star" size={28} color={colors.warning} />
                <Text style={styles.title}>Go Premium</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.premiumBadge}>
                <MaterialIcons name="workspace-premium" size={20} color="#fff" />
                <Text style={styles.premiumBadgeText}>PREMIUM SUBSCRIPTION</Text>
              </View>

              <View style={styles.features}>
                <View style={styles.feature}>
                  <MaterialIcons name="all-inclusive" size={22} color={colors.success} />
                  <Text style={styles.featureText}>Unlimited prompt generations</Text>
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

              <View style={styles.pricing}>
                <View style={styles.priceContainer}>
                  <Text style={styles.currency}>$</Text>
                  <Text style={styles.price}>5.99</Text>
                  <Text style={styles.period}>/month</Text>
                </View>
                <Text style={styles.priceSubtext}>Billed monthly • Cancel anytime</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>🎵 Unlimited music creativity</Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity 
                style={[styles.subscribeButton, isProcessing && styles.processingButton]}
                onPress={handleSubscribe}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <View style={styles.processingContent}>
                    <MaterialIcons name="hourglass-empty" size={20} color="#fff" />
                    <Text style={styles.subscribeButtonText}>Processing...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="workspace-premium" size={20} color="#fff" />
                    <Text style={styles.subscribeButtonText}>Start Premium Subscription</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.guaranteeContainer}>
                <MaterialIcons name="verified-user" size={16} color={colors.success} />
                <Text style={styles.guarantee}>
                  7-day free trial • Secure payment • Cancel anytime
                </Text>
              </View>

              <Text style={styles.disclaimer}>
                By subscribing, you agree to our Terms of Service and Privacy Policy. 
                Your subscription will automatically renew each month unless cancelled. 
                You can manage your subscription in your account settings.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
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
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  pricing: {
    alignItems: 'center',
    marginBottom: 28,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
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
  priceSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  savingsBadge: {
    backgroundColor: colors.success + '20',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  savingsText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
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
  subscribeButton: {
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
  processingButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  processingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
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
});
