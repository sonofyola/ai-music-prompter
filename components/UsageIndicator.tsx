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

  if (isUnlimited) {
    return (
      <View style={styles.container}>
        <View style={styles.unlimitedBadge}>
          <MaterialIcons name="star" size={16} color={colors.warning} />
          <Text style={styles.unlimitedText}>Unlimited</Text>
        </View>
      </View>
    );
  }

  const remaining = Math.max(0, 3 - generationsToday);

  return (
    <View style={styles.container}>
      <View style={styles.usageInfo}>
        <Text style={styles.usageText}>
          {remaining} free generations left today
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(generationsToday / 3) * 100}%` }
            ]} 
          />
        </View>
      </View>
      <TouchableOpacity style={styles.upgradeButton} onPress={onUpgradePress}>
        <MaterialIcons name="star" size={16} color={colors.primary} />
        <Text style={styles.upgradeText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  usageInfo: {
    flex: 1,
    marginRight: 16,
  },
  usageText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  unlimitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  unlimitedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});