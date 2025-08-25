import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';

interface UserSubscription {
  subscription_status?: string;
  usage_count?: number;
  usage_limit?: number;
  stripe_customer_id?: string;
  subscription_end_date?: string;
}

export default function SubscriptionScreen() {
  const { user, db, signout } = useBasic();
  const [userSub, setUserSub] = useState<UserSubscription>({
    subscription_status: 'free',
    usage_count: 0,
    usage_limit: 10
  });
  const [loading, setLoading] = useState(false);

  console.log('SubscriptionScreen rendering...', { user: !!user, db: !!db });

  // Simple upgrade function that just shows an alert
  const handleUpgrade = () => {
    console.log('handleUpgrade called!');
    Alert.alert(
      'Upgrade to Pro',
      'This would normally process the upgrade. For now, let\'s simulate it.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate Upgrade', 
          onPress: () => {
            setUserSub(prev => ({
              ...prev,
              subscription_status: 'pro',
              usage_limit: -1
            }));
            Alert.alert('Success!', 'You\'ve been upgraded to Pro (simulated)');
          }
        }
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your Pro subscription?',
      [
        { text: 'Keep Pro', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: () => {
            setUserSub(prev => ({
              ...prev,
              subscription_status: 'free',
              usage_limit: 10
            }));
            Alert.alert('Subscription Cancelled', 'You\'ve been downgraded to the free plan.');
          }
        }
      ]
    );
  };

  const isPro = userSub.subscription_status === 'pro' || userSub.usage_limit === -1;
  const usageCount = userSub.usage_count || 0;
  const usageLimit = userSub.usage_limit || 10;
  const remainingUsage = usageLimit === -1 ? 'Unlimited' : Math.max(0, usageLimit - usageCount);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>💎 Subscription</Text>
          <Text style={styles.subtitle}>Manage your AI Music Prompter plan</Text>
        </View>

        {/* Current Plan */}
        <View style={styles.planContainer}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Current Plan</Text>
            <View style={[styles.planBadge, isPro ? styles.proBadge : styles.freeBadge]}>
              <Text style={styles.planBadgeText}>{isPro ? 'PRO' : 'FREE'}</Text>
            </View>
          </View>
          
          <View style={styles.usageContainer}>
            <Text style={styles.usageTitle}>Usage This Month</Text>
            <Text style={styles.usageText}>
              {usageCount} / {usageLimit === -1 ? '∞' : usageLimit} prompts used
            </Text>
            <Text style={styles.remainingText}>
              {remainingUsage} prompts remaining
            </Text>
          </View>
        </View>

        {/* Debug Info */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Debug Info:</Text>
          <Text style={styles.debugText}>isPro: {String(isPro)}</Text>
          <Text style={styles.debugText}>subscription_status: {userSub.subscription_status}</Text>
          <Text style={styles.debugText}>usage_limit: {userSub.usage_limit}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Test Button */}
          <Pressable 
            style={[styles.button, styles.testButton]} 
            onPress={() => {
              console.log('TEST BUTTON PRESSED!');
              Alert.alert('Test', 'Test button works!');
            }}
          >
            <Text style={styles.buttonText}>🧪 Test Button</Text>
          </Pressable>
          
          {/* Upgrade/Cancel Button */}
          {!isPro ? (
            <Pressable 
              style={[styles.button, styles.upgradeButton]} 
              onPress={() => {
                console.log('UPGRADE BUTTON PRESSED!');
                handleUpgrade();
              }}
            >
              <Text style={styles.buttonText}>🚀 Upgrade to Pro - $9.99/month</Text>
            </Pressable>
          ) : (
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleCancelSubscription}
            >
              <Text style={styles.buttonText}>Cancel Subscription</Text>
            </Pressable>
          )}
          
          {/* Sign Out Button */}
          <Pressable 
            style={[styles.button, styles.signOutButton]} 
            onPress={() => {
              console.log('SIGNOUT BUTTON PRESSED!');
              Alert.alert('Sign Out', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', onPress: signout }
              ]);
            }}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userInfoTitle}>Account Information</Text>
          <Text style={styles.userInfoText}>Email: {user?.email || 'Not available'}</Text>
          <Text style={styles.userInfoText}>
            Member since: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
  planContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  proBadge: {
    backgroundColor: '#4CAF50',
  },
  freeBadge: {
    backgroundColor: '#FF9800',
  },
  planBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  usageContainer: {
    alignItems: 'center',
  },
  usageTitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 8,
  },
  usageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  remainingText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  debugContainer: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  debugText: {
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 5,
  },
  actionsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#FF9800',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  signOutButton: {
    backgroundColor: '#666666',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#444444',
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  userInfoText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 5,
  },
});