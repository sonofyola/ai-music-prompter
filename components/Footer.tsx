import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

export default function Footer() {
  const { colors } = useTheme();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const styles = createStyles(colors);

  return (
    <>
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.copyright}>
            © 2024 AI Music Prompter. All rights reserved.
          </Text>
          
          <View style={styles.links}>
            <TouchableOpacity onPress={() => setShowPrivacy(true)}>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
            
            <Text style={styles.separator}>•</Text>
            
            <TouchableOpacity onPress={() => setShowTerms(true)}>
              <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
            
            <Text style={styles.separator}>•</Text>
            
            <TouchableOpacity onPress={() => {/* Handle contact */}}>
              <Text style={styles.link}>Contact</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.disclaimer}>
            AI Music Prompter helps create prompts for AI music tools. We are not affiliated with Suno AI, Udio, or MusicGen.
          </Text>
        </View>
      </View>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacy}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTerms}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <TermsOfService onClose={() => setShowTerms(false)} />
      </Modal>
    </>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  footerContent: {
    maxWidth: 800,
    alignSelf: 'center',
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  link: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  separator: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 600,
  },
});
