import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';

interface SubscriptionStatusProps {
  onManagePress?: () => void;
  compact?: boolean;
}

export default function SubscriptionStatus({ 
  onManagePress, 
  compact = false 
}: SubscriptionStatusProps) {
  const { colors } = useTheme();
  const { 
    subscriptionStatus, 
    subscriptionExpiry, 
    generationsToday,
    isUnlimited 
  } = useUsage();

  const getDaysUntilExpiry = (dateString: string | null) => {
    if (!dateString) return null;
    const expiry = new Date(dateString);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = () => {
    switch (subscriptionStatus) {
      case 'premium': return colors.success || '#4CAF50';
      case 'trial': return colors.warning || '#FF9800';
      default: return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (subscriptionStatus) {
      case 'premium': return 'Premium';
      case 'trial': return 'Trial';
      default: return 'Free';
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry(subscriptionExpiry);
  const showExpiryWarning = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: compact ? 8 : 12,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: getStatusColor(),
    },
    statusText: {
      color: '#fff',
      fontSize: compact ? 12 : 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    manageButton: {
      padding: 6,
      borderRadius: 8,
      backgroundColor: colors.border,
    },
    usageContainer: {
      marginBottom: compact ? 0 : 8,
    },
    usageText: {
      fontSize: compact ? 12 : 14,
      color: colors.textSecondary,
      marginBottom: 6,
      fontWeight: '500',
    },
    usageBar: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: 'hidden',
    },
    usageProgress: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    unlimitedText: {
      fontSize: compact ? 12 : 14,
      color: colors.success || '#4CAF50',
      fontWeight: '600',
    },
    warningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warning + '15',
      padding: 10,
      borderRadius: 8,
      marginTop: 10,
    },
    warningText: {
      color: colors.warning,
      fontSize: 12,
      marginLeft: 6,
      flex: 1,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <MaterialIcons 
            name={subscriptionStatus === 'premium' ? 'star' : 'person'} 
            size={compact ? 12 : 16} 
            color="#fff" 
          />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        
        {onManagePress && (
          <TouchableOpacity style={styles.manageButton} onPress={onManagePress}>
            <MaterialIcons name="settings" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.usageContainer}>
        {isUnlimited ? (
          <Text style={styles.unlimitedText}>
            ✓ Unlimited generations
          </Text>
        ) : (
          <>
            <Text style={styles.usageText}>
              {generationsToday} / 3 generations used today
            </Text>
            <View style={styles.usageBar}>
              <View 
                style={[
                  styles.usageProgress, 
                  { width: `${Math.min((generationsToday / 3) * 100, 100)}%` }
                ]} 
              />
            </View>
          </>
        )}
      </View>

      {showExpiryWarning && (
        <View style={styles.warningContainer}>
          <MaterialIcons name="warning" size={16} color="#856404" />
          <Text style={styles.warningText}>
            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}
