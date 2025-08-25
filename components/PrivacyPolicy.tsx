import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/theme';
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
          <Text style={styles.sectionTitle}>3. Advertising & Google AdSense</Text>
          <Text style={styles.text}>
            AI Music Prompter uses Google AdSense to display advertisements. This helps us keep our service free. Here's what you need to know:
          </Text>
          <Text style={styles.bulletPoint}>• Google AdSense uses cookies to show personalized ads based on your interests</Text>
          <Text style={styles.bulletPoint}>• Ad cookies help measure ad performance and prevent fraud</Text>
          <Text style={styles.bulletPoint}>• You can opt out of personalized advertising in your privacy settings</Text>
          <Text style={styles.bulletPoint}>• We do not control the content of third-party advertisements</Text>
          <Text style={styles.bulletPoint}>• Ad revenue helps us maintain and improve our free service</Text>
          <Text style={styles.text}>
            To learn more about Google's advertising practices, visit: https://policies.google.com/technologies/ads
          </Text>
          <Text style={styles.text}>
            You can opt out of personalized advertising by visiting: https://adssettings.google.com/
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Cookies & Tracking Technologies</Text>
          <Text style={styles.text}>We use several types of cookies and similar technologies:</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Necessary Cookies:</Text> Essential for app functionality</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Analytics Cookies:</Text> Help us understand how you use our app</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Advertising Cookies:</Text> Used by Google AdSense for personalized ads</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Preference Cookies:</Text> Remember your settings and preferences</Text>
          <Text style={styles.text}>
            You can control cookie settings through your browser or our privacy settings. Note that disabling certain cookies may affect app functionality.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Third-Party Services</Text>
          <Text style={styles.text}>We work with trusted third-party services:</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Google AdSense:</Text> Advertising platform (privacy policy: https://policies.google.com/privacy)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Google Analytics:</Text> Usage analytics (privacy policy: https://policies.google.com/privacy)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Basic Tech:</Text> Authentication and data storage</Text>
          <Text style={styles.text}>
            These services may collect information according to their own privacy policies. We recommend reviewing their policies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Sharing & Disclosure</Text>
          <Text style={styles.text}>
            We do not sell, trade, or rent your personal information. We may share data in these limited circumstances:
          </Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Google AdSense:</Text> For advertising purposes (anonymous data)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Analytics providers:</Text> Anonymous usage data only</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Legal requirements:</Text> If required by law or to protect our rights</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Business transfers:</Text> In case of merger or acquisition (with notice)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Your Privacy Rights & Choices</Text>
          <Text style={styles.text}>You have several rights regarding your personal information:</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Access:</Text> Request a copy of your personal data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Correction:</Text> Update inaccurate information</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Deletion:</Text> Delete your account and associated data</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Opt-out:</Text> Disable personalized advertising</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Data portability:</Text> Export your data in a readable format</Text>
          <Text style={styles.text}>
            To exercise these rights, contact us at privacy@aimusicpromptr.com or use the settings in your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
          <Text style={styles.text}>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your data during international transfers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Data Retention</Text>
          <Text style={styles.text}>
            We retain your information only as long as necessary to provide our services and comply with legal obligations:
          </Text>
          <Text style={styles.bulletPoint}>• Account data: Until you delete your account</Text>
          <Text style={styles.bulletPoint}>• Usage analytics: Up to 26 months (Google Analytics standard)</Text>
          <Text style={styles.bulletPoint}>• Ad data: As determined by Google AdSense policies</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Children's Privacy (COPPA Compliance)</Text>
          <Text style={styles.text}>
            AI Music Prompter is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
            If we discover we have collected information from a child under 13, we will delete it immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. California Privacy Rights (CCPA)</Text>
          <Text style={styles.text}>
            California residents have additional rights under the California Consumer Privacy Act (CCPA):
          </Text>
          <Text style={styles.bulletPoint}>• Right to know what personal information is collected</Text>
          <Text style={styles.bulletPoint}>• Right to delete personal information</Text>
          <Text style={styles.bulletPoint}>• Right to opt-out of the sale of personal information</Text>
          <Text style={styles.bulletPoint}>• Right to non-discrimination for exercising privacy rights</Text>
          <Text style={styles.text}>
            Note: We do not sell personal information to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. European Privacy Rights (GDPR)</Text>
          <Text style={styles.text}>
            If you are in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
          </Text>
          <Text style={styles.bulletPoint}>• Right to access your personal data</Text>
          <Text style={styles.bulletPoint}>• Right to rectification of inaccurate data</Text>
          <Text style={styles.bulletPoint}>• Right to erasure ("right to be forgotten")</Text>
          <Text style={styles.bulletPoint}>• Right to restrict processing</Text>
          <Text style={styles.bulletPoint}>• Right to data portability</Text>
          <Text style={styles.bulletPoint}>• Right to object to processing</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Contact Us</Text>
          <Text style={styles.text}>
            If you have questions about this Privacy Policy or our privacy practices, contact us:
          </Text>
          <Text style={styles.bulletPoint}>• Email: privacy@aimusicpromptr.com</Text>
          <Text style={styles.bulletPoint}>• Website: https://aimusicpromptr.com/contact</Text>
          <Text style={styles.bulletPoint}>• Address: [Your business address]</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Changes to This Policy</Text>
          <Text style={styles.text}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
            We will notify you of material changes by posting the updated policy on our website and updating the "Last updated" date. 
            Continued use of our service after changes constitutes acceptance of the updated policy.
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
  bold: {
    fontWeight: 'bold',
  },
});
