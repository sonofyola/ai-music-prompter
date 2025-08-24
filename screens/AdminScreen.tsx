import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';
import { upgradeBetaTester, getBetaTesters } from '../utils/adminHelpers';

interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_status?: string;
  usage_count?: number;
  stripe_customer_id?: string;
  last_reset_date?: string;
}

interface AdminScreenProps {
  onBackToApp: () => void;
}

export default function AdminScreen({ onBackToApp }: AdminScreenProps) {
  const { colors } = useTheme();
  const { user, signout, db } = useBasic();
  const [users, setUsers] = useState<User[]>([]);
  const [betaTesters, setBetaTesters] = useState<any[]>([]);
  const [upgradeEmail, setUpgradeEmail] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mock stats for now
  const stats = {
    totalUsers: users.length,
    premiumUsers: users.filter(u => u.subscription_status === 'unlimited' || u.subscription_status === 'premium').length,
    dailyPrompts: 42,
    totalPrompts: 1337
  };

  // Check if current user is admin
  const isAdmin = user?.email === 'ibeme8@gmail.com' || user?.email === 'drremotework@gmail.com' || user?.email === 'sonofyola@gmail.com';

  const loadUsers = useCallback(async () => {
    if (!db || !isAdmin) return;
    
    try {
      console.log('🔍 Loading users from database...');
      
      // Load from both tables
      const allUserProfiles = await db.from('user_profiles').getAll();
      const allUsers = await db.from('users').getAll();
      
      console.log('📊 User profiles data:', allUserProfiles);
      console.log('📊 Basic users data:', allUsers);
      console.log('📊 Number of user profiles:', allUserProfiles?.length || 0);
      console.log('📊 Number of basic users:', allUsers?.length || 0);
      
      // Merge data from both tables
      const mergedUsers: User[] = [];
      
      // First, add all user profiles
      if (allUserProfiles) {
        allUserProfiles.forEach((profile: any) => {
          mergedUsers.push({
            id: profile.id,
            email: profile.email as string,
            created_at: profile.created_at as string,
            subscription_status: profile.subscription_status as string,
            usage_count: profile.usage_count as number,
            stripe_customer_id: profile.stripe_customer_id as string,
            last_reset_date: profile.last_reset_date as string,
          });
        });
      }
      
      // Then, add users who don't have profiles yet
      if (allUsers) {
        allUsers.forEach((user: any) => {
          const existingProfile = mergedUsers.find(u => u.email === user.email);
          if (!existingProfile) {
            mergedUsers.push({
              id: user.id,
              email: user.email as string,
              created_at: user.created_at as string,
              subscription_status: 'free', // Default status
              usage_count: 0,
              stripe_customer_id: '',
              last_reset_date: '',
            });
          }
        });
      }
      
      console.log('📊 Merged users:', mergedUsers);
      setUsers(mergedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  }, [db, isAdmin]);

  const loadBetaTesters = useCallback(async () => {
    if (!db) return;
    try {
      console.log('🔍 Loading beta testers...');
      const testers = await getBetaTesters(db);
      console.log('👥 Beta testers found:', testers);
      console.log('👥 Number of beta testers:', testers?.length || 0);
      setBetaTesters(testers);
    } catch (error) {
      console.error('Error loading beta testers:', error);
    }
  }, [db]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadBetaTesters();
    }
  }, [isAdmin, loadUsers, loadBetaTesters]);

  const handleUpgradeBetaTester = async () => {
    if (!db || !upgradeEmail.trim()) return;
    
    setIsUpgrading(true);
    try {
      const result = await upgradeBetaTester(db, upgradeEmail.trim());
      Alert.alert(
        result.success ? 'Success!' : 'Error',
        result.message,
        [{ text: 'OK', onPress: () => {
          if (result.success) {
            setUpgradeEmail('');
            loadUsers();
            loadBetaTesters();
          }
        }}]
      );
    } catch {
      Alert.alert('Error', 'Failed to upgrade user. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleQuickUpgrade = async (email: string) => {
    if (!db) return;
    
    Alert.alert(
      'Upgrade Beta Tester',
      `Upgrade ${email} to unlimited access?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: async () => {
            const result = await upgradeBetaTester(db, email);
            Alert.alert(
              result.success ? 'Success!' : 'Error',
              result.message,
              [{ text: 'OK', onPress: () => {
                loadUsers();
                loadBetaTesters();
              }}]
            );
          }
        }
      ]
    );
  };

  const handleCreateMissingProfiles = async () => {
    if (!db) return;
    
    try {
      const allUsers = await db.from('users').getAll();
      const allUserProfiles = await db.from('user_profiles').getAll();
      
      const usersWithoutProfiles = allUsers.filter((user: any) => 
        !allUserProfiles.find((profile: any) => profile.email === user.email)
      );
      
      if (usersWithoutProfiles.length === 0) {
        Alert.alert('Info', 'All users already have profiles.');
        return;
      }
      
      for (const user of usersWithoutProfiles) {
        await db.from('user_profiles').add({
          email: user.email,
          created_at: user.created_at || new Date().toISOString(),
          usage_count: 0,
          last_reset_date: new Date().toISOString(),
          subscription_status: 'free',
          stripe_customer_id: '',
        });
      }
      
      Alert.alert(
        'Success!', 
        `Created profiles for ${usersWithoutProfiles.length} users.`,
        [{ text: 'OK', onPress: () => {
          loadUsers();
          loadBetaTesters();
        }}]
      );
    } catch (error) {
      console.error('Error creating profiles:', error);
      Alert.alert('Error', 'Failed to create user profiles.');
    }
  };

  const handleExportUsers = async () => {
    if (!users.length) {
      Alert.alert('No Data', 'No users to export.');
      return;
    }

    setIsExporting(true);
    try {
      const csvContent = 'Email,Created,Subscription Status,Usage Count\n' + 
        users.map(user => 
          `${user.email},${user.created_at},${user.subscription_status || 'free'},${user.usage_count || 0}`
        ).join('\n');
      
      await Clipboard.setStringAsync(csvContent);
      Alert.alert('Success', 'User data copied to clipboard as CSV format.');
    } catch (error) {
      console.error('Error exporting users:', error);
      Alert.alert('Error', 'Failed to export user data.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadUsers(), loadBetaTesters()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleMaintenance = () => {
    setMaintenanceMode(!maintenanceMode);
    Alert.alert(
      'Maintenance Mode',
      `Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}.`,
      [{ text: 'OK' }]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signout();
              onBackToApp();
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAdminContainer}>
          <Text style={styles.notAdminText}>Access Denied</Text>
          <Text style={styles.notAdminSubtext}>You don&apos;t have admin privileges.</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBackToApp}>
            <Text style={styles.backButtonText}>← Back to App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={onBackToApp}>
              <Text style={styles.backButtonText}>← Back to App</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>🛠️ Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage users, monitor usage, and system settings</Text>
        </View>

        {/* Debug info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐛 Debug Info</Text>
          <Text style={styles.debugText}>Database connected: {db ? '✅ Yes' : '❌ No'}</Text>
          <Text style={styles.debugText}>Is Admin: {isAdmin ? '✅ Yes' : '❌ No'}</Text>
          <Text style={styles.debugText}>Total users shown: {users.length}</Text>
          <Text style={styles.debugText}>Beta testers loaded: {betaTesters.length}</Text>
          <Text style={styles.debugText}>Current user: {user?.email || 'None'}</Text>
          <Text style={styles.debugText}>Looking for: discountsaas8@gmail.com</Text>
          <Text style={styles.debugText}>Found in users: {users.some(u => u.email === 'discountsaas8@gmail.com') ? '✅ Yes' : '❌ No'}</Text>
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={async () => {
              console.log('🔍 Current users state:', users);
              console.log('🔍 Current beta testers state:', betaTesters);
              
              // Let's also check the raw database data
              if (db) {
                try {
                  const rawUsers = await db.from('users').getAll();
                  const rawProfiles = await db.from('user_profiles').getAll();
                  console.log('🔍 Raw users table:', rawUsers);
                  console.log('🔍 Raw user_profiles table:', rawProfiles);
                  
                  // Check specifically for the test user
                  const testUser = rawUsers?.find((u: any) => u.email === 'discountsaas8@gmail.com');
                  const testProfile = rawProfiles?.find((p: any) => p.email === 'discountsaas8@gmail.com');
                  console.log('🔍 Test user in users table:', testUser);
                  console.log('🔍 Test user in profiles table:', testProfile);
                } catch (error) {
                  console.error('Error fetching raw data:', error);
                }
              }
            }}
          >
            <Text style={styles.debugButtonText}>📋 Log Detailed State</Text>
          </TouchableOpacity>
        </View>

        {/* Quick stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.premiumUsers}</Text>
              <Text style={styles.statLabel}>Premium Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.dailyPrompts}</Text>
              <Text style={styles.statLabel}>Daily Prompts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalPrompts}</Text>
              <Text style={styles.statLabel}>Total Prompts</Text>
            </View>
          </View>
        </View>

        {/* All Users List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 All Users ({users.length})</Text>
          
          {users.length > 0 ? (
            <View style={styles.usersContainer}>
              {/* Table header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.emailColumn]}>Email</Text>
                <Text style={[styles.tableHeaderText, styles.statusColumn]}>Status</Text>
                <Text style={[styles.tableHeaderText, styles.usageColumn]}>Usage</Text>
                <Text style={[styles.tableHeaderText, styles.dateColumn]}>Created</Text>
                <Text style={[styles.tableHeaderText, styles.actionsColumn]}>Actions</Text>
              </View>

              {/* Table rows */}
              {users
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((user) => (
                <View key={user.id} style={styles.tableRow}>
                  <Text style={[styles.tableCellText, styles.emailColumn]} numberOfLines={1}>
                    {user.email}
                  </Text>
                  <View style={[styles.tableCell, styles.statusColumn]}>
                    <Text style={[
                      styles.statusBadge,
                      user.subscription_status === 'unlimited' && styles.statusUnlimited,
                      user.subscription_status === 'premium' && styles.statusPremium,
                      user.subscription_status === 'free' && styles.statusFree
                    ]}>
                      {user.subscription_status || 'free'}
                    </Text>
                  </View>
                  <Text style={[styles.tableCellText, styles.usageColumn]}>
                    {user.usage_count || 0}
                  </Text>
                  <Text style={[styles.tableCellText, styles.dateColumn]} numberOfLines={1}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </Text>
                  <View style={[styles.tableCell, styles.actionsColumn]}>
                    {user.subscription_status !== 'unlimited' && (
                      <TouchableOpacity 
                        style={styles.quickUpgradeButton}
                        onPress={() => handleQuickUpgrade(user.email)}
                      >
                        <Text style={styles.quickUpgradeButtonText}>⬆️</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>No users found</Text>
          )}
        </View>

        {/* Beta Tester Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Beta Tester Management</Text>
          
          {/* Upgrade controls */}
          <View style={styles.upgradeControls}>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter user email to upgrade..."
              value={upgradeEmail}
              onChangeText={setUpgradeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={[styles.upgradeButton, !upgradeEmail.trim() && styles.upgradeButtonDisabled]}
              onPress={handleUpgradeBetaTester}
              disabled={!upgradeEmail.trim() || isUpgrading}
            >
              <Text style={styles.upgradeButtonText}>
                {isUpgrading ? 'Upgrading...' : '⬆️ Upgrade to Unlimited'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Beta testers list */}
          {betaTesters.length > 0 && (
            <View style={styles.betaTestersContainer}>
              <Text style={styles.listTitle}>Current Beta Testers:</Text>
              
              {/* Table header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.emailColumn]}>Email</Text>
                <Text style={[styles.tableHeaderText, styles.statusColumn]}>Status</Text>
                <Text style={[styles.tableHeaderText, styles.usageColumn]}>Usage</Text>
                <Text style={[styles.tableHeaderText, styles.actionsColumn]}>Actions</Text>
              </View>

              {/* Table rows */}
              {betaTesters.map((user) => (
                <View key={user.id} style={styles.tableRow}>
                  <Text style={[styles.tableCellText, styles.emailColumn]} numberOfLines={1}>
                    {user.email}
                  </Text>
                  <View style={[styles.tableCell, styles.statusColumn]}>
                    <Text style={[
                      styles.statusBadge,
                      user.subscription_status === 'unlimited' && styles.statusUnlimited,
                      user.subscription_status === 'premium' && styles.statusPremium,
                      user.subscription_status === 'free' && styles.statusFree
                    ]}>
                      {user.subscription_status || 'free'}
                    </Text>
                  </View>
                  <Text style={[styles.tableCellText, styles.usageColumn]}>
                    {user.usage_count || 0}
                  </Text>
                  <View style={[styles.tableCell, styles.actionsColumn]}>
                    {user.subscription_status !== 'unlimited' && (
                      <TouchableOpacity 
                        style={styles.quickUpgradeButton}
                        onPress={() => handleQuickUpgrade(user.email)}
                      >
                        <Text style={styles.quickUpgradeButtonText}>⬆️</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* User Management Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 User Management Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCreateMissingProfiles}
            >
              <Text style={styles.actionButtonText}>
                ➕ Create Missing Profiles
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleExportUsers}
              disabled={isExporting}
            >
              <Text style={styles.actionButtonText}>
                {isExporting ? '📤 Exporting...' : '📤 Export User Emails'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRefreshData}
              disabled={isRefreshing}
            >
              <Text style={styles.actionButtonText}>
                {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Data'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ System Settings</Text>
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Maintenance Mode</Text>
              <TouchableOpacity 
                style={[styles.toggle, maintenanceMode && styles.toggleActive]}
                onPress={handleToggleMaintenance}
              >
                <View style={[styles.toggleThumb, maintenanceMode && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
            <Text style={styles.settingDescription}>
              When enabled, only admins can access the app
            </Text>
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  notAdminContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notAdminText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 8,
  },
  notAdminSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  debugText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  debugButton: {
    backgroundColor: colors.textTertiary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 80,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  usersContainer: {
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  upgradeControls: {
    marginBottom: 20,
  },
  emailInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  betaTestersContainer: {
    marginTop: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: {
    justifyContent: 'center',
  },
  tableCellText: {
    fontSize: 14,
    color: colors.text,
  },
  emailColumn: {
    flex: 2.5,
  },
  statusColumn: {
    flex: 1,
    alignItems: 'center',
  },
  usageColumn: {
    flex: 0.8,
    textAlign: 'center',
  },
  dateColumn: {
    flex: 1,
    textAlign: 'center',
  },
  actionsColumn: {
    flex: 0.8,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 60,
  },
  statusUnlimited: {
    backgroundColor: colors.success + '20',
    color: colors.success,
  },
  statusPremium: {
    backgroundColor: colors.primary + '20',
    color: colors.primary,
  },
  statusFree: {
    backgroundColor: colors.textTertiary + '20',
    color: colors.textTertiary,
  },
  quickUpgradeButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickUpgradeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsContainer: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: colors.success,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  signOutButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
