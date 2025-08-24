import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';
import { upgradeBetaTester, downgradeBetaTester, getBetaTesters } from '../utils/adminHelpers';

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_login?: string;
  is_admin: boolean;
  subscription_status?: string;
  usage_count?: number;
}

interface AdminScreenProps {
  onBackToApp: () => void;
}

export default function AdminScreen({ onBackToApp }: AdminScreenProps) {
  const { colors } = useTheme();
  const { user, signout, db } = useBasic();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [betaTesters, setBetaTesters] = useState<any[]>([]);
  const [isLoadingBeta, setIsLoadingBeta] = useState(false);
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

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadBetaTesters();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    if (!db || !isAdmin) return;
    
    setIsLoadingUsers(true);
    try {
      const allUsers = await db.from('user_profiles').getAll();
      const typedUsers: User[] = (allUsers || []).map(user => ({
        id: user.id,
        email: user.email as string,
        name: user.name as string,
        created_at: user.created_at as string,
        last_login: user.last_login as string,
        is_admin: user.is_admin as boolean,
        subscription_status: user.subscription_status as string,
        usage_count: user.usage_count as number
      }));
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadBetaTesters = async () => {
    if (!db) return;
    setIsLoadingBeta(true);
    try {
      const testers = await getBetaTesters(db);
      setBetaTesters(testers);
    } catch (error) {
      console.error('Error loading beta testers:', error);
    } finally {
      setIsLoadingBeta(false);
    }
  };

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
            loadBetaTesters();
          }
        }}]
      );
    } catch (error) {
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
              [{ text: 'OK', onPress: loadBetaTesters }]
            );
          }
        }
      ]
    );
  };

  const handleExportUsers = async () => {
    if (!users.length) {
      Alert.alert('No Data', 'No users to export.');
      return;
    }

    setIsExporting(true);
    try {
      const csvContent = 'Email,Name,Created,Subscription Status,Usage Count\n' + 
        users.map(user => 
          `${user.email},"${user.name || ''}",${user.created_at},${user.subscription_status || 'free'},${user.usage_count || 0}`
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
          <Text style={styles.notAdminSubtext}>You don't have admin privileges.</Text>
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
        accessible={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text 
            style={styles.title}
            accessibilityRole="header"
            accessibilityLevel={1}
          >
            🛠️ Admin Dashboard
          </Text>
          <Text 
            style={styles.subtitle}
            accessibilityRole="text"
          >
            Manage users, monitor usage, and system settings
          </Text>
        </View>

        {/* Quick stats */}
        <View 
          style={styles.section}
          accessible={true}
          accessibilityLabel="System statistics"
          accessibilityRole="region"
        >
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
            accessibilityLevel={2}
          >
            📊 Quick Stats
          </Text>

          <View style={styles.statsGrid}>
            <View 
              style={styles.statCard}
              accessible={true}
              accessibilityLabel={`Total users: ${stats.totalUsers}`}
              accessibilityRole="text"
            >
              <Text style={styles.statNumber} accessible={false}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel} accessible={false}>Total Users</Text>
            </View>

            <View 
              style={styles.statCard}
              accessible={true}
              accessibilityLabel={`Premium users: ${stats.premiumUsers}`}
              accessibilityRole="text"
            >
              <Text style={styles.statNumber} accessible={false}>{stats.premiumUsers}</Text>
              <Text style={styles.statLabel} accessible={false}>Premium Users</Text>
            </View>

            <View 
              style={styles.statCard}
              accessible={true}
              accessibilityLabel={`Daily prompts generated: ${stats.dailyPrompts}`}
              accessibilityRole="text"
            >
              <Text style={styles.statNumber} accessible={false}>{stats.dailyPrompts}</Text>
              <Text style={styles.statLabel} accessible={false}>Daily Prompts</Text>
            </View>

            <View 
              style={styles.statCard}
              accessible={true}
              accessibilityLabel={`Total prompts generated: ${stats.totalPrompts}`}
              accessibilityRole="text"
            >
              <Text style={styles.statNumber} accessible={false}>{stats.totalPrompts}</Text>
              <Text style={styles.statLabel} accessible={false}>Total Prompts</Text>
            </View>
          </View>
        </View>

        {/* Beta Tester Management */}
        <View 
          style={styles.section}
          accessible={true}
          accessibilityLabel="Beta tester management"
          accessibilityRole="region"
        >
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
            accessibilityLevel={2}
          >
            👥 Beta Tester Management
          </Text>

          {/* Upgrade controls */}
          <View style={styles.upgradeControls}>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter user email to upgrade..."
              value={upgradeEmail}
              onChangeText={setUpgradeEmail}
              accessible={true}
              accessibilityLabel="User email for upgrade"
              accessibilityHint="Enter the email address of the user you want to upgrade to premium"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity 
              style={[styles.upgradeButton, !upgradeEmail.trim() && styles.upgradeButtonDisabled]}
              onPress={handleUpgradeBetaTester}
              disabled={!upgradeEmail.trim() || isUpgrading}
              accessible={true}
              accessibilityLabel={isUpgrading ? "Upgrading user" : "Upgrade user to unlimited"}
              accessibilityHint="Manually upgrade the specified user to unlimited premium access"
              accessibilityRole="button"
              accessibilityState={{
                disabled: !upgradeEmail.trim() || isUpgrading,
                busy: isUpgrading
              }}
            >
              <Text style={styles.upgradeButtonText}>
                {isUpgrading ? 'Upgrading...' : '⬆️ Upgrade to Unlimited'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Beta testers list */}
          {betaTesters.length > 0 && (
            <View 
              style={styles.betaTestersContainer}
              accessible={true}
              accessibilityLabel="Beta testers list"
              accessibilityRole="table"
            >
              <Text 
                style={styles.listTitle}
                accessibilityRole="header"
                accessibilityLevel={3}
              >
                Current Beta Testers:
              </Text>

              {/* Table header */}
              <View 
                style={styles.tableHeader}
                accessible={true}
                accessibilityLabel="Table headers: Email, Status, Usage, Actions"
                accessibilityRole="rowheader"
              >
                <Text style={[styles.tableHeaderText, styles.emailColumn]} accessible={false}>Email</Text>
                <Text style={[styles.tableHeaderText, styles.statusColumn]} accessible={false}>Status</Text>
                <Text style={[styles.tableHeaderText, styles.usageColumn]} accessible={false}>Usage</Text>
                <Text style={[styles.tableHeaderText, styles.actionsColumn]} accessible={false}>Actions</Text>
              </View>

              {/* Table rows */}
              {betaTesters.map((user, index) => (
                <View 
                  key={user.id}
                  style={styles.tableRow}
                  accessible={true}
                  accessibilityLabel={`User ${user.email}, status ${user.subscription_status}, usage ${user.usage_count || 0}`}
                  accessibilityRole="row"
                >
                  <Text 
                    style={[styles.tableCellText, styles.emailColumn]} 
                    accessible={false}
                    numberOfLines={1}
                  >
                    {user.email}
                  </Text>
                  
                  <View style={[styles.tableCell, styles.statusColumn]} accessible={false}>
                    <Text 
                      style={[
                        styles.statusBadge,
                        user.subscription_status === 'unlimited' && styles.statusUnlimited,
                        user.subscription_status === 'premium' && styles.statusPremium,
                        user.subscription_status === 'free' && styles.statusFree
                      ]}
                      accessible={false}
                    >
                      {user.subscription_status}
                    </Text>
                  </View>
                  
                  <Text 
                    style={[styles.tableCellText, styles.usageColumn]} 
                    accessible={false}
                  >
                    {user.usage_count || 0}
                  </Text>
                  
                  <View style={[styles.tableCell, styles.actionsColumn]} accessible={false}>
                    {user.subscription_status !== 'unlimited' && (
                      <TouchableOpacity 
                        style={styles.quickUpgradeButton}
                        onPress={() => handleQuickUpgrade(user.email)}
                        accessible={true}
                        accessibilityLabel={`Upgrade ${user.email} to unlimited`}
                        accessibilityHint="Quickly upgrade this user to unlimited premium access"
                        accessibilityRole="button"
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

        {/* User Management */}
        <View 
          style={styles.section}
          accessible={true}
          accessibilityLabel="User management tools"
          accessibilityRole="region"
        >
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
            accessibilityLevel={2}
          >
            👤 User Management
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleExportUsers}
              disabled={isExporting}
              accessible={true}
              accessibilityLabel={isExporting ? "Exporting user data" : "Export user emails"}
              accessibilityHint="Downloads a CSV file containing all user email addresses"
              accessibilityRole="button"
              accessibilityState={{
                disabled: isExporting,
                busy: isExporting
              }}
            >
              <Text style={styles.actionButtonText}>
                {isExporting ? '📤 Exporting...' : '📤 Export User Emails'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRefreshData}
              disabled={isRefreshing}
              accessible={true}
              accessibilityLabel={isRefreshing ? "Refreshing data" : "Refresh user data"}
              accessibilityHint="Reloads all user data and statistics from the database"
              accessibilityRole="button"
              accessibilityState={{
                disabled: isRefreshing,
                busy: isRefreshing
              }}
            >
              <Text style={styles.actionButtonText}>
                {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Data'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Settings */}
        <View 
          style={styles.section}
          accessible={true}
          accessibilityLabel="System settings"
          accessibilityRole="region"
        >
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
            accessibilityLevel={2}
          >
            ⚙️ System Settings
          </Text>

          <View style={styles.settingsContainer}>
            {/* Maintenance mode toggle */}
            <View 
              style={styles.settingItem}
              accessible={true}
              accessibilityLabel={`Maintenance mode is ${maintenanceMode ? 'enabled' : 'disabled'}`}
              accessibilityRole="switch"
              accessibilityState={{ checked: maintenanceMode }}
            >
              <Text style={styles.settingLabel} accessible={false}>Maintenance Mode</Text>
              <TouchableOpacity 
                style={[styles.toggle, maintenanceMode && styles.toggleActive]}
                onPress={handleToggleMaintenance}
                accessible={false} // Parent handles accessibility
              >
                <View style={[styles.toggleThumb, maintenanceMode && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>

            <Text 
              style={styles.settingDescription}
              accessibilityRole="text"
            >
              When enabled, only admins can access the app
            </Text>
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
            accessible={true}
            accessibilityLabel="Sign out of admin account"
            accessibilityHint="Logs out of the admin dashboard and returns to login screen"
            accessibilityRole="button"
          >
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
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
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
    flex: 2,
  },
  statusColumn: {
    flex: 1,
    alignItems: 'center',
  },
  usageColumn: {
    flex: 1,
    textAlign: 'center',
  },
  actionsColumn: {
    flex: 1,
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