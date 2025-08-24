import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { openCustomerPortal } from '../utils/subscriptionService';
import { useBasic } from '@basictech/expo';
import IconFallback from './IconFallback';

export default function SubscriptionStatus() {
  const { colors } = useTheme();
  const { subscriptionStatus } = useUsage();
  const { user } = useBasic();
  const styles = createStyles(colors);

  if (subscriptionStatus !== 'unlimited') {
    return null;
  }

  const handleManageSubscription = () => {
    if (user?.email) {
      openCustomerPortal(user.email);
    }
  };

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel="Premium subscription status"
      accessibilityRole="region"
    >
      <View style={styles.content}>
        <View 
          style={styles.statusRow}
          accessible={true}
          accessibilityLabel="Premium subscription is active"
          accessibilityRole="text"
        >
          <IconFallback name="verified" size={20} color={colors.success} />
          <Text style={styles.statusText} accessible={false}>Premium Active</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.manageButton} 
          onPress={handleManageSubscription}
          accessible={true}
          accessibilityLabel="Manage subscription"
          accessibilityHint="Opens subscription management portal to update billing or cancel subscription"
          accessibilityRole="button"
        >
          <Text style={styles.manageText} accessible={false}>Manage</Text>
          <IconFallback name="settings" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <Text 
        style={styles.benefitText}
        accessibilityRole="text"
      >
        ✨ Unlimited generations • Priority support
      </Text>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.success + '15',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.success + '30',
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
  },
  manageText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
