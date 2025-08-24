import { useBasic } from '@basictech/expo';

// Helper function for admins to upgrade beta testers
export const upgradeBetaTester = async (
  db: any, 
  userEmail: string, 
  subscriptionType: 'premium' | 'unlimited' = 'unlimited'
) => {
  try {
    // Find user by email
    const allUsers = await db.from('user_profiles').getAll();
    const user = allUsers.find((u: any) => u.email === userEmail);
    
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }
    
    // Update their subscription status
    await db.from('user_profiles').update(user.id, {
      subscription_status: subscriptionType,
      upgraded_at: new Date().toISOString(),
      upgraded_by: 'admin', // Track that this was a manual upgrade
    });
    
    console.log(`✅ Successfully upgraded ${userEmail} to ${subscriptionType}`);
    return { success: true, message: `${userEmail} upgraded to ${subscriptionType}` };
    
  } catch (error) {
    console.error('Error upgrading beta tester:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to upgrade user' 
    };
  }
};

// Helper to downgrade user (if needed)
export const downgradeBetaTester = async (db: any, userEmail: string) => {
  try {
    const allUsers = await db.from('user_profiles').getAll();
    const user = allUsers.find((u: any) => u.email === userEmail);
    
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }
    
    await db.from('user_profiles').update(user.id, {
      subscription_status: 'free',
      usage_count: 0, // Reset their daily usage
      downgraded_at: new Date().toISOString(),
    });
    
    console.log(`✅ Successfully downgraded ${userEmail} to free`);
    return { success: true, message: `${userEmail} downgraded to free` };
    
  } catch (error) {
    console.error('Error downgrading user:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to downgrade user' 
    };
  }
};

// Get all beta testers (users who aren't admins)
export const getBetaTesters = async (db: any) => {
  try {
    const allUsers = await db.from('user_profiles').getAll();
    return allUsers.filter((user: any) => 
      user.subscription_status !== 'admin' && 
      user.email !== 'sonofyola@gmail.com' // Exclude your admin email
    );
  } catch (error) {
    console.error('Error getting beta testers:', error);
    return [];
  }
};