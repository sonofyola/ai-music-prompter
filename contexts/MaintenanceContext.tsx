import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBasic } from '@basictech/expo';
import { Platform } from 'react-native';

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
  'drremotework@gmail.com',        // Your admin email
  'admin@aimusicpromptr.com',      // Domain admin email
  // Add more admin emails as needed
];

// Global maintenance state storage key
const MAINTENANCE_STORAGE_KEY = 'global_maintenance_mode';

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, db } = useBasic();
  // FORCE MAINTENANCE MODE FOR TESTING - but don't let it get overridden
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(true);
  const [maintenanceMessage, setMaintenanceMessage] = useState('🚧 TESTING: Maintenance mode is now active! This is a test.');
  const [isAdmin, setIsAdmin] = useState(false);

  // Keep the admin check useEffect
  useEffect(() => {
    // Reset admin status when user changes
    if (isSignedIn && user) {
      checkAdminAccess().catch(error => {
        console.error('Failed to check admin access:', error);
        setIsAdmin(false);
      });
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn, user]);

  // Debug logging
  useEffect(() => {
    console.log('🔧 Maintenance Debug:', {
      isMaintenanceMode,
      isAdmin,
      isSignedIn,
      userEmail: user?.email,
      platform: Platform.OS
    });
  }, [isMaintenanceMode, isAdmin, isSignedIn, user?.email]);

  const checkAdminAccess = async (): Promise<boolean> => {
    try {
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
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
      return false;
    }
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
      console.log('🔍 Loading maintenance state...');
      
      // Try database first (global across all users)
      if (db) {
        try {
          const maintenanceRecords = await db.from('maintenance').getAll();
          if (maintenanceRecords && maintenanceRecords.length > 0) {
            // Get the most recent maintenance record
            const latestRecord = maintenanceRecords.sort((a, b) => b.timestamp - a.timestamp)[0];
            console.log('📊 Latest maintenance record from DB:', latestRecord);
            
            setIsMaintenanceMode(latestRecord.enabled || false);
            setMaintenanceMessage(latestRecord.message || 'We\'re currently performing maintenance. Please check back soon!');
            
            // Also update local storage for faster loading
            const storageData = {
              enabled: latestRecord.enabled,
              message: latestRecord.message,
              timestamp: latestRecord.timestamp
            };
            
            if (Platform.OS === 'web') {
              localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(storageData));
            } else {
              await AsyncStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(storageData));
            }
            
            return;
          }
        } catch (dbError) {
          console.log('⚠️ DB not available, trying local storage:', dbError.message);
        }
      }

      // Fallback to local storage
      let stored = null;
      if (Platform.OS === 'web') {
        stored = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
      } else {
        stored = await AsyncStorage.getItem(MAINTENANCE_STORAGE_KEY);
      }
      
      console.log('💾 Local storage data:', stored);
      
      if (stored) {
        const { enabled, message } = JSON.parse(stored);
        console.log('✅ Parsed maintenance state:', { enabled, message });
        setIsMaintenanceMode(enabled || false);
        setMaintenanceMessage(message || 'We\'re currently performing maintenance. Please check back soon!');
      } else {
        console.log('❌ No maintenance data found, defaulting to disabled');
        setIsMaintenanceMode(false);
      }
    } catch (error) {
      console.error('💥 Error loading maintenance state:', error);
      setIsMaintenanceMode(false); // Safe default
    }
  };

  const toggleMaintenanceMode = async (enabled: boolean, message?: string) => {
    // Only admins can toggle maintenance mode
    if (!isAdmin) {
      throw new Error('Access denied: Admin privileges required.');
    }

    const newMessage = message || maintenanceMessage;
    const timestamp = Date.now();
    
    console.log('🔧 Toggling maintenance mode:', { enabled, newMessage, timestamp });
    
    // Update local state immediately
    setIsMaintenanceMode(enabled);
    setMaintenanceMessage(newMessage);
    
    const maintenanceData = {
      enabled,
      message: newMessage,
      timestamp,
      adminEmail: user?.email || 'unknown'
    };
    
    try {
      // Save to database (global state)
      if (db) {
        try {
          await db.from('maintenance').add(maintenanceData);
          console.log('✅ Saved maintenance state to database');
        } catch (dbError) {
          console.error('⚠️ Failed to save to database:', dbError);
        }
      }

      // Always save to local storage as backup
      const storageData = {
        enabled,
        message: newMessage,
        timestamp
      };
      
      if (Platform.OS === 'web') {
        localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(storageData));
      } else {
        await AsyncStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(storageData));
      }
      
      console.log('✅ Saved maintenance state to local storage');
      
    } catch (error) {
      console.error('💥 Error saving maintenance state:', error);
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
