import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UsageContextType {
  generationsToday: number;
  isUnlimited: boolean;
  canGenerate: boolean;
  incrementGeneration: () => Promise<void>;
  upgradeToUnlimited: () => Promise<void>;
  resetDailyCount: () => Promise<void>;
}

const DAILY_LIMIT = 3;
const USAGE_KEY = 'usage_data';

interface UsageData {
  generationsToday: number;
  lastResetDate: string;
  isUnlimited: boolean;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [generationsToday, setGenerationsToday] = useState(0);
  const [isUnlimited, setIsUnlimited] = useState(false);

  useEffect(() => {
    loadUsageData();
  }, []);

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
    await saveUsageData(generationsToday, new Date().toDateString(), true);
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
      incrementGeneration,
      upgradeToUnlimited,
      resetDailyCount,
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