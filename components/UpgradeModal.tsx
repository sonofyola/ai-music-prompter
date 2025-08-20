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
  Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ visible, onClose }: UpgradeModalProps) {
  const { colors } = useTheme();
  const { upgradeToUnlimited } = useUsage();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
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
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save email for contact list
      console.log('Email captured for upgrade:', email);
      
      await upgradeToUnlimited();
      
      Alert.alert(
        'Upgrade Successful! 🎉',
        'You now have unlimited prompt generations. Thank you for your support!',
        [{ text: 'Awesome!', onPress: onClose }]
      );
      
      setEmail('');
    } catch (error) {
      Alert.alert('Upgrade Failed', 'Something went wrong. Please try again.');
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
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <MaterialIcons name="star" size={28} color={colors.warning} />
              <Text style={styles.title}>Upgrade to Unlimited</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.features}>
              <View style={styles.feature}>
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Unlimited prompt generations</Text>
              </View>
              <View style={styles.feature}>
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>No daily limits</Text>
              </View>
              <View style={styles.feature}>
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Priority support</Text>
              </View>
              <View style={styles.feature}>
                <MaterialIcons name="check-circle" size={20} color={colors.success} />
                <Text style={styles.featureText}>Future premium features</Text>
              </View>
            </View>

            <View style={styles.pricing}>
              <Text style={styles.price}>$4.99</Text>
              <Text style={styles.priceSubtext}>one-time payment</Text>
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
              style={[styles.upgradeButton, isProcessing && styles.processingButton]}
              onPress={handleUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Text style={styles.upgradeButtonText}>Processing...</Text>
              ) : (
                <>
                  <MaterialIcons name="star" size={20} color="#fff" />
                  <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Secure payment • Cancel anytime • 30-day money-back guarantee
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
  },
  features: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
  },
  pricing: {
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
  },
  priceSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    marginBottom: 16,
  },
  processingButton: {
    opacity: 0.7,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});