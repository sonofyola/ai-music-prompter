import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import StripePaymentForm from '../components/StripePaymentForm';

export default function SubscriptionScreen() {
  const { user, db } = useBasic();
  const [userSubscription, setUserSubscription] = useState({
    status: 'free',
    usageCount: 0,
    usageLimit: 10
  });
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fetchUserSubscription = useCallback(async () => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    try {
      const userData = await db.from('users').get(user.email || user.id);
      if (userData) {
        setUserSubscription({
          status: String(userData.subscription_status || 'free'),
          usageCount: Number(userData.usage_count || 0),
          usageLimit: Number(userData.usage_limit || 10)
        });
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    } finally {
      setLoading(false);
    }
  }, [user, db]);

  useEffect(() => {
    fetchUserSubscription();
  }, [fetchUserSubscription]);

  const handleUpgrade = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (subscriptionId: string) => {
    try {
      // Update user to Pro status in database
      if (user && db) {
        await db.from('users').update(user.email || user.id, {
          subscription_status: 'pro',
          usage_limit: -1, // Unlimited
          stripe_subscription_id: subscriptionId,
          subscription_start_date: new Date().toISOString(),
          last_active: new Date().toISOString()
        });
        
        // Refresh user data
        await fetchUserSubscription();
      }
      
      setShowPaymentForm(false);
    } catch (error) {
      console.error('Error updating subscription:', error);
      Alert.alert('Error', 'Failed to activate subscription. Please contact support.');
    }
  };

  const handlePaymentError = (error: string) => {
    Alert.alert('Payment Error', error);
    setShowPaymentForm(false);
  };

  const isPro = userSubscription.status === 'pro' || userSubscription.usageLimit === -1;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading subscription details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showPaymentForm && user?.email) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowPaymentForm(false)}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>💎 Upgrade to Pro</Text>
            <Text style={styles.subtitle}>Get unlimited access for just $5.99/month</Text>
          </View>

          <StripePaymentForm
            email={user.email}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>💎 Subscription</Text>
          <Text style={styles.subtitle}>Manage your AI Music Prompter plan</Text>
        </View>

        {/* Current Plan */}
        <View style={styles.currentPlanCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Current Plan</Text>
            <View style={[styles.planBadge, { backgroundColor: isPro ? '#4CAF50' : '#FF9800' }]}>
              <Text style={styles.planBadgeText}>{isPro ? 'PRO' : 'FREE'}</Text>
            </View>
          </View>
          
          <View style={styles.usageInfo}>
            <Text style={styles.usageText}>
              Monthly Usage: {userSubscription.usageCount} / {isPro ? '∞' : userSubscription.usageLimit}
            </Text>
            <Text style={styles.remainingText}>
              {isPro ? 'Unlimited prompts' : `${Math.max(0, userSubscription.usageLimit - userSubscription.usageCount)} prompts remaining`}
            </Text>
          </View>
        </View>

        {/* Free Plan Features */}
        <View style={styles.planCard}>
          <Text style={styles.planName}>Free Plan</Text>
          <Text style={styles.planPrice}>$0/month</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>10 prompts per month</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Basic prompt templates</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Random track generator</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Prompt history</Text>
            </View>
          </View>
        </View>

        {/* Pro Plan Features */}
        <View style={[styles.planCard, styles.proPlanCard]}>
          <Text style={styles.planName}>Pro Plan</Text>
          <Text style={styles.planPrice}>$5.99/month</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Unlimited prompts</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Advanced templates</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Priority support</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Export to multiple formats</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Custom prompt styles</Text>
            </View>
          </View>

          {!isPro && (
            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeButtonText}>Upgrade to Pro - $5.99/month</Text>
            </TouchableOpacity>
          )}

          {isPro && (
            <View style={styles.proStatus}>
              <Text style={styles.proStatusText}>✨ You&apos;re a Pro user!</Text>
            </View>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactText}>
            Contact us for support or questions about your subscription.
          </Text>
          <Text style={styles.contactEmail}>support@aimusicpromptr.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#cccccc',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  currentPlanCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#444444',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  usageInfo: {
    alignItems: 'center',
  },
  usageText: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 5,
  },
  remainingText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  planCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444444',
  },
  proPlanCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#cccccc',
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proStatus: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  proStatusText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#444444',
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  contactEmail: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
