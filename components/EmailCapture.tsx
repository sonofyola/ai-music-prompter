import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { collectEmail } from '../utils/emailService';
import { useTheme } from '../utils/theme';

interface EmailCaptureProps {
  onEmailSubmitted: (email: string) => void;
}

export default function EmailCapture({ onEmailSubmitted }: EmailCaptureProps) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to continue.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Collect email via API
      await collectEmail({
        email: email.trim(),
        tier: 'free',
        timestamp: new Date().toISOString(),
        source: 'registration'
      });

      // Email collection succeeded
      onEmailSubmitted(email);
    } catch (error) {
      console.error('Email submission error:', error);
      // Don't block user if email collection fails
      onEmailSubmitted(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="music-note" size={64} color={colors.primary} />
          <Text style={styles.title}>AI Music Prompt Generator</Text>
          <Text style={styles.subtitle}>
            Create optimized prompts for AI music tools like Suno, Riffusion, and MusicGen
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Get Started</Text>
          <Text style={styles.formSubtitle}>
            Enter your email to start generating music prompts
          </Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submittingButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Getting Started...</Text>
            ) : (
              <>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Start Creating</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.benefits}>
            <View style={styles.benefit}>
              <MaterialIcons name="check" size={16} color={colors.success} />
              <Text style={styles.benefitText}>3 free generations daily</Text>
            </View>
            <View style={styles.benefit}>
              <MaterialIcons name="check" size={16} color={colors.success} />
              <Text style={styles.benefitText}>No credit card required</Text>
            </View>
            <View style={styles.benefit}>
              <MaterialIcons name="check" size={16} color={colors.success} />
              <Text style={styles.benefitText}>Upgrade anytime for unlimited</Text>
            </View>
          </View>

          <Text style={styles.disclaimer}>
            We respect your privacy. Your email will only be used for product updates and support.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 32,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 24,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 16,
    paddingLeft: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    marginBottom: 24,
  },
  submittingButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  benefits: {
    marginBottom: 24,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
