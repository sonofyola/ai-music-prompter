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
    const adminEmails = ['ibeme8@gmail.com', 'drremotework@gmail.com', 'sonofyola@gmail.com'];
    
    return allUsers.filter((user: any) => 
      !adminEmails.includes(user.email)
    );
  } catch (error) {
    console.error('Error getting beta testers:', error);
    return [];
  }
};

// Sync user profiles to users table (for admin panel compatibility)
export const syncUserProfilesToUsersTable = async (db: any) => {
  try {
    console.log('🔄 Starting sync of user profiles to users table...');
    
    // Get all user profiles
    const allUserProfiles = await db.from('user_profiles').getAll();
    const allUsers = await db.from('users').getAll();
    
    console.log(`📊 Found ${allUserProfiles?.length || 0} user profiles`);
    console.log(`📊 Found ${allUsers?.length || 0} users in users table`);
    
    if (!allUserProfiles || allUserProfiles.length === 0) {
      return { success: true, message: 'No user profiles to sync', synced: 0 };
    }
    
    let syncedCount = 0;
    const adminEmails = ['ibeme8@gmail.com', 'drremotework@gmail.com', 'sonofyola@gmail.com'];
    
    for (const profile of allUserProfiles) {
      try {
        // Check if user already exists in users table
        const existingUser = allUsers?.find((u: any) => u.email === profile.email);
        
        if (!existingUser) {
          // Create user entry
          await db.from('users').add({
            email: profile.email,
            name: profile.email?.split('@')[0] || 'User',
            created_at: profile.created_at || new Date().toISOString(),
            last_login: new Date().toISOString(),
            is_admin: adminEmails.includes(profile.email),
          });
          
          syncedCount++;
          console.log(`✅ Synced user: ${profile.email}`);
        }
      } catch (syncError) {
        console.error(`❌ Failed to sync user ${profile.email}:`, syncError);
        // Continue with other users
      }
    }
    
    console.log(`🎉 Sync complete! Synced ${syncedCount} users to users table`);
    return { 
      success: true, 
      message: `Successfully synced ${syncedCount} users to users table`, 
      synced: syncedCount 
    };
    
  } catch (error) {
    console.error('Error syncing user profiles to users table:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to sync users',
      synced: 0
    };
  }
};
