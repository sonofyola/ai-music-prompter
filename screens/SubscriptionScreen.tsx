import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';

interface UserSubscription {
  subscription_status?: string;
  usage_count?: number;
  usage_limit?: number;
  stripe_customer_id?: string;
  subscription_end_date?: string;
}

export default function SubscriptionScreen() {
  const { user, db, signout } = useBasic();
  const [userSub, setUserSub] = useState<UserSubscription>({});
  const [loading, setLoading] = useState(true);

  console.log('SubscriptionScreen rendering...', { user: !!user, db: !!db });

  const fetchUserSubscription = async () => {
    if (!user || !db) return;
    
    try {
      let userData = await db.from('users').get(user.email || user.id);
      if (userData) {
        setUserSub({
          subscription_status: String(userData.subscription_status) || 'free',
          usage_count: Number(userData.usage_count) || 0,
          usage_limit: Number(userData.usage_limit) || 10,
          stripe_customer_id: String(userData.stripe_customer_id) || undefined,
          subscription_end_date: String(userData.subscription_end_date) || undefined
        });
      } else {
        // Create user record if it doesn't exist
        const newUser = {
          id: user.email || user.id,
          email: user.email || user.id,
          name: user.name || '',
          usage_count: 0,
          usage_limit: 10,
          subscription_status: 'free',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        };
        await db.from('users').add(newUser);
        setUserSub({
          subscription_status: 'free',
          usage_count: 0,
          usage_limit: 10
        });
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSubscription();
  }, [user, db]);

  const handleUpgrade = async () => {
    console.log('handleUpgrade function called');
    alert('handleUpgrade function was called!');
    
    if (!user) {
      alert('No user found');
      return;
    }
    
    if (!db) {
      alert('No database connection');
      return;
    }
    
    alert('User and DB are available, attempting upgrade...');
    
    try {
      console.log('About to call db.from(users).update...');
      const result = await db.from('users').update(user.email || user.id, {
        subscription_status: 'pro',
        usage_limit: -1
      });
      
      console.log('Update result:', result);
      alert('Database update successful!');
      
      setUserSub(prev => ({
        ...prev,
        subscription_status: 'pro',
        usage_limit: -1
      }));
      
      alert('State updated, calling fetchUserSubscription...');
      fetchUserSubscription();
      
    } catch (error) {
      console.error('Error in handleUpgrade:', error);
      alert('Error: ' + String(error));
    }
  };

  const handleCancelSubscription = async () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your Pro subscription? You\'ll lose unlimited access.',
      [
        { text: 'Keep Pro', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            if (!db || !user) return;
            
            try {
              await db.from('users').update(user.email || user.id, {
                subscription_status: 'free',
                usage_limit: 10
              });
              
              setUserSub(prev => ({
                ...prev,
                subscription_status: 'free',
                usage_limit: 10
              }));
              
              Alert.alert('Subscription Cancelled', 'You\'ve been downgraded to the free plan.');
            } catch (error) {
              console.error('Error cancelling subscription:', error);
              Alert.alert('Error', 'Failed to cancel subscription');
            }
          }
        }
      ]
    );
  };

  const isPro = userSub.subscription_status === 'pro' || userSub.usage_limit === -1;
  const usageCount = userSub.usage_count || 0;
  const usageLimit = userSub.usage_limit || 10;
  const remainingUsage = usageLimit === -1 ? 'Unlimited' : Math.max(0, usageLimit - usageCount);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading subscription info...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable 
            style={[styles.upgradeButton, { backgroundColor: '#FF9800' }]} 
            onPress={() => {
              console.log('TEST BUTTON PRESSED!');
              alert('Test button works!');
            }}
          >
            <Text style={styles.upgradeButtonText}>🧪 Test Button</Text>
          </Pressable>
          
          <Text style={{ color: 'white', marginBottom: 10 }}>
            Debug: isPro = {String(isPro)}, userSub.subscription_status = {userSub.subscription_status}
          </Text>
          
          {!isPro ? (
            <TouchableOpacity 
              style={styles.upgradeButton} 
              onPress={handleUpgrade}
              activeOpacity={0.7}
            >
              <Text style={styles.upgradeButtonText}>🚀 Upgrade to Pro - $9.99/month</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
              <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
            </TouchableOpacity>
          )}
          
          <Pressable 
            style={styles.signOutButton} 
            onPress={() => {
              console.log('SIGNOUT BUTTON PRESSED!');
              alert('Sign out button pressed!');
              signout();
            }}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
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
  featuresContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444444',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  actionsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#666666',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
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
