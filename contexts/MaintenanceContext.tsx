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
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false); // Back to false
  const [maintenanceMessage, setMaintenanceMessage] = useState('The app is currently under maintenance. Please check back later.');
  const [isAdmin, setIsAdmin] = useState(false);

  const loadMaintenanceState = async () => {
    if (!db) return;
    
    try {
      console.log('🔍 Loading maintenance state from database...');
      
      // CLEAR ANY OLD STORED DATA FIRST
      if (Platform.OS === 'web') {
        localStorage.removeItem('maintenanceMode');
        localStorage.removeItem('maintenanceMessage');
        console.log('🧹 Cleared old localStorage data');
      } else {
        await AsyncStorage.removeItem('maintenanceMode');
        await AsyncStorage.removeItem('maintenanceMessage');
        console.log('🧹 Cleared old AsyncStorage data');
      }

      // Get fresh data from database
      const maintenanceRecords = await db.from('maintenance').getAll();
      console.log('📊 Database maintenance records:', maintenanceRecords);
      
      if (maintenanceRecords && maintenanceRecords.length > 0) {
        const maintenanceRecord = maintenanceRecords[0];
        console.log('✅ Found maintenance record:', maintenanceRecord);
        
        setIsMaintenanceMode(maintenanceRecord.isActive || false);
        setMaintenanceMessage(maintenanceRecord.message || 'The app is currently under maintenance. Please check back later.');
        
        console.log('🔧 Updated maintenance state:', {
          isActive: maintenanceRecord.isActive,
          message: maintenanceRecord.message
        });
      } else {
        console.log('📝 No maintenance records found, using defaults');
        setIsMaintenanceMode(false);
        setMaintenanceMessage('The app is currently under maintenance. Please check back later.');
      }
    } catch (error) {
      console.error('❌ Failed to load maintenance state:', error);
      // On error, default to maintenance mode OFF
      setIsMaintenanceMode(false);
    }
  };

  // Restore the useEffect but with cleared storage
  useEffect(() => {
    loadMaintenanceState().catch(error => {
      console.error('Failed to load maintenance state:', error);
    });
    
    // Check maintenance state every 10 seconds for non-admin users
    const interval = setInterval(() => {
      if (!isAdmin) {
        loadMaintenanceState().catch(console.error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isAdmin, db]);

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
