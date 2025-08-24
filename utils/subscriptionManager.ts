import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBasic } from '@basictech/expo';

export interface SubscriptionData {
  email: string;
  subscriptionId: string;
  status: 'active' | 'cancelled' | 'past_due';
  createdAt: number;
  expiresAt?: number;
}

// Simulate webhook processing for subscription events
export const processSubscriptionEvent = async (
  eventType: 'customer.subscription.created' | 'customer.subscription.updated' | 'customer.subscription.deleted',
  subscriptionData: SubscriptionData
) => {
  try {
    console.log(`Processing subscription event: ${eventType}`, subscriptionData);
    
    switch (eventType) {
      case 'customer.subscription.created':
        await activateSubscription(subscriptionData);
        break;
      case 'customer.subscription.updated':
        await updateSubscription(subscriptionData);
        break;
      case 'customer.subscription.deleted':
        await cancelSubscription(subscriptionData);
        break;
    }
  } catch (error) {
    console.error('Error processing subscription event:', error);
  }
};

// Activate subscription for user
const activateSubscription = async (subscriptionData: SubscriptionData) => {
  try {
    // Store subscription data locally
    await AsyncStorage.setItem('activeSubscription', JSON.stringify(subscriptionData));
    
    console.log('✅ Subscription activated for:', subscriptionData.email);
    return true;
  } catch (error) {
    console.error('Error activating subscription:', error);
    return false;
  }
};

// Update subscription status
const updateSubscription = async (subscriptionData: SubscriptionData) => {
  try {
    const existingData = await AsyncStorage.getItem('activeSubscription');
    if (existingData) {
      const existing = JSON.parse(existingData);
      const updated = { ...existing, ...subscriptionData };
      await AsyncStorage.setItem('activeSubscription', JSON.stringify(updated));
      console.log('✅ Subscription updated for:', subscriptionData.email);
    }
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return false;
  }
};

// Cancel subscription
const cancelSubscription = async (subscriptionData: SubscriptionData) => {
  try {
    await AsyncStorage.removeItem('activeSubscription');
    console.log('✅ Subscription cancelled for:', subscriptionData.email);
    return true;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return false;
  }
};

// Check if user has active subscription
export const checkActiveSubscription = async (userEmail: string): Promise<SubscriptionData | null> => {
  try {
    const subscriptionData = await AsyncStorage.getItem('activeSubscription');
    if (!subscriptionData) return null;
    
    const subscription: SubscriptionData = JSON.parse(subscriptionData);
    
    // Check if subscription belongs to current user
    if (subscription.email !== userEmail) return null;
    
    // Check if subscription is still active
    if (subscription.expiresAt && Date.now() > subscription.expiresAt) {
      await AsyncStorage.removeItem('activeSubscription');
      return null;
    }
    
    return subscription;
  } catch (error) {
    console.error('Error checking active subscription:', error);
    return null;
  }
};

// Simulate successful payment completion (for testing)
export const simulatePaymentSuccess = async (email: string, subscriptionId: string) => {
  const subscriptionData: SubscriptionData = {
    email,
    subscriptionId,
    status: 'active',
    createdAt: Date.now(),
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
  };
  
  await processSubscriptionEvent('customer.subscription.created', subscriptionData);
  return subscriptionData;
};