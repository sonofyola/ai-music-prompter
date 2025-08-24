import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PaymentVerification {
  email: string;
  timestamp: number;
  subscriptionId: string;
  status: 'pending' | 'completed' | 'failed';
}

// Store payment attempt
export const storePaymentAttempt = async (email: string, subscriptionId: string) => {
  try {
    const paymentData: PaymentVerification = {
      email,
      timestamp: Date.now(),
      subscriptionId,
      status: 'pending'
    };
    
    await AsyncStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    return paymentData;
  } catch (error) {
    console.error('Error storing payment attempt:', error);
    throw error;
  }
};

// Check for pending payments on app resume
export const checkPendingPayments = async (): Promise<PaymentVerification | null> => {
  try {
    const pendingPayment = await AsyncStorage.getItem('pendingPayment');
    if (!pendingPayment) return null;
    
    const payment: PaymentVerification = JSON.parse(pendingPayment);
    
    // If payment is older than 30 minutes, consider it expired
    const thirtyMinutes = 30 * 60 * 1000;
    if (Date.now() - payment.timestamp > thirtyMinutes) {
      try {
        await AsyncStorage.removeItem('pendingPayment');
      } catch (removeError) {
        console.error('Error removing expired payment:', removeError);
      }
      return null;
    }
    
    return payment;
  } catch (error) {
    console.error('Error checking pending payments:', error);
    return null;
  }
};

// Mark payment as completed
export const markPaymentCompleted = async (subscriptionId: string) => {
  try {
    const pendingPayment = await AsyncStorage.getItem('pendingPayment');
    if (pendingPayment) {
      const payment: PaymentVerification = JSON.parse(pendingPayment);
      if (payment.subscriptionId === subscriptionId) {
        payment.status = 'completed';
        await AsyncStorage.setItem('completedPayment', JSON.stringify(payment));
        await AsyncStorage.removeItem('pendingPayment');
      }
    }
  } catch (error) {
    console.error('Error marking payment completed:', error);
    // Don't throw - this is not critical
  }
};

// Clear payment data
export const clearPaymentData = async () => {
  try {
    await AsyncStorage.multiRemove(['pendingPayment', 'completedPayment']);
  } catch (error) {
    console.error('Error clearing payment data:', error);
    // Don't throw - this is not critical
  }
};
