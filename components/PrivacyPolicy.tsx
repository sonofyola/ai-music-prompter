import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import IconFallback from './IconFallback';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <IconFallback name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.text}>
            AI Music Prompter collects the following information:
          </Text>
          <Text style={styles.bulletPoint}>• Email address (for account creation)</Text>
          <Text style={styles.bulletPoint}>• Music prompts you create (stored locally and in your account)</Text>
          <Text style={styles.bulletPoint}>• Usage analytics (anonymous)</Text>
          <Text style={styles.bulletPoint}>• Device information (for optimization)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.text}>We use your information to:</Text>
          <Text style={styles.bulletPoint}>• Provide and improve our service</Text>
          <Text style={styles.bulletPoint}>• Save your prompt history</Text>
          <Text style={styles.bulletPoint}>• Send important service updates</Text>
          <Text style={styles.bulletPoint}>• Analyze usage patterns to improve the app</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Advertising</Text>
          <Text style={styles.text}>
            AI Music Prompter uses Google AdSense to display advertisements. Google AdSense may use cookies and similar technologies to:
          </Text>
          <Text style={styles.bulletPoint}>• Show personalized ads based on your interests</Text>
          <Text style={styles.bulletPoint}>• Measure ad performance</Text>
          <Text style={styles.bulletPoint}>• Prevent fraud and abuse</Text>
          <Text style={styles.text}>
            You can opt out of personalized advertising by visiting Google's Ad Settings or using browser settings to block cookies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Sharing</Text>
          <Text style={styles.text}>
            We do not sell, trade, or rent your personal information. We may share data with:
          </Text>
          <Text style={styles.bulletPoint}>• Google AdSense (for advertising)</Text>
          <Text style={styles.bulletPoint}>• Analytics providers (anonymous data only)</Text>
          <Text style={styles.bulletPoint}>• Legal authorities (if required by law)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate security measures to protect your information, including encryption and secure data transmission.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.text}>You have the right to:</Text>
          <Text style={styles.bulletPoint}>• Access your personal data</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Delete your account and data</Text>
          <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Cookies</Text>
          <Text style={styles.text}>
            We use cookies and similar technologies to improve your experience and for advertising purposes. You can control cookie settings in your browser.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.text}>
            AI Music Prompter is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.text}>
            If you have questions about this Privacy Policy, contact us at: privacy@aimusicpromptr.com
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
          <Text style={styles.text}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
    marginLeft: 8,
  },
});