import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBasic } from '@basictech/expo';

interface UsageContextType {
  dailyUsage: number;
  canGenerate: boolean;
  isEmailCaptured: boolean;
  subscriptionStatus: 'free' | 'premium' | 'unlimited';
  incrementGeneration: () => Promise<void>;
  setEmailCaptured: (captured: boolean) => void;
  upgradeToUnlimited: () => Promise<void>;
  resetUsage: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

const DAILY_FREE_LIMIT = 3;

// Admin emails - these users get unlimited access automatically
const ADMIN_EMAILS = ['ibeme8@gmail.com', 'drremotework@gmail.com', 'sonofyola@gmail.com'];

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const { user, db, isSignedIn } = useBasic();
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isEmailCaptured, setIsEmailCaptured] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'premium' | 'unlimited'>('free');

  // Check if current user is admin
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  const loadLocalUsage = useCallback(async () => {
    try {
      const today = new Date().toDateString();
      const lastUsageDate = await AsyncStorage.getItem('lastUsageDate');
      const storedUsage = await AsyncStorage.getItem('dailyUsage');
      const emailCaptured = await AsyncStorage.getItem('emailCaptured');

      if (lastUsageDate !== today) {
        setDailyUsage(0);
        await AsyncStorage.setItem('lastUsageDate', today);
        await AsyncStorage.setItem('dailyUsage', '0');
      } else {
        setDailyUsage(parseInt(storedUsage || '0', 10));
      }

      setIsEmailCaptured(emailCaptured === 'true');
    } catch (error) {
      console.error('Error loading local usage:', error);
    }
  }, []);

  const loadUserUsage = useCallback(async () => {
    if (!db || !user) return;

    try {
      const userProfile = await db.from('user_profiles').get(user.id);
      if (userProfile) {
        const today = new Date().toDateString();
        const lastResetDate = new Date(String(userProfile.last_reset_date)).toDateString();
        
        if (today !== lastResetDate) {
          // Reset daily usage for new day
          await db.from('user_profiles').update(user.id, {
            usage_count: 0,
            last_reset_date: new Date().toISOString(),
          });
          setDailyUsage(0);
        } else {
          setDailyUsage(Number(userProfile.usage_count) || 0);
        }
        
        // Set subscription status - admins get unlimited automatically
        let status = String(userProfile.subscription_status) as 'free' | 'premium' | 'unlimited';
        if (isAdmin) {
          status = 'unlimited';
          // Update admin status in database if not already set
          if (userProfile.subscription_status !== 'unlimited') {
            await db.from('user_profiles').update(user.id, {
              subscription_status: 'unlimited',
            });
          }
        }
        setSubscriptionStatus(status || 'free');
        
        setIsEmailCaptured(true); // Authenticated users have email
      } else {
        // Create new user profile if it doesn't exist
        const initialStatus = isAdmin ? 'unlimited' : 'free';
        await db.from('user_profiles').add({
          email: user.email || '',
          subscription_status: initialStatus,
          usage_count: 0,
          last_reset_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          stripe_customer_id: '',
        });
        setDailyUsage(0);
        setSubscriptionStatus(initialStatus);
        setIsEmailCaptured(true);
      }
    } catch (error) {
      console.error('Error loading user usage:', error);
      // Fall back to local storage on database error
      await loadLocalUsage();
    }
  }, [db, user, loadLocalUsage, isAdmin]);

  useEffect(() => {
    if (isSignedIn && user && db) {
      loadUserUsage().catch(error => {
        console.error('Failed to load user usage, falling back to local storage:', error);
        loadLocalUsage();
      });
    } else {
      // Fallback to local storage for non-authenticated users
      loadLocalUsage();
    }
  }, [isSignedIn, user, db, loadUserUsage, loadLocalUsage]);

  // Auto-upgrade admins on login
  useEffect(() => {
    if (isAdmin && subscriptionStatus !== 'unlimited') {
      setSubscriptionStatus('unlimited');
    }
  }, [isAdmin, subscriptionStatus]);

  const incrementGeneration = async () => {
    // Admins don't need to track usage, but we'll still increment for analytics
    const newUsage = dailyUsage + 1;
    setDailyUsage(newUsage);

    if (isSignedIn && user && db) {
      // Update user profile in database
      try {
        await db.from('user_profiles').update(user.id, {
          usage_count: newUsage,
        });
      } catch (error) {
        console.error('Error updating user usage:', error);
      }
    } else {
      // Update local storage
      try {
        await AsyncStorage.setItem('dailyUsage', newUsage.toString());
      } catch (error) {
        console.error('Error updating local usage:', error);
      }
    }
  };

  const setEmailCaptured = async (captured: boolean) => {
    setIsEmailCaptured(captured);
    if (!isSignedIn) {
      try {
        await AsyncStorage.setItem('emailCaptured', captured.toString());
      } catch (error) {
        console.error('Error setting email captured:', error);
      }
    }
  };

  const upgradeToUnlimited = async () => {
    setSubscriptionStatus('unlimited');
    
    if (isSignedIn && user && db) {
      try {
        await db.from('user_profiles').update(user.id, {
          subscription_status: 'unlimited',
        });
      } catch (error) {
        console.error('Error upgrading user:', error);
      }
    }
  };

  const resetUsage = async () => {
    setDailyUsage(0);
    
    if (isSignedIn && user && db) {
      try {
        await db.from('user_profiles').update(user.id, {
          usage_count: 0,
          last_reset_date: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error resetting user usage:', error);
      }
    } else {
      try {
        await AsyncStorage.setItem('dailyUsage', '0');
        await AsyncStorage.setItem('lastUsageDate', new Date().toDateString());
      } catch (error) {
        console.error('Error resetting local usage:', error);
      }
    }
  };

  const clearAllData = async () => {
    console.log('🔄 UsageContext: Clearing all data...');
    
    // Reset all state to defaults
    setDailyUsage(0);
    setIsEmailCaptured(false);
    setSubscriptionStatus(isAdmin ? 'unlimited' : 'free');
    
    // Clear AsyncStorage
    try {
      await AsyncStorage.multiRemove([
        'dailyUsage',
        'lastUsageDate',
        'emailCaptured'
      ]);
      console.log('✅ UsageContext: AsyncStorage cleared');
    } catch (error) {
      console.error('❌ UsageContext: Error clearing AsyncStorage:', error);
    }
  };

  // Check if user can generate - admins always can, others based on subscription/limits
  const canGenerate = isAdmin || subscriptionStatus === 'unlimited' || dailyUsage < DAILY_FREE_LIMIT;

  return (
    <UsageContext.Provider value={{
      dailyUsage,
      canGenerate,
      isEmailCaptured,
      subscriptionStatus,
      incrementGeneration,
      setEmailCaptured,
      upgradeToUnlimited,
      resetUsage,
      clearAllData,
    }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
}
