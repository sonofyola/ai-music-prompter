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
  const [titlePressCount, setTitlePressCount] = useState(0);

  const styles = createStyles(colors);

  const handleTitlePress = async () => {
    console.log('🔥 MAINTENANCE TITLE PRESSED! Count:', titlePressCount + 1);
    console.log('🔥 Current user email:', user?.email);
    
    setTitlePressCount(prev => {
      const newCount = prev + 1;
      console.log('🔥 New count:', newCount);
      
      if (newCount === 7) {
        console.log('🔥🔥🔥 7 CLICKS REACHED ON MAINTENANCE SCREEN! Checking admin access...');
        checkAdminAccessHandler();
        return 0; // Reset counter
      }
      
      // Reset counter after 3 seconds of no presses
      setTimeout(() => {
        console.log('🔥 Resetting maintenance title press counter');
        setTitlePressCount(0);
      }, 3000);
      
      return newCount;
    });
  };

  const checkAdminAccessHandler = async () => {
    console.log('🚀 === ADMIN ACCESS CHECK FROM MAINTENANCE SCREEN ===');
    console.log('🚀 Checking admin access for user:', user?.email);
    
    try {
      const hasAccess = await checkAdminAccess();
      console.log('🚀 Admin access result:', hasAccess);
      
      if (hasAccess) {
        console.log('✅ Admin access granted from maintenance screen!');
        await setAdminStatus(true);
        
        Alert.alert(
          '🔓 Admin Access Granted',
          `Welcome, admin! You now have access to administrative features.\n\nEmail: ${user?.email}\n\nMaintenance mode is currently ACTIVE. Would you like to disable it?`,
          [
            { text: 'Keep Maintenance Mode', style: 'cancel' },
            { 
              text: 'Disable Maintenance Mode', 
              style: 'destructive',
              onPress: async () => {
                try {
                  await toggleMaintenanceMode(false, 'Maintenance completed');
                  Alert.alert('Success', 'Maintenance mode has been disabled. The app is now accessible to all users.');
                } catch (error) {
                  console.error('Failed to disable maintenance mode:', error);
                  Alert.alert('Error', 'Failed to disable maintenance mode.');
                }
              }
            }
          ]
        );
      } else {
        console.log('❌ Admin access denied from maintenance screen');
        Alert.alert(
          '🚫 Access Denied',
          `You are not authorized for admin access.\n\nYour email: ${user?.email}\nOnly whitelisted email addresses can access admin features.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Admin access error from maintenance screen:', error);
      Alert.alert('Error', `Failed to check admin access: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={handleTitlePress}
          style={[styles.titleButton, titlePressCount > 0 && styles.titleButtonPressed]}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="build" size={80} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Under Maintenance</Text>
          {titlePressCount > 0 && (
            <Text style={styles.clickCounter}>({titlePressCount}/7)</Text>
          )}
        </TouchableOpacity>
        
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
