import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  categoryId?: string;
  sound?: boolean;
  badge?: number;
}

export interface ScheduledNotification extends NotificationData {
  trigger: Notifications.NotificationTriggerInput;
  identifier?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  dailyReminders: boolean;
  promotionalMessages: boolean;
  subscriptionUpdates: boolean;
  newFeatures: boolean;
  reminderTime: string; // HH:MM format
}

const NOTIFICATION_SETTINGS_KEY = 'notification_settings';
const PUSH_TOKEN_KEY = 'push_token';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private pushToken: string | null = null;
  private settings: NotificationSettings = {
    enabled: true,
    dailyReminders: true,
    promotionalMessages: true,
    subscriptionUpdates: true,
    newFeatures: true,
    reminderTime: '10:00'
  };

  async initialize(): Promise<void> {
    try {
      await this.loadSettings();
      await this.setupNotificationCategories();
      
      if (this.settings.enabled) {
        await this.registerForPushNotifications();
        await this.scheduleDailyReminders();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  async loadSettings(): Promise<NotificationSettings> {
    try {
      const settingsData = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (settingsData) {
        this.settings = { ...this.settings, ...JSON.parse(settingsData) };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
    return this.settings;
  }

  async saveSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...settings };
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(this.settings));
      
      // Re-schedule notifications if settings changed
      if (settings.dailyReminders !== undefined || settings.reminderTime) {
        await this.scheduleDailyReminders();
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw error;
    }
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID || 'your-project-id',
      });

      this.pushToken = tokenData.data;
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, this.pushToken);

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('reminders', {
          name: 'Daily Reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
        });

        await Notifications.setNotificationChannelAsync('promotions', {
          name: 'Promotions',
          importance: Notifications.AndroidImportance.LOW,
        });
      }

      console.log('Push token registered:', this.pushToken);
      return this.pushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  async setupNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync('reminder', [
        {
          identifier: 'generate_now',
          buttonTitle: 'Generate Now',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'dismiss',
          buttonTitle: 'Dismiss',
          options: { isDestructive: true },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('subscription', [
        {
          identifier: 'view_subscription',
          buttonTitle: 'View Details',
          options: { opensAppToForeground: true },
        },
      ]);
    } catch (error) {
      console.error('Error setting up notification categories:', error);
    }
  }

  async sendLocalNotification(notification: NotificationData): Promise<string> {
    try {
      if (!this.settings.enabled) {
        console.log('Notifications are disabled');
        return '';
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryId,
          sound: notification.sound !== false,
          badge: notification.badge,
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error sending local notification:', error);
      throw error;
    }
  }

  async scheduleNotification(notification: ScheduledNotification): Promise<string> {
    try {
      if (!this.settings.enabled) {
        console.log('Notifications are disabled');
        return '';
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryId,
          sound: notification.sound !== false,
          badge: notification.badge,
        },
        trigger: notification.trigger,
        identifier: notification.identifier,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async scheduleDailyReminders(): Promise<void> {
    try {
      // Cancel existing daily reminders
      await this.cancelNotificationsByCategory('daily_reminder');

      if (!this.settings.dailyReminders || !this.settings.enabled) {
        return;
      }

      const [hours, minutes] = this.settings.reminderTime.split(':').map(Number);

      // Schedule daily reminder
      await this.scheduleNotification({
        identifier: 'daily_reminder',
        title: '🎵 Ready to create music?',
        body: 'Generate your daily AI music prompts and bring your ideas to life!',
        categoryId: 'reminder',
        data: { type: 'daily_reminder' },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      console.log(`Daily reminder scheduled for ${this.settings.reminderTime}`);
    } catch (error) {
      console.error('Error scheduling daily reminders:', error);
    }
  }

  async sendSubscriptionNotification(
    type: 'upgrade' | 'expiry_warning' | 'expired' | 'cancelled',
    customMessage?: string
  ): Promise<void> {
    if (!this.settings.subscriptionUpdates || !this.settings.enabled) {
      return;
    }

    let title = '';
    let body = '';
    let categoryId = 'subscription';

    switch (type) {
      case 'upgrade':
        title = '🎉 Welcome to Premium!';
        body = customMessage || 'You now have unlimited music prompt generations!';
        break;
      case 'expiry_warning':
        title = '⏰ Subscription Expiring Soon';
        body = customMessage || 'Your premium subscription expires in 3 days. Renew to keep unlimited access!';
        break;
      case 'expired':
        title = '📱 Subscription Expired';
        body = customMessage || 'Your premium subscription has expired. You\'re back to 3 generations per day.';
        break;
      case 'cancelled':
        title = '👋 Subscription Cancelled';
        body = customMessage || 'Your subscription has been cancelled. You can resubscribe anytime!';
        break;
    }

    await this.sendLocalNotification({
      title,
      body,
      categoryId,
      data: { type: 'subscription', subType: type },
    });
  }

  async sendPromotionalNotification(title: string, body: string, data?: Record<string, any>): Promise<void> {
    if (!this.settings.promotionalMessages || !this.settings.enabled) {
      return;
    }

    await this.sendLocalNotification({
      title,
      body,
      data: { type: 'promotional', ...data },
    });
  }

  async sendNewFeatureNotification(featureName: string, description: string): Promise<void> {
    if (!this.settings.newFeatures || !this.settings.enabled) {
      return;
    }

    await this.sendLocalNotification({
      title: `🆕 New Feature: ${featureName}`,
      body: description,
      data: { type: 'new_feature', feature: featureName },
    });
  }

  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  async cancelNotificationsByCategory(category: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const notificationsToCancel = scheduledNotifications.filter(
        notification => notification.content.data?.type === category
      );

      for (const notification of notificationsToCancel) {
        if (notification.identifier) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error cancelling notifications by category:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  getPushToken(): string | null {
    return this.pushToken;
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Usage tracking notifications
  async sendUsageLimitNotification(remaining: number): Promise<void> {
    if (!this.settings.enabled) return;

    if (remaining === 1) {
      await this.sendLocalNotification({
        title: '⚠️ Last Generation Today',
        body: 'You have 1 generation remaining today. Upgrade for unlimited access!',
        data: { type: 'usage_limit', remaining },
      });
    } else if (remaining === 0) {
      await this.sendLocalNotification({
        title: '🚫 Daily Limit Reached',
        body: 'You\'ve used all 3 generations today. Come back tomorrow or upgrade for unlimited!',
        data: { type: 'usage_limit', remaining },
      });
    }
  }
}

export const notificationService = new NotificationService();

// Helper functions for easy integration
export const initializeNotifications = () => notificationService.initialize();

export const sendWelcomeNotification = async (userName?: string) => {
  const name = userName ? ` ${userName}` : '';
  await notificationService.sendLocalNotification({
    title: `🎵 Welcome${name}!`,
    body: 'Start creating amazing AI music prompts. Your creativity awaits!',
    data: { type: 'welcome' },
  });
};

export const sendGenerationCompleteNotification = async (promptTitle?: string) => {
  const title = promptTitle ? ` "${promptTitle}"` : '';
  await notificationService.sendLocalNotification({
    title: '✨ Prompt Generated!',
    body: `Your music prompt${title} is ready to use with AI music tools!`,
    data: { type: 'generation_complete' },
  });
};