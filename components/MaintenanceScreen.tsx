import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface MaintenanceScreenProps {
  message: string;
  onAdminAccess?: () => void;
}

export default function MaintenanceScreen({ message, onAdminAccess }: MaintenanceScreenProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="build" size={80} color={colors.primary} />
        </View>
        
        <Text style={styles.title}>Under Maintenance</Text>
        
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <MaterialIcons name="update" size={24} color={colors.success} />
            <Text style={styles.featureText}>System Updates</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="security" size={24} color={colors.success} />
            <Text style={styles.featureText}>Security Improvements</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="speed" size={24} color={colors.success} />
            <Text style={styles.featureText}>Performance Enhancements</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          We appreciate your patience while we make AI Music Prompter even better!
        </Text>

        {onAdminAccess && (
          <TouchableOpacity style={styles.adminButton} onPress={onAdminAccess}>
            <MaterialIcons name="admin-panel-settings" size={20} color={colors.textSecondary} />
            <Text style={styles.adminButtonText}>Admin Access</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Follow us for updates: @aimusicpromptr
        </Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 32,
    padding: 24,
    borderRadius: 50,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 400,
  },
  features: {
    gap: 16,
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adminButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});