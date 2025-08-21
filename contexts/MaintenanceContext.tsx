import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  isAdmin: boolean;
  toggleMaintenanceMode: (enabled: boolean, message?: string) => Promise<void>;
  setAdminStatus: (isAdmin: boolean) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

const MAINTENANCE_MODE_KEY = 'maintenance_mode';
const MAINTENANCE_MESSAGE_KEY = 'maintenance_message';
const ADMIN_STATUS_KEY = 'admin_status';

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('We\'re currently performing maintenance to improve your experience. Please check back soon!');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadMaintenanceSettings();
  }, []);

  const loadMaintenanceSettings = async () => {
    try {
      const [maintenanceEnabled, message, adminStatus] = await Promise.all([
        AsyncStorage.getItem(MAINTENANCE_MODE_KEY),
        AsyncStorage.getItem(MAINTENANCE_MESSAGE_KEY),
        AsyncStorage.getItem(ADMIN_STATUS_KEY)
      ]);

      if (maintenanceEnabled !== null) {
        setIsMaintenanceMode(JSON.parse(maintenanceEnabled));
      }

      if (message) {
        setMaintenanceMessage(message);
      }

      if (adminStatus !== null) {
        setIsAdmin(JSON.parse(adminStatus));
      }
    } catch (error) {
      console.error('Error loading maintenance settings:', error);
    }
  };

  const toggleMaintenanceMode = async (enabled: boolean, message?: string) => {
    try {
      await AsyncStorage.setItem(MAINTENANCE_MODE_KEY, JSON.stringify(enabled));
      setIsMaintenanceMode(enabled);

      if (message) {
        await AsyncStorage.setItem(MAINTENANCE_MESSAGE_KEY, message);
        setMaintenanceMessage(message);
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      throw error;
    }
  };

  const setAdminStatus = async (adminStatus: boolean) => {
    try {
      await AsyncStorage.setItem(ADMIN_STATUS_KEY, JSON.stringify(adminStatus));
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error setting admin status:', error);
    }
  };

  return (
    <MaintenanceContext.Provider value={{
      isMaintenanceMode,
      maintenanceMessage,
      isAdmin,
      toggleMaintenanceMode,
      setAdminStatus,
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}