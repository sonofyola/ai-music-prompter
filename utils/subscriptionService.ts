import { Alert, Linking } from 'react-native';

export interface SubscriptionInfo {
  status: 'free' | 'premium' | 'trial';
  subscriptionId: string | null;
  customerId: string | null;
  expiry: string | null;
}

// In a real app, this would call your backend to create a Stripe customer portal session
export const createCustomerPortalSession = async (
  email: string,
  customerId?: string
): Promise<string> => {
  try {
    // This would be your actual backend endpoint
    const response = await fetch('https://your-backend-url.com/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
        email: email,
        return_url: 'https://your-app-url.com/subscription', // Deep link back to your app
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Helper function to open customer portal
export const openCustomerPortal = async (email: string, customerId?: string) => {
  try {
    // For now, we'll use a placeholder approach
    // In production, you'd call createCustomerPortalSession
    
    Alert.alert(
      'Manage Subscription',
      'Choose how you\'d like to manage your subscription:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Email Support',
          onPress: () => {
            const subject = encodeURIComponent('Subscription Management Request');
            const body = encodeURIComponent(
              `Hi,\n\nI need to manage my subscription.\n\nAccount Email: ${email}\nCustomer ID: ${customerId || 'N/A'}\n\nPlease help me with:\n- Update payment method\n- View billing history\n- Cancel subscription\n- Other: \n\n`
            );
            
            const mailtoUrl = `mailto:support@yourapp.com?subject=${subject}&body=${body}`;
            Linking.openURL(mailtoUrl).catch(() => {
              Alert.alert('Error', 'Please email support@yourapp.com for subscription help.');
            });
          }
        },
        {
          text: 'Stripe Portal',
          onPress: () => {
            // This would be your actual customer portal URL from Stripe
            const portalUrl = 'https://billing.stripe.com/p/login/test_YOUR_PORTAL_LINK';
            Linking.openURL(portalUrl).catch(() => {
              Alert.alert('Error', 'Could not open billing portal. Please contact support.');
            });
          }
        }
      ]
    );
  } catch (error) {
    Alert.alert('Error', 'Failed to access subscription management. Please contact support.');
  }
};

// Verify subscription status with backend
export const verifySubscriptionStatus = async (
  subscriptionId: string
): Promise<SubscriptionInfo> => {
  try {
    // This would call your backend to check with Stripe
    const response = await fetch(`https://your-backend-url.com/subscription/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify subscription');
    }

    const data = await response.json();
    return {
      status: data.status === 'active' ? 'premium' : 'free',
      subscriptionId: data.id,
      customerId: data.customer,
      expiry: data.current_period_end ? new Date(data.current_period_end * 1000).toISOString() : null,
    };
  } catch (error) {
    console.error('Error verifying subscription:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    // This would call your backend to cancel with Stripe
    const response = await fetch(`https://your-backend-url.com/subscription/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    console.log('Subscription cancelled successfully');
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};