import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/theme';
import { useUsage } from '../contexts/UsageContext';

const DAILY_FREE_LIMIT = 3;

interface UsageIndicatorProps {
  onUpgradePress?: () => void;
}

export default function UsageIndicator({ onUpgradePress }: UsageIndicatorProps) {
  const { colors } = useTheme();
  const { dailyUsage, subscriptionStatus } = useUsage();

  const styles = createStyles(colors);

  const getUsageText = () => {
    if (subscriptionStatus === 'unlimited') {
      return 'Unlimited generations';
    }
    return `${dailyUsage}/${DAILY_FREE_LIMIT} generations used today`;
  };

  const progressPercentage = subscriptionStatus === 'unlimited' ? 100 : (dailyUsage / DAILY_FREE_LIMIT) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textRow}>
          <Text style={styles.usageText}>{getUsageText()}</Text>
          {subscriptionStatus === 'unlimited' && (
            <Text style={styles.premiumBadge}>Premium</Text>
          )}
        </View>
        
        {subscriptionStatus !== 'unlimited' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
        )}

        {subscriptionStatus !== 'unlimited' && dailyUsage >= DAILY_FREE_LIMIT && onUpgradePress && (
          <TouchableOpacity style={styles.upgradeButton} onPress={onUpgradePress}>
            <Text style={styles.upgradeButtonText}>Upgrade for Unlimited</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    gap: 8,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  premiumBadge: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
