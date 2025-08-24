// Stub notification service - notifications have been removed
export interface NotificationSettings {
  enabled: boolean;
  dailyReminders: boolean;
  promotionalMessages: boolean;
  subscriptionUpdates: boolean;
  newFeatures: boolean;
  reminderTime: string;
}

class NotificationService {
  async initialize(): Promise<void> {
    console.log('Notifications disabled');
  }

  async loadSettings(): Promise<NotificationSettings> {
    return {
      enabled: false,
      dailyReminders: false,
      promotionalMessages: false,
      subscriptionUpdates: false,
      newFeatures: false,
      reminderTime: '10:00'
    };
  }

  async saveSettings(settings: Partial<NotificationSettings>): Promise<void> {
    console.log('Notifications disabled - settings not saved');
  }

  async sendLocalNotification(notification: any): Promise<string> {
    console.log('Notifications disabled - notification not sent');
    return '';
  }

  async getScheduledNotifications(): Promise<any[]> {
    return [];
  }

  async cancelAllNotifications(): Promise<void> {
    console.log('Notifications disabled - nothing to cancel');
  }

  getPushToken(): string | null {
    return null;
  }

  getSettings(): NotificationSettings {
    return {
      enabled: false,
      dailyReminders: false,
      promotionalMessages: false,
      subscriptionUpdates: false,
      newFeatures: false,
      reminderTime: '10:00'
    };
  }
}

export const notificationService = new NotificationService();

// Helper functions for backward compatibility
export const initializeNotifications = () => console.log('Notifications disabled');
export const sendWelcomeNotification = async () => console.log('Notifications disabled');
export const sendGenerationCompleteNotification = async () => console.log('Notifications disabled');