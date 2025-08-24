import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import IconFallback from '../components/IconFallback';
import * as Clipboard from 'expo-clipboard';

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_login?: string;
  is_admin: boolean;
}

interface AdminScreenProps {
  onBackToApp: () => void;
}

export default function AdminScreen({ onBackToApp }: AdminScreenProps) {
  const { colors } = useTheme();
  const { user, signout, db } = useBasic();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Check if current user is admin
  const isAdmin = user?.email === 'ibeme8@gmail.com' || user?.email === 'drremotework@gmail.com' || user?.email === 'sonofyola@gmail.com';

  console.log('🔍 AdminScreen Debug:', {
    userEmail: user?.email,
    userId: user?.id,
    isAdmin,
    userObject: user
  });

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    if (!db || !isAdmin) return;
    
    setIsLoadingUsers(true);
    try {
      const allUsers = await db.from('users').getAll();
      const typedUsers: User[] = (allUsers || []).map(user => ({
        id: user.id,
        email: user.email as string,
        name: user.name as string,
        created_at: user.created_at as string,
        last_login: user.last_login as string,
        is_admin: user.is_admin as boolean
      }));
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!db || !isAdmin) return;

    Alert.alert(
      'Delete User',
      `Are you sure you want to permanently delete user "${userEmail}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.from('users').delete(userId);
              await loadUsers();
              Alert.alert('Success', `User "${userEmail}" has been deleted.`);
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user. Please try again.');
            }
          }
        }
      ]
    );
  };

  const makeUserAdmin = async (userId: string, userEmail: string) => {
    if (!db || !isAdmin) return;

    Alert.alert(
      'Make Admin',
      `Grant admin privileges to "${userEmail}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Make Admin',
          onPress: async () => {
            try {
              await db.from('users').update(userId, { is_admin: true });
              await loadUsers();
              Alert.alert('Success', `${userEmail} is now an admin.`);
            } catch (error) {
              console.error('Error making user admin:', error);
              Alert.alert('Error', 'Failed to update user. Please try again.');
            }
          }
        }
      ]
    );
  };

  const removeAdminPrivileges = async (userId: string, userEmail: string) => {
    if (!db || !isAdmin) return;

    Alert.alert(
      'Remove Admin',
      `Remove admin privileges from "${userEmail}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Admin',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.from('users').update(userId, { is_admin: false });
              await loadUsers();
              Alert.alert('Success', `${userEmail} is no longer an admin.`);
            } catch (error) {
              console.error('Error removing admin privileges:', error);
              Alert.alert('Error', 'Failed to update user. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signout();
              onBackToApp();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const exportUserEmails = async () => {
    if (!users.length) {
      Alert.alert('No Data', 'No users to export.');
      return;
    }

    try {
      const csvContent = 'Email,Name,Created,Last Login,Is Admin\n' + 
        users.map(user => 
          `${user.email},"${user.name || ''}",${user.created_at},${user.last_login || ''},${user.is_admin}`
        ).join('\n');
      
      // Use expo-clipboard for both web and mobile
      await Clipboard.setStringAsync(csvContent);
      Alert.alert('Success', 'User data copied to clipboard as CSV format.');
    } catch (error) {
      console.error('Error exporting users:', error);
      Alert.alert('Error', 'Failed to export user data.');
    }
  };

  const upgradeUser = async (userId: string, userEmail: string) => {
    if (!db || !isAdmin) return;

    Alert.alert(
      'Upgrade User',
      `Upgrade "${userEmail}" to premium?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: async () => {
            try {
              await db.from('users').update(userId, { 
                is_premium: true,
                premium_upgraded_at: new Date().toISOString()
              });
              await loadUsers();
              Alert.alert('Success', `${userEmail} has been upgraded to premium.`);
            } catch (error) {
              console.error('Error upgrading user:', error);
              Alert.alert('Error', 'Failed to upgrade user. Please try again.');
            }
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBackToApp} 
          style={styles.backButton}
        >
          <IconFallback name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Admin Panel</Text>
        
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
        >
          <IconFallback name="logout" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admin Status */}
        <View style={styles.section}>
          <View style={styles.adminStatusContainer}>
            <IconFallback name="admin-panel-settings" size={32} color={colors.primary} />
            <Text style={styles.adminStatusText}>Admin Access Active</Text>
            <Text style={styles.adminStatusSubtext}>
              Signed in as: {user?.email || 'Unknown'}
            </Text>
            <Text style={styles.adminStatusSubtext}>
              You have full administrative privileges
            </Text>
          </View>
        </View>

        {/* User Management */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 User Management</Text>
            <Text style={styles.sectionSubtitle}>
              Manage all registered users and their permissions
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{users.length}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{users.filter(u => u.is_admin).length}</Text>
                <Text style={styles.statLabel}>Admins</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{users.filter(u => !u.is_admin).length}</Text>
                <Text style={styles.statLabel}>Regular Users</Text>
              </View>
            </View>

            {/* Export Users Button */}
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={exportUserEmails}
            >
              <IconFallback name="download" size={20} color="#fff" />
              <Text style={styles.exportButtonText}>Export User Emails</Text>
            </TouchableOpacity>

            {isLoadingUsers ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading users...</Text>
              </View>
            ) : (
              <View style={styles.usersList}>
                <Text style={styles.listTitle}>All Users:</Text>
                {users.map((userData) => (
                  <View key={userData.id} style={[
                    styles.userItem,
                    userData.is_admin && styles.adminUserItem
                  ]}>
                    <View style={styles.userHeader}>
                      <View style={styles.userInfo}>
                        <Text style={styles.userEmail}>{userData.email}</Text>
                        {userData.name && (
                          <Text style={styles.userName}>{userData.name}</Text>
                        )}
                        <Text style={styles.userMeta}>
                          Created: {new Date(userData.created_at).toLocaleDateString()}
                        </Text>
                        {userData.last_login && (
                          <Text style={styles.userMeta}>
                            Last login: {new Date(userData.last_login).toLocaleDateString()}
                          </Text>
                        )}
                      </View>
                      
                      <View style={styles.userBadges}>
                        {userData.is_admin && (
                          <Text style={styles.adminBadge}>ADMIN</Text>
                        )}
                        {userData.email === user?.email && (
                          <Text style={styles.currentUserBadge}>YOU</Text>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.userActions}>
                      {userData.email !== user?.email && (
                        <>
                          {!userData.is_admin ? (
                            <TouchableOpacity
                              style={styles.makeAdminButton}
                              onPress={() => makeUserAdmin(userData.id, userData.email)}
                            >
                              <IconFallback name="admin-panel-settings" size={16} color="#fff" />
                              <Text style={styles.actionButtonText}>Make Admin</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={styles.removeAdminButton}
                              onPress={() => removeAdminPrivileges(userData.id, userData.email)}
                            >
                              <IconFallback name="remove-moderator" size={16} color="#fff" />
                              <Text style={styles.actionButtonText}>Remove Admin</Text>
                            </TouchableOpacity>
                          )}
                          
                          <TouchableOpacity
                            style={styles.upgradeUserButton}
                            onPress={() => upgradeUser(userData.id, userData.email)}
                          >
                            <IconFallback name="upgrade" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>Upgrade</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={styles.deleteUserButton}
                            onPress={() => deleteUser(userData.id, userData.email)}
                          >
                            <IconFallback name="delete-forever" size={16} color="#fff" />
                            <Text style={styles.actionButtonText}>Delete</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ))}
                
                {users.length === 0 && (
                  <Text style={styles.noUsersText}>No users found.</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* System Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ System Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Current User:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Admin Status:</Text>
            <Text style={styles.infoValue}>{isAdmin ? 'Active' : 'Not Admin'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Database:</Text>
            <Text style={styles.infoValue}>{db ? 'Connected' : 'Disconnected'}</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  logoutButton: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  adminStatusContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  adminStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  adminStatusSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 80,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  usersList: {
    marginTop: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  userItem: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adminUserItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  userBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  adminBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  currentUserBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  makeAdminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  removeAdminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  deleteUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  upgradeUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noUsersText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
