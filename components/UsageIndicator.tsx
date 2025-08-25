import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useBasic } from '@basictech/expo';

interface UsageIndicatorProps {
  onUpgradePress?: () => void;
  refreshTrigger?: number;
}

export default function UsageIndicator({ onUpgradePress, refreshTrigger }: UsageIndicatorProps) {
  const { user, db } = useBasic();
  const [usageData, setUsageData] = useState({
    usageCount: 0,
    usageLimit: 10,
    subscriptionStatus: 'free'
  });

  const fetchUsageData = async () => {
    if (!user || !db) return;
    
    try {
      const userData = await db.from('users').get(user.email || user.id);
      if (userData) {
        setUsageData({
          usageCount: typeof userData.usage_count === 'number' ? userData.usage_count : 0,
          usageLimit: typeof userData.usage_limit === 'number' ? userData.usage_limit : 10,
          subscriptionStatus: typeof userData.subscription_status === 'string' ? userData.subscription_status : 'free'
        });
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, [user, db, refreshTrigger]);

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
        <TouchableOpacity style={styles.upgradeButton} onPress={onUpgradePress}>
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
