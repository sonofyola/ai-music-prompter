import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import SubscriptionStatus from '../components/SubscriptionStatus';
import UpgradeModal from '../components/UpgradeModal';

interface SubscriptionScreenProps {
  navigation?: any;
}

export default function SubscriptionScreen({ navigation }: SubscriptionScreenProps) {
  const { colors } = useTheme();
  const { 
    subscriptionStatus, 
    dailyUsage,
  } = useUsage();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleRefreshStatus = async () => {
    Alert.alert('Status Updated', 'Your subscription status has been refreshed.');
  };

  const daysUntilExpiry = null;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    statusContainer: {
      marginBottom: 24,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    featureList: {
      gap: 12,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    featureIcon: {
      marginRight: 12,
      width: 20,
    },
    featureText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    upgradeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      gap: 8,
      marginTop: 16,
    },
    upgradeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    managementSection: {
      gap: 12,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      gap: 8,
    },
    actionButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: 12,
      padding: 16,
      gap: 8,
    },
    cancelButtonText: {
      color: colors.error,
      fontSize: 16,
      fontWeight: '600',
    },
    expiryInfo: {
      backgroundColor: colors.warning + '15',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    expiryText: {
      color: colors.warning,
      fontSize: 14,
      marginLeft: 8,
      flex: 1,
      fontWeight: '500',
    },
    billingInfo: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    billingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    billingText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusContainer}>
          <SubscriptionStatus />
        </View>

        {subscriptionStatus === 'free' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Upgrade to Premium</Text>
            
            <View style={styles.featureList}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Unlimited prompt generations</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>No daily limits</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Priority support</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Advanced prompt features</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Cancel anytime</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => setShowUpgradeModal(true)}
            >
              <MaterialIcons name="upgrade" size={20} color="#fff" />
              <Text style={styles.upgradeButtonText}>Upgrade for $5.99/month</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎉 Premium Active</Text>
            
            {daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
              <View style={styles.expiryInfo}>
                <MaterialIcons name="warning" size={20} color={colors.warning} />
                <Text style={styles.expiryText}>
                  Your subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                </Text>
              </View>
            )}

            <View style={styles.featureList}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎵</Text>
                <Text style={styles.featureText}>Unlimited AI music prompts</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text style={styles.featureText}>No daily generation limits</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureText}>Advanced prompt customization</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>💬</Text>
                <Text style={styles.featureText}>Priority customer support</Text>
              </View>
            </View>

            <View style={styles.billingInfo}>
              <Text style={styles.billingTitle}>Billing Information</Text>
              <Text style={styles.billingText}>
                One-time payment: $5.99 for unlimited access{'\n'}
                Status: Active
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Manage Subscription</Text>
          
          <View style={styles.managementSection}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRefreshStatus}
            >
              <MaterialIcons name="refresh" size={20} color={colors.text} />
              <Text style={styles.actionButtonText}>Refresh Status</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Need Help?</Text>
          <Text style={styles.billingText}>
            Having issues with your subscription? Contact our support team for assistance.
            {'\n\n'}
            • Email: support@aimusicpromptr.com{'\n'}
            • Response time: Within 24 hours{'\n'}
            • Available: Monday - Friday
          </Text>
        </View>
      </ScrollView>

      <UpgradeModal 
        visible={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeSuccess={() => {
          setShowUpgradeModal(false);
          Alert.alert('Success!', 'Welcome to Premium! 🎉');
        }}
      />
    </SafeAreaView>
  );
}
