import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';

export default function SubscriptionScreen() {
  const { colors } = useTheme();
  const { 
    subscriptionStatus, 
    subscriptionExpiry, 
    userEmail,
    generationsToday,
    isUnlimited 
  } = useUsage();
  
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (dateString: string | null) => {
    if (!dateString) return null;
    const expiry = new Date(dateString);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleManageSubscription = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'No email found. Please contact support.');
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, you'd call your backend to create a Stripe customer portal session
      // For now, we'll direct users to contact support or use a generic Stripe link
      Alert.alert(
        'Manage Subscription',
        'To manage your subscription, billing, or cancel, please:\n\n1. Visit your Stripe customer portal\n2. Or contact our support team\n\nWould you like to open the customer portal?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Portal', 
            onPress: () => {
              // This would be your actual customer portal URL
              // You'd generate this via your backend calling Stripe's API
              const portalUrl = `https://billing.stripe.com/p/login/test_YOUR_PORTAL_LINK`;
              Linking.openURL(portalUrl).catch(() => {
                Alert.alert('Error', 'Could not open billing portal. Please contact support.');
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to access subscription management. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Subscription Support Request');
    const body = encodeURIComponent(
      `Hi,\n\nI need help with my subscription.\n\nAccount Email: ${userEmail}\nSubscription Status: ${subscriptionStatus}\n\nPlease describe your issue:\n\n`
    );
    
    const mailtoUrl = `mailto:support@yourapp.com?subject=${subject}&body=${body}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        'Contact Support',
        'Please email us at support@yourapp.com with your subscription questions.',
        [{ text: 'OK' }]
      );
    });
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
      case 'premium': return 'Premium Active';
      case 'trial': return 'Trial Period';
      default: return 'Free Plan';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statusValue: {
      fontSize: 16,
      fontWeight: '600',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    statusBadgeText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
    },
    usageBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      marginTop: 8,
      overflow: 'hidden',
    },
    usageProgress: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    usageText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    buttonTextSecondary: {
      color: colors.text,
    },
    warningSection: {
      backgroundColor: '#FFF3CD',
      borderColor: '#FFEAA7',
      borderWidth: 1,
    },
    warningText: {
      color: '#856404',
      fontSize: 14,
      lineHeight: 20,
    },
    expiryWarning: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF3CD',
      padding: 12,
      borderRadius: 8,
      marginTop: 12,
    },
    expiryWarningText: {
      color: '#856404',
      fontSize: 14,
      marginLeft: 8,
      flex: 1,
    },
  });

  const daysUntilExpiry = getDaysUntilExpiry(subscriptionExpiry);
  const showExpiryWarning = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription</Text>
        <Text style={styles.subtitle}>Manage your plan and billing</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Plan Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Plan</Text>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusBadgeText}>{getStatusText()}</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Account Email</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {userEmail || 'Not set'}
            </Text>
          </View>

          {subscriptionStatus === 'premium' && (
            <>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Next Billing</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>
                  {formatDate(subscriptionExpiry)}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Amount</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>
                  $5.99/month
                </Text>
              </View>
            </>
          )}

          {showExpiryWarning && (
            <View style={styles.expiryWarning}>
              <MaterialIcons name="warning" size={20} color="#856404" />
              <Text style={styles.expiryWarningText}>
                Your subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Usage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage</Text>
          
          {isUnlimited ? (
            <Text style={[styles.statusValue, { color: colors.success || '#4CAF50' }]}>
              ✓ Unlimited generations
            </Text>
          ) : (
            <>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Today's Usage</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>
                  {generationsToday} / 3
                </Text>
              </View>
              
              <View style={styles.usageBar}>
                <View 
                  style={[
                    styles.usageProgress, 
                    { width: `${Math.min((generationsToday / 3) * 100, 100)}%` }
                  ]} 
                />
              </View>
              
              <Text style={styles.usageText}>
                {3 - generationsToday} generations remaining today
              </Text>
            </>
          )}
        </View>

        {/* Management Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage Subscription</Text>
          
          {subscriptionStatus === 'premium' ? (
            <>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleManageSubscription}
                disabled={isLoading}
              >
                <MaterialIcons name="settings" size={20} color="#fff" />
                <Text style={styles.buttonText}>
                  {isLoading ? 'Loading...' : 'Manage Billing'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.warningText}>
                Access your Stripe customer portal to update payment methods, view invoices, or cancel your subscription.
              </Text>
            </>
          ) : (
            <Text style={styles.warningText}>
              You're currently on the free plan. Upgrade to premium for unlimited generations!
            </Text>
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]} 
            onPress={handleContactSupport}
          >
            <MaterialIcons name="support" size={20} color={colors.text} />
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Contact Support
            </Text>
          </TouchableOpacity>

          <Text style={styles.warningText}>
            Have questions about your subscription, billing, or need technical support? We're here to help!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}