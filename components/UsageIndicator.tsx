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
  const { generationsToday, isUnlimited } = useUsage();
  const styles = createStyles(colors);

  // Don't show anything if user has unlimited - SubscriptionStatus handles that
  if (isUnlimited) {
    return null;
  }

  const remaining = Math.max(0, 3 - generationsToday);
  const isLow = remaining <= 1;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textRow}>
          <Text style={styles.usageText}>
            {remaining} free generations remaining
          </Text>
          {isLow && (
            <TouchableOpacity style={styles.upgradeButton} onPress={onUpgradePress}>
              <Text style={styles.upgradeText}>Upgrade</Text>
              <MaterialIcons name="arrow-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${(generationsToday / 3) * 100}%`,
                backgroundColor: isLow ? colors.warning : colors.primary
              }
            ]} 
          />
        </View>
      </View>
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
