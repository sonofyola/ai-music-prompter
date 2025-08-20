import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UsageContextType {
  generationsToday: number;
  isUnlimited: boolean;
  canGenerate: boolean;
  userEmail: string | null;
  isEmailCaptured: boolean;
  subscriptionStatus: 'free' | 'premium' | 'trial';
  subscriptionExpiry: string | null;
  incrementGeneration: () => Promise<void>;
  upgradeToUnlimited: () => Promise<void>;
  resetDailyCount: () => Promise<void>;
  setUserEmail: (email: string) => Promise<void>;
}

const DAILY_LIMIT = 3;
const USAGE_KEY = 'usage_data';
const EMAIL_KEY = 'user_email';
const SUBSCRIPTION_KEY = 'subscription_data';

// Developer emails that get unlimited access automatically
const DEVELOPER_EMAILS = [
  'test@admin.com',        // Test admin email for preview
  'admin@example.com',     // Another test email
  'developer@test.com',    // Add more as needed
];

interface UsageData {
  generationsToday: number;
  lastResetDate: string;
  isUnlimited: boolean;
}

interface SubscriptionData {
  status: 'free' | 'premium' | 'trial';
  expiry: string | null;
  amount: number | null;
  billing_cycle: string | null;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [generationsToday, setGenerationsToday] = useState(0);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [userEmail, setUserEmailState] = useState<string | null>(null);
  const [isEmailCaptured, setIsEmailCaptured] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'premium' | 'trial'>('free');
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null);

  useEffect(() => {
    loadUsageData();
    loadUserEmail();
    loadSubscriptionData();
  }, []);

  // Check if user is a developer/admin
  const isDeveloperEmail = (email: string): boolean => {
    return DEVELOPER_EMAILS.includes(email.toLowerCase().trim());
  };

  const loadSubscriptionData = async () => {
    try {
      const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      if (data) {
        const subscriptionData: SubscriptionData = JSON.parse(data);
        setSubscriptionStatus(subscriptionData.status);
        setSubscriptionExpiry(subscriptionData.expiry);
        
        // Check if subscription is still valid
        if (subscriptionData.status === 'premium' && subscriptionData.expiry) {
          const expiryDate = new Date(subscriptionData.expiry);
          const now = new Date();
          
          if (now > expiryDate) {
            // Subscription expired, revert to free
            setSubscriptionStatus('free');
            setIsUnlimited(false);
            await saveSubscriptionData('free', null, null, null);
          } else {
            // Subscription is active
            setIsUnlimited(true);
          }
        }
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
    }
  };

  const saveSubscriptionData = async (
    status: 'free' | 'premium' | 'trial',
    expiry: string | null,
    amount: number | null,
    billing_cycle: string | null
  ) => {
    try {
      const subscriptionData: SubscriptionData = {
        status,
        expiry,
        amount,
        billing_cycle,
      };
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscriptionData));
    } catch (error) {
      console.error('Error saving subscription data:', error);
    }
  };

  const loadUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem(EMAIL_KEY);
      if (email) {
        setUserEmailState(email);
        setIsEmailCaptured(true);
        
        // Check if user is manually upgraded to unlimited
        const unlimitedEmails = await AsyncStorage.getItem('unlimited_emails');
        const emailList: string[] = unlimitedEmails ? JSON.parse(unlimitedEmails) : [];
        const isManuallyUpgraded = emailList.includes(email.toLowerCase().trim());
        
        // Auto-upgrade developers or manually upgraded users to unlimited
        if (isDeveloperEmail(email) || isManuallyUpgraded) {
          console.log('Unlimited access detected for:', email);
          setIsUnlimited(true);
          await saveUsageData(0, new Date().toDateString(), true);
        }
      }
    } catch (error) {
      console.error('Error loading user email:', error);
    }
  };

  const setUserEmail = async (email: string) => {
    try {
      await AsyncStorage.setItem(EMAIL_KEY, email);
      setUserEmailState(email);
      setIsEmailCaptured(true);
      
      // Check if user is manually upgraded to unlimited
      const unlimitedEmails = await AsyncStorage.getItem('unlimited_emails');
      const emailList: string[] = unlimitedEmails ? JSON.parse(unlimitedEmails) : [];
      const isManuallyUpgraded = emailList.includes(email.toLowerCase().trim());
      
      // Auto-upgrade developers or manually upgraded users to unlimited
      if (isDeveloperEmail(email) || isManuallyUpgraded) {
        console.log('Unlimited access detected for:', email);
        setIsUnlimited(true);
        await saveUsageData(generationsToday, new Date().toDateString(), true);
      }
    } catch (error) {
      console.error('Error saving user email:', error);
    }
  };

  const loadUsageData = async () => {
    try {
      const data = await AsyncStorage.getItem(USAGE_KEY);
      if (data) {
        const usageData: UsageData = JSON.parse(data);
        const today = new Date().toDateString();
        
        if (usageData.lastResetDate !== today) {
          // Reset daily count for new day
          setGenerationsToday(0);
          await saveUsageData(0, today, usageData.isUnlimited);
        } else {
          setGenerationsToday(usageData.generationsToday);
          setIsUnlimited(usageData.isUnlimited);
        }
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
    }
  };

  const saveUsageData = async (generations: number, date: string, unlimited: boolean) => {
    try {
      const usageData: UsageData = {
        generationsToday: generations,
        lastResetDate: date,
        isUnlimited: unlimited,
      };
      await AsyncStorage.setItem(USAGE_KEY, JSON.stringify(usageData));
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  };

  const incrementGeneration = async () => {
    if (isUnlimited || generationsToday < DAILY_LIMIT) {
      const newCount = generationsToday + 1;
      setGenerationsToday(newCount);
      await saveUsageData(newCount, new Date().toDateString(), isUnlimited);
    }
  };

  const upgradeToUnlimited = async () => {
    setIsUnlimited(true);
    setSubscriptionStatus('premium');
    
    // Set expiry to 1 month from now
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const expiryString = expiryDate.toISOString();
    
    setSubscriptionExpiry(expiryString);
    
    await saveUsageData(generationsToday, new Date().toDateString(), true);
    await saveSubscriptionData('premium', expiryString, 5.99, 'monthly');
  };

  const resetDailyCount = async () => {
    setGenerationsToday(0);
    await saveUsageData(0, new Date().toDateString(), isUnlimited);
  };

  const canGenerate = isUnlimited || generationsToday < DAILY_LIMIT;

  return (
    <UsageContext.Provider value={{
      generationsToday,
      isUnlimited,
      canGenerate,
      userEmail,
      isEmailCaptured,
      subscriptionStatus,
      subscriptionExpiry,
      incrementGeneration,
      upgradeToUnlimited,
      resetDailyCount,
      setUserEmail,
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
