import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { notificationService, NotificationSettings as NotificationSettingsType } from '../utils/notificationService';

export default function NotificationSettings() {
  const { colors } = useTheme();
  const [settings, setSettings] = useState<NotificationSettingsType>({
    enabled: true,
    dailyReminders: true,
    promotionalMessages: true,
    subscriptionUpdates: true,
    newFeatures: true,
    reminderTime: '10:00'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {
    loadSettings();
    loadNotificationInfo();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await notificationService.loadSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const loadNotificationInfo = async () => {
    try {
      const token = notificationService.getPushToken();
      setPushToken(token);
      
      const scheduled = await notificationService.getScheduledNotifications();
      setScheduledCount(scheduled.length);
    } catch (error) {
      console.error('Error loading notification info:', error);
    }
  };

  const handleSettingChange = async (key: keyof NotificationSettingsType, value: any) => {
    setIsLoading(true);
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await notificationService.saveSettings({ [key]: value });
      
      if (key === 'enabled' && !value) {
        await notificationService.cancelAllNotifications();
        setScheduledCount(0);
      } else if (key === 'enabled' && value) {
        await notificationService.initialize();
        await loadNotificationInfo();
      }
      
      await loadNotificationInfo();
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = () => {
    Alert.prompt(
      'Set Reminder Time',
      'Enter time in HH:MM format (24-hour)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set',
          onPress: async (time) => {
            if (time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
              await handleSettingChange('reminderTime', time);
            } else {
              Alert.alert('Invalid Time', 'Please enter time in HH:MM format (e.g., 10:30)');
            }
          }
        }
      ],
      'plain-text',
      settings.reminderTime
    );
  };

  const sendTestNotification = async () => {
    try {
      await notificationService.sendLocalNotification({
        title: '🧪 Test Notification',
        body: 'This is a test notification from your AI Music Prompt app!',
        data: { type: 'test' },
      });
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const registerPushNotifications = async () => {
    setIsLoading(true);
    try {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        setPushToken(token);
        Alert.alert('Success', 'Push notifications registered successfully!');
      } else {
        Alert.alert('Failed', 'Could not register for push notifications. Make sure you\'re on a physical device and have granted permissions.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register for push notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllNotifications = async () => {
    Alert.alert(
      'Clear All Notifications',
      'This will cancel all scheduled notifications. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.cancelAllNotifications();
              await notificationService.clearBadge();
              setScheduledCount(0);
              Alert.alert('Success', 'All notifications cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear notifications');
            }
          }
        }
      ]
    );
  };

  const copyPushToken = () => {
    if (pushToken) {
      // In a real app, you'd use Clipboard API
      Alert.alert('Push Token', pushToken, [
        { text: 'OK' }
      ]);
    }
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialIcons name="notifications" size={24} color={colors.primary} />
        <Text style={styles.title}>Notification Settings</Text>
      </View>

      {/* Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusCard}>
            <MaterialIcons 
              name={settings.enabled ? "notifications-active" : "notifications-off"} 
              size={24} 
              color={settings.enabled ? colors.success : colors.textSecondary} 
            />
            <Text style={styles.statusLabel}>
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          
          <View style={styles.statusCard}>
            <MaterialIcons name="schedule" size={24} color={colors.primary} />
            <Text style={styles.statusNumber}>{scheduledCount}</Text>
            <Text style={styles.statusLabel}>Scheduled</Text>
          </View>
          
          <View style={styles.statusCard}>
            <MaterialIcons 
              name={pushToken ? "cloud-done" : "cloud-off"} 
              size={24} 
              color={pushToken ? colors.success : colors.textSecondary} 
            />
            <Text style={styles.statusLabel}>
              {pushToken ? 'Registered' : 'Not Registered'}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="notifications" size={20} color={colors.text} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Allow the app to send notifications
              </Text>
            </View>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={(value) => handleSettingChange('enabled', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.enabled ? '#fff' : colors.textSecondary}
            disabled={isLoading}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="alarm" size={20} color={colors.text} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Daily Reminders</Text>
              <Text style={styles.settingDescription}>
                Get reminded to create music prompts
              </Text>
            </View>
          </View>
          <Switch
            value={settings.dailyReminders}
            onValueChange={(value) => handleSettingChange('dailyReminders', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.dailyReminders ? '#fff' : colors.textSecondary}
            disabled={isLoading || !settings.enabled}
          />
        </View>

        {settings.dailyReminders && (
          <TouchableOpacity style={styles.timeButton} onPress={handleTimeChange}>
            <MaterialIcons name="access-time" size={20} color={colors.primary} />
            <Text style={styles.timeButtonText}>
              Reminder Time: {settings.reminderTime}
            </Text>
            <MaterialIcons name="edit" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Notification Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="card-membership" size={20} color={colors.text} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Subscription Updates</Text>
              <Text style={styles.settingDescription}>
                Notifications about your subscription status
              </Text>
            </View>
          </View>
          <Switch
            value={settings.subscriptionUpdates}
            onValueChange={(value) => handleSettingChange('subscriptionUpdates', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.subscriptionUpdates ? '#fff' : colors.textSecondary}
            disabled={isLoading || !settings.enabled}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="new-releases" size={20} color={colors.text} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>New Features</Text>
              <Text style={styles.settingDescription}>
                Get notified about new app features
              </Text>
            </View>
          </View>
          <Switch
            value={settings.newFeatures}
            onValueChange={(value) => handleSettingChange('newFeatures', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.newFeatures ? '#fff' : colors.textSecondary}
            disabled={isLoading || !settings.enabled}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="local-offer" size={20} color={colors.text} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Promotional Messages</Text>
              <Text style={styles.settingDescription}>
                Special offers and promotions
              </Text>
            </View>
          </View>
          <Switch
            value={settings.promotionalMessages}
            onValueChange={(value) => handleSettingChange('promotionalMessages', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.promotionalMessages ? '#fff' : colors.textSecondary}
            disabled={isLoading || !settings.enabled}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonPrimary]}
          onPress={sendTestNotification}
          disabled={isLoading || !settings.enabled}
        >
          <MaterialIcons name="send" size={16} color="#fff" />
          <Text style={styles.buttonText}>Send Test Notification</Text>
        </TouchableOpacity>

        {!pushToken && Platform.OS !== 'web' && (
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]}
            onPress={registerPushNotifications}
            disabled={isLoading}
          >
            <MaterialIcons name="cloud-upload" size={16} color={colors.primary} />
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              {isLoading ? 'Registering...' : 'Register Push Notifications'}
            </Text>
          </TouchableOpacity>
        )}

        {scheduledCount > 0 && (
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]}
            onPress={clearAllNotifications}
            disabled={isLoading}
          >
            <MaterialIcons name="clear-all" size={16} color={colors.warning} />
            <Text style={[styles.buttonText, { color: colors.warning }]}>
              Clear All Notifications
            </Text>
          </TouchableOpacity>
        )}

        {pushToken && (
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]}
            onPress={copyPushToken}
          >
            <MaterialIcons name="content-copy" size={16} color={colors.textSecondary} />
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              View Push Token
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    gap: 4,
  },
  statusNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  timeButtonText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
});