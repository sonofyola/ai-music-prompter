import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBasic } from '@basictech/expo';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  isAdmin: boolean;
  setAdminStatus: (status: boolean) => void;
  toggleMaintenanceMode: (enabled: boolean, message?: string) => Promise<void>;
  checkAdminAccess: () => Promise<boolean>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

// ADMIN EMAIL WHITELIST - Only these emails can access admin features
const ADMIN_EMAILS = [
  'your-admin-email@example.com', // Replace with your actual admin email
  'admin@aimusicpromptr.com',     // Replace with your domain admin email
  // Add more admin emails as needed
];

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useBasic();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('We\'re currently performing maintenance. Please check back soon!');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadMaintenanceState();
  }, []);

  useEffect(() => {
    // Reset admin status when user changes
    if (isSignedIn && user) {
      checkAdminAccess();
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn, user]);

  const checkAdminAccess = async (): Promise<boolean> => {
    if (!user?.email) {
      setIsAdmin(false);
      return false;
    }

    const userEmail = user.email.toLowerCase().trim();
    const hasAdminAccess = ADMIN_EMAILS.some(adminEmail => 
      adminEmail.toLowerCase().trim() === userEmail
    );

    setIsAdmin(hasAdminAccess);
    return hasAdminAccess;
  };

  const setAdminStatus = async (status: boolean) => {
    if (status) {
      // Only allow admin status if user has admin access
      const hasAccess = await checkAdminAccess();
      if (!hasAccess) {
        throw new Error('Access denied: You are not authorized for admin access.');
      }
    }
    setIsAdmin(status);
  };

  const loadMaintenanceState = async () => {
    try {
      const stored = await AsyncStorage.getItem('maintenanceMode');
      if (stored) {
        const { enabled, message } = JSON.parse(stored);
        setIsMaintenanceMode(enabled || false);
        setMaintenanceMessage(message || 'We\'re currently performing maintenance. Please check back soon!');
      }
    } catch (error) {
      console.error('Error loading maintenance state:', error);
    }
  };

  const toggleMaintenanceMode = async (enabled: boolean, message?: string) => {
    // Only admins can toggle maintenance mode
    if (!isAdmin) {
      throw new Error('Access denied: Admin privileges required.');
    }

    const newMessage = message || maintenanceMessage;
    setIsMaintenanceMode(enabled);
    setMaintenanceMessage(newMessage);
    
    try {
      await AsyncStorage.setItem('maintenanceMode', JSON.stringify({
        enabled,
        message: newMessage
      }));
    } catch (error) {
      console.error('Error saving maintenance state:', error);
      throw error;
    }
  };

  return (
    <MaintenanceContext.Provider value={{
      isMaintenanceMode,
      maintenanceMessage,
      isAdmin,
      setAdminStatus,
      toggleMaintenanceMode,
      checkAdminAccess,
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
