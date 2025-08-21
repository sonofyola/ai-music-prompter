import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { notificationService, NotificationSettings } from '../utils/notificationService';

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  sendTestNotification: () => Promise<void>;
  scheduledCount: number;
  pushToken: string | null;
  isInitialized: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    dailyReminders: true,
    promotionalMessages: true,
    subscriptionUpdates: true,
    newFeatures: true,
    reminderTime: '10:00'
  });
  const [scheduledCount, setScheduledCount] = useState(0);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeNotifications();
    if (Platform.OS !== 'web') {
      setupNotificationListeners();
    }
  }, []);

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      const currentSettings = await notificationService.loadSettings();
      setSettings(currentSettings);
      
      const token = notificationService.getPushToken();
      setPushToken(token);
      
      await updateScheduledCount();
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing notifications:', error);
      setIsInitialized(true); // Still mark as initialized even if it fails
    }
  };

  const setupNotificationListeners = () => {
    if (Platform.OS === 'web') {
      return () => {}; // Return empty cleanup function
    }

    // Listen for notifications received while app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      // You can handle foreground notifications here
    });

    // Listen for notification responses (when user taps notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      handleNotificationResponse(response);
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    switch (data?.type) {
      case 'daily_reminder':
        // Navigate to prompt generation screen
        console.log('Navigate to prompt generation');
        break;
      case 'subscription':
        // Navigate to subscription screen
        console.log('Navigate to subscription screen');
        break;
      case 'usage_limit':
        // Navigate to upgrade screen
        console.log('Navigate to upgrade screen');
        break;
      case 'new_feature':
        // Navigate to feature or show info
        console.log('Show new feature info');
        break;
      default:
        console.log('Unknown notification type:', data?.type);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      await notificationService.saveSettings(newSettings);
      const updatedSettings = await notificationService.loadSettings();
      setSettings(updatedSettings);
      await updateScheduledCount();
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  };

  const updateScheduledCount = async () => {
    try {
      const scheduled = await notificationService.getScheduledNotifications();
      setScheduledCount(scheduled.length);
    } catch (error) {
      console.error('Error updating scheduled count:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      await notificationService.sendLocalNotification({
        title: '🧪 Test Notification',
        body: 'This is a test notification from your AI Music Prompt app!',
        data: { type: 'test' },
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  };

  return (
    <NotificationContext.Provider value={{
      settings,
      updateSettings,
      sendTestNotification,
      scheduledCount,
      pushToken,
      isInitialized,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
