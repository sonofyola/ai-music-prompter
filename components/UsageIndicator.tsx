import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBasic } from '@basictech/expo';

interface UsageIndicatorProps {
  onUpgradePress?: () => void;
  refreshTrigger?: number;
}

export default function UsageIndicator({ onUpgradePress, refreshTrigger }: UsageIndicatorProps) {
  const { user } = useBasic();
  const [usageData, setUsageData] = useState({
    usageCount: 0,
    usageLimit: 10,
    subscriptionStatus: 'free'
  });

  // Admin emails - these users get unlimited access automatically
  const ADMIN_EMAILS = ['ibeme8@gmail.com', 'drremotework@gmail.com', 'sonofyola@gmail.com'];
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  const fetchUsageData = React.useCallback(async () => {
    if (!user) return;
    
    // If user is admin, set unlimited access
    if (isAdmin) {
      setUsageData({
        usageCount: 0,
        usageLimit: -1,
        subscriptionStatus: 'pro'
      });
      return;
    }
    
    // For non-admin users, use local storage to avoid database UUID issues
    try {
      const today = new Date().toDateString();
      const lastUsageDate = await AsyncStorage.getItem('lastUsageDate');
      const storedUsage = await AsyncStorage.getItem('dailyUsage');
      
      let currentUsage = 0;
      if (lastUsageDate === today) {
        currentUsage = parseInt(storedUsage || '0', 10);
      }
      
      setUsageData({
        usageCount: currentUsage,
        usageLimit: 10, // Default free limit
        subscriptionStatus: 'free'
      });
    } catch (error) {
      console.error('Error fetching usage data:', error);
      // Set safe defaults
      setUsageData({
        usageCount: 0,
        usageLimit: 10,
        subscriptionStatus: 'free'
      });
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData, refreshTrigger]);

  const { usageCount, usageLimit, subscriptionStatus } = usageData;
  const isPro = subscriptionStatus === 'pro' || usageLimit === -1;
  const remaining = isPro ? 'Unlimited' : Math.max(0, usageLimit - usageCount);
  const percentage = isPro ? 100 : Math.min(100, (usageCount / usageLimit) * 100);
  
  const getStatusColor = () => {
    if (isPro) return '#4CAF50';
    if (percentage >= 90) return '#f44336';
    if (percentage >= 70) return '#FF9800';
    return '#4CAF50';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Usage</Text>
        <View style={[styles.badge, { backgroundColor: isPro ? '#4CAF50' : '#FF9800' }]}>
          <Text style={styles.badgeText}>{isPro ? 'PRO' : 'FREE'}</Text>
        </View>
      </View>
      
      <View style={styles.usageInfo}>
        <Text style={styles.usageText}>
          {usageCount} / {isPro ? '∞' : usageLimit} prompts used
        </Text>
        <Text style={[styles.remainingText, { color: getStatusColor() }]}>
          {remaining} remaining
        </Text>
      </View>
      
      {!isPro && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${percentage}%`, backgroundColor: getStatusColor() }
              ]} 
            />
          </View>
        </View>
      )}
      
      {!isPro && percentage >= 80 && (
        <TouchableOpacity 
          style={styles.upgradeButton} 
          onPress={onUpgradePress}
        >
          <Text style={styles.upgradeButtonText}>
            {percentage >= 100 ? '🚀 Upgrade to Continue' : '💎 Upgrade to Pro'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    margin: 20,
    borderWidth: 1,
    borderColor: '#444444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  usageInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  usageText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 5,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
