import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { useUsage } from '../contexts/UsageContext';
import EmailCapture from './EmailCapture';

interface EmailCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onEmailSubmitted: (email: string) => void;
}

export default function EmailCaptureModal({ visible, onClose, onEmailSubmitted }: EmailCaptureModalProps) {
  const { colors } = useTheme();
  const { setEmailCaptured } = useUsage();

  const handleEmailSubmit = async (email: string) => {
    await setEmailCaptured(true);
    onEmailSubmitted(email);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <EmailCapture onEmailSubmitted={handleEmailSubmit} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
});
