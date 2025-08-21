import React, { createContext, useContext, useEffect, useState } from 'react';
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
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

const DAILY_FREE_LIMIT = 3;

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const { user, db, isSignedIn } = useBasic();
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isEmailCaptured, setIsEmailCaptured] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'premium' | 'unlimited'>('free');

  useEffect(() => {
    if (isSignedIn && user && db) {
      loadUserUsage();
    } else {
      // Fallback to local storage for non-authenticated users
      loadLocalUsage();
    }
  }, [isSignedIn, user, db]);

  const loadUserUsage = async () => {
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
        
        const status = String(userProfile.subscription_status) as 'free' | 'premium' | 'unlimited';
        setSubscriptionStatus(status || 'free');
        setIsEmailCaptured(true); // Authenticated users have email
      }
    } catch (error) {
      console.error('Error loading user usage:', error);
    }
  };

  const loadLocalUsage = async () => {
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
  };

  const incrementGeneration = async () => {
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

  const canGenerate = subscriptionStatus === 'unlimited' || dailyUsage < DAILY_FREE_LIMIT;

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
