import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';

interface UsageIndicatorProps {
  onUpgradePress: () => void;
}

export default function UsageIndicator({ onUpgradePress }: UsageIndicatorProps) {
  const { colors } = useTheme();
  const { dailyUsage, subscriptionStatus } = useUsage();
  const styles = createStyles(colors);

  const isUnlimited = subscriptionStatus === 'unlimited';
  // Don't show anything if user has unlimited - SubscriptionStatus handles that
  if (isUnlimited) {
    return null;
  }

  const remaining = Math.max(0, 3 - dailyUsage);
  const isLow = remaining <= 1;

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: subscriptionStatus === 'unlimited' ? undefined : DAILY_FREE_LIMIT,
        now: dailyUsage,
        text: getAccessibilityValueText()
      }}
    >
      {/* Usage bar */}
      <View style={styles.usageBar}>
        <View 
          style={[styles.usageProgress, { width: `${progressPercentage}%` }]}
          accessible={false}
        />
      </View>

      {/* Usage text */}
      <Text 
        style={styles.usageText}
        accessible={false} // Parent handles accessibility
      >
        {getUsageText()}
      </Text>

      {/* Upgrade button for non-unlimited users */}
      {subscriptionStatus !== 'unlimited' && (
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={onUpgrade}
          accessible={true}
          accessibilityLabel="Upgrade to premium subscription"
          accessibilityHint="Get unlimited music prompt generations for $5.99 per month"
          accessibilityRole="button"
        >
          <Text style={styles.upgradeButtonText}>Upgrade</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
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
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  unlimitedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unlimitedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.primary + '15',
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});

// Helper functions for accessibility
const getAccessibilityLabel = () => {
  if (subscriptionStatus === 'unlimited') {
    return 'Premium subscription active - unlimited generations available';
  }
  return `Daily usage: ${dailyUsage} of ${DAILY_FREE_LIMIT} free generations used`;
};

const getAccessibilityValueText = () => {
  if (subscriptionStatus === 'unlimited') {
    return 'Unlimited';
  }
  return `${dailyUsage} of ${DAILY_FREE_LIMIT}`;
};
