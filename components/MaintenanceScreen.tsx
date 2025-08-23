import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { useBasic } from '@basictech/expo';

interface MaintenanceScreenProps {
  message: string;
  onAdminAccess?: () => void;
  showAdminAccess?: boolean;
}

export default function MaintenanceScreen({ message, onAdminAccess, showAdminAccess = true }: MaintenanceScreenProps) {
  const { colors } = useTheme();
  const { checkAdminAccess, setAdminStatus, toggleMaintenanceMode } = useMaintenance();
  const { user } = useBasic();

  const styles = createStyles(colors);

  const handleEmergencyDisable = async () => {
    console.log('🚨 EMERGENCY DISABLE PRESSED!');
    Alert.alert(
      '🚨 Emergency Maintenance Disable',
      'This will disable maintenance mode immediately. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disable Now', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚨 Attempting emergency disable...');
              // Force disable maintenance mode
              await toggleMaintenanceMode(false, 'Emergency disable');
              Alert.alert('Success', 'Maintenance mode disabled!');
            } catch (error) {
              console.error('Emergency disable failed:', error);
              Alert.alert('Error', 'Failed to disable maintenance mode.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* EMERGENCY DISABLE BUTTON */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          right: 20,
          backgroundColor: 'red',
          padding: 15,
          zIndex: 99999,
          borderRadius: 8,
        }}
        onPress={handleEmergencyDisable}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
          EMERGENCY{'\n'}DISABLE
        </Text>
      </TouchableOpacity>

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

        {showAdminAccess && onAdminAccess && (
          <TouchableOpacity style={styles.adminButton} onPress={onAdminAccess}>
            <MaterialIcons name="admin-panel-settings" size={20} color={colors.textSecondary} />
            <Text style={styles.adminButtonText}>Admin Access</Text>
          </TouchableOpacity>
        )}

        {/* Additional emergency button in the main content */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ff4444',
            padding: 16,
            borderRadius: 8,
            marginTop: 20,
          }}
          onPress={handleEmergencyDisable}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            🚨 EMERGENCY: DISABLE MAINTENANCE MODE
          </Text>
        </TouchableOpacity>
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
  titleButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  titleButtonPressed: {
    backgroundColor: colors.primary + '20',
  },
  clickCounter: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 24,
    borderRadius: 50,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
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
