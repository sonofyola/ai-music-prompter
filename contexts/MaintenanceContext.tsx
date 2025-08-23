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
  // Start with false, let database override
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('The app is currently under maintenance. Please check back later.');
  const [isAdmin, setIsAdmin] = useState(false);

  // CRITICAL FIX: Load maintenance state for ALL users, not just when db is available
  useEffect(() => {
    console.log('🚀 MAINTENANCE PROVIDER INIT - Starting maintenance provider');
    console.log('🚀 INIT STATE:', { isSignedIn, userEmail: user?.email, hasDb: !!db });
    
    // Try to load from localStorage first (works for all users)
    loadMaintenanceFromStorage();
    
    // If database is available, load from database (authenticated users)
    if (db) {
      console.log('🚀 DB AVAILABLE - Loading from database');
      loadMaintenanceState().catch(error => {
        console.error('Failed to load maintenance state:', error);
      });
    } else {
      console.log('🚀 NO DB - Only using localStorage');
    }
    
    // Check maintenance state every 5 seconds for non-admin users (reduced interval for testing)
    const interval = setInterval(() => {
      if (!isAdmin) {
        console.log('🔄 POLLING - Checking maintenance state (non-admin user)');
        // Try localStorage first, then database if available
        loadMaintenanceFromStorage();
        if (db) {
          loadMaintenanceState().catch(console.error);
        }
      }
    }, 5000); // Reduced to 5 seconds for testing

    return () => {
      console.log('🚀 CLEANUP - Clearing maintenance polling interval');
      clearInterval(interval);
    };
  }, [isAdmin, db]);

  // Keep the admin check useEffect
  useEffect(() => {
    console.log('👤 USER CHANGE - Checking admin access', { isSignedIn, userEmail: user?.email });
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
    console.log('🔧 MAINTENANCE STATE CHANGE:', {
      isMaintenanceMode,
      isAdmin,
      isSignedIn,
      userEmail: user?.email,
      platform: Platform.OS,
      timestamp: new Date().toISOString()
    });
  }, [isMaintenanceMode, isAdmin, isSignedIn, user?.email]);

  // NEW FUNCTION: Load maintenance state from localStorage (works for all users)
  const loadMaintenanceFromStorage = async () => {
    try {
      console.log('💾 STORAGE LOAD - Attempting to load from storage');
      let storageData = null;
      
      if (Platform.OS === 'web') {
        const stored = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
        console.log('💾 WEB STORAGE RAW:', stored);
        storageData = stored ? JSON.parse(stored) : null;
      } else {
        const stored = await AsyncStorage.getItem(MAINTENANCE_STORAGE_KEY);
        console.log('💾 ASYNC STORAGE RAW:', stored);
        storageData = stored ? JSON.parse(stored) : null;
      }
      
      if (storageData) {
        console.log('✅ STORAGE FOUND:', storageData);
        console.log('🔄 UPDATING STATE FROM STORAGE:', {
          currentMaintenance: isMaintenanceMode,
          newMaintenance: storageData.enabled,
          currentMessage: maintenanceMessage,
          newMessage: storageData.message
        });
        
        setIsMaintenanceMode(storageData.enabled || false);
        setMaintenanceMessage(storageData.message || 'The app is currently under maintenance. Please check back later.');
        
        console.log('✅ STATE UPDATED FROM STORAGE');
      } else {
        console.log('❌ NO STORAGE DATA FOUND');
      }
    } catch (error) {
      console.error('❌ STORAGE LOAD ERROR:', error);
    }
  };

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
    
    console.log('🔧 TOGGLE START - Toggling maintenance mode:', { 
      enabled, 
      newMessage, 
      timestamp,
      currentState: isMaintenanceMode,
      isAdmin,
      userEmail: user?.email,
      hasDb: !!db
    });
    
    // Update local state immediately
    setIsMaintenanceMode(enabled);
    setMaintenanceMessage(newMessage);
    
    console.log('🔧 LOCAL STATE UPDATED:', { 
      newIsMaintenanceMode: enabled,
      newMaintenanceMessage: newMessage
    });
    
    const maintenanceData = {
      enabled: enabled,
      message: newMessage,
      timestamp,
      adminEmail: user?.email || 'unknown'
    };
    
    console.log('🔧 MAINTENANCE DATA TO SAVE:', maintenanceData);
    
    try {
      // Save to database (global state)
      if (db) {
        try {
          console.log('🔧 DATABASE SAVE START - Checking existing records...');
          // Get existing records first
          const existingRecords = await db.from('maintenance').getAll();
          console.log('🔧 EXISTING RECORDS FOUND:', existingRecords);
          console.log('🔧 EXISTING RECORDS LENGTH:', existingRecords?.length);
          
          if (existingRecords && existingRecords.length > 0) {
            // Update the first record
            const recordId = existingRecords[0].id;
            console.log('🔧 UPDATING EXISTING RECORD - ID:', recordId);
            console.log('🔧 UPDATE DATA:', maintenanceData);
            
            const updateResult = await db.from('maintenance').update(recordId, maintenanceData);
            console.log('✅ UPDATE RESULT:', updateResult);
            console.log('✅ Updated maintenance state in database');
          } else {
            // Create new record if none exists
            console.log('🔧 CREATING NEW RECORD - No existing records found');
            console.log('🔧 CREATE DATA:', maintenanceData);
            
            const addResult = await db.from('maintenance').add(maintenanceData);
            console.log('✅ CREATE RESULT:', addResult);
            console.log('✅ Created new maintenance state in database');
          }
          
          // Verify the save by reading it back
          console.log('🔧 VERIFICATION - Reading back from database...');
          const verifyRecords = await db.from('maintenance').getAll();
          console.log('🔧 VERIFICATION RESULT:', verifyRecords);
          console.log('🔧 VERIFICATION COUNT:', verifyRecords?.length);
          
        } catch (dbError) {
          console.error('⚠️ DATABASE ERROR - Failed to save to database:', dbError);
          console.error('⚠️ ERROR DETAILS:', {
            name: dbError.name,
            message: dbError.message,
            stack: dbError.stack
          });
        }
      } else {
        console.log('⚠️ NO DATABASE - Database connection not available');
      }

      // Always save to local storage as backup
      const storageData = {
        enabled,
        message: newMessage,
        timestamp
      };
      
      console.log('💾 SAVING TO STORAGE:', storageData);
      
      if (Platform.OS === 'web') {
        localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(storageData));
        console.log('✅ SAVED TO LOCALSTORAGE');
        
        // Verify localStorage save
        const verifyStorage = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
        console.log('💾 LOCALSTORAGE VERIFICATION:', verifyStorage);
      } else {
        await AsyncStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(storageData));
        console.log('✅ SAVED TO ASYNCSTORAGE');
        
        // Verify AsyncStorage save
        const verifyStorage = await AsyncStorage.getItem(MAINTENANCE_STORAGE_KEY);
        console.log('💾 ASYNCSTORAGE VERIFICATION:', verifyStorage);
      }
      
    } catch (error) {
      console.error('💥 TOGGLE ERROR - Error saving maintenance state:', error);
      console.error('💥 ERROR DETAILS:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
    
    console.log('🔧 TOGGLE COMPLETE - Maintenance mode toggle finished');
  };

  const loadMaintenanceState = async () => {
    if (!db) {
      console.log('⚠️ No database connection for loading maintenance state');
      return;
    }
    
    try {
      console.log('🔍 LOAD START - Loading maintenance state from database...');
      
      // Get fresh data from database ONLY - don't use stored data
      const maintenanceRecords = await db.from('maintenance').getAll();
      console.log('📊 LOAD - Database maintenance records:', maintenanceRecords);
      
      if (maintenanceRecords && maintenanceRecords.length > 0) {
        const maintenanceRecord = maintenanceRecords[0];
        console.log('✅ LOAD - Found maintenance record:', maintenanceRecord);
        
        // Use database values directly - match the schema field name
        const dbIsActive = maintenanceRecord.enabled || false;
        const dbMessage = maintenanceRecord.message || 'The app is currently under maintenance. Please check back later.';
        
        console.log('🔧 LOAD - Setting maintenance state from database:', {
          enabled: dbIsActive,
          message: dbMessage,
          currentState: isMaintenanceMode
        });
        
        setIsMaintenanceMode(dbIsActive);
        setMaintenanceMessage(dbMessage);
        
        console.log('🔧 LOAD - State updated to:', {
          isMaintenanceMode: dbIsActive,
          maintenanceMessage: dbMessage
        });

        // CRITICAL: Also update localStorage so non-authenticated users can see it
        const storageData = {
          enabled: dbIsActive,
          message: dbMessage,
          timestamp: Date.now()
        };
        
        if (Platform.OS === 'web') {
          localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(storageData));
        } else {
          await AsyncStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(storageData));
        }
        console.log('💾 Updated storage for non-authenticated users:', storageData);
        
      } else {
        console.log('📝 LOAD - No maintenance records found, defaulting to OFF');
        setIsMaintenanceMode(false);
        setMaintenanceMessage('The app is currently under maintenance. Please check back later.');
      }
    } catch (error) {
      console.error('❌ LOAD - Failed to load maintenance state:', error);
      // On error, don't change current state
    }
    
    console.log('🔍 LOAD COMPLETE');
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
