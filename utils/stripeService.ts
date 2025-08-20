import { Stripe } from '@stripe/stripe-react-native';

// Initialize Stripe with your publishable key
// You'll need to add EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const initializeStripe = async () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.error('Stripe publishable key not found');
    return false;
  }
  
  await Stripe.initialize({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    merchantIdentifier: 'merchant.com.yourapp.identifier', // Replace with your merchant ID
  });
  
  return true;
};

export interface PaymentIntentData {
  clientSecret: string;
  customerId?: string;
}

// This would typically call your backend to create a payment intent
export const createPaymentIntent = async (
  email: string,
  amount: number = 599 // $5.99 in cents
): Promise<PaymentIntentData> => {
  try {
    // Replace with your actual backend URL
    const response = await fetch('https://your-backend-url.com/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return {
      clientSecret: data.client_secret,
      customerId: data.customer_id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Create subscription for recurring payments
export const createSubscription = async (
  email: string,
  paymentMethodId: string
): Promise<{ subscriptionId: string; clientSecret?: string }> => {
  try {
    // Replace with your actual backend URL
    const response = await fetch('https://your-backend-url.com/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        payment_method_id: paymentMethodId,
        price_id: 'price_1234567890', // Replace with your actual Stripe Price ID
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    const data = await response.json();
    return {
      subscriptionId: data.subscription_id,
      clientSecret: data.client_secret, // For 3D Secure if needed
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};
