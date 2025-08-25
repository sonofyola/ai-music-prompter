import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl, TextInput, Pressable, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import * as Clipboard from 'expo-clipboard';

interface User {
  id: string;
  email: string;
  name?: string;
  subscription_status?: string;
  usage_count?: number;
  usage_limit?: number;
  created_at?: string;
  last_active?: string;
}

interface PromptHistoryItem {
  id: string;
  user_id: string;
  generated_prompt: string;
  created_at: string;
}

export default function AdminScreen() {
  const { user, db } = useBasic();
  const [users, setUsers] = useState<User[]>([]);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUsageLimit, setNewUsageLimit] = useState('');

  const isAdmin = user?.email === 'drremotework@gmail.com';

  const fetchAdminData = React.useCallback(async () => {
    if (!db || !isAdmin) return;
    
    try {
      const historyData = await db.from('prompt_history').getAll();
      const usersData = await db.from('users').getAll();
      
      if (historyData) {
        setTotalPrompts(historyData.length);
        
        // Get unique users from history
        const userMap = new Map();
        historyData.forEach((item: any) => {
          const historyItem = item as PromptHistoryItem;
          if (!userMap.has(historyItem.user_id)) {
            userMap.set(historyItem.user_id, {
              id: historyItem.user_id,
              email: historyItem.user_id,
              usage_count: 1,
              last_active: historyItem.created_at
            });
          } else {
            const existingUser = userMap.get(historyItem.user_id);
            existingUser.usage_count += 1;
            if (new Date(historyItem.created_at) > new Date(existingUser.last_active)) {
              existingUser.last_active = historyItem.created_at;
            }
          }
        });
        
        // Merge with users data if available
        if (usersData) {
          usersData.forEach((userData: any) => {
            const user = userData as User;
            if (userMap.has(user.id)) {
              const existingUser = userMap.get(user.id);
              userMap.set(user.id, { ...existingUser, ...user });
            } else {
              userMap.set(user.id, { ...user, usage_count: 0 });
            }
          });
        }
        
        setUsers(Array.from(userMap.values()));
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      Alert.alert('Error', 'Failed to load admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [db, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [fetchAdminData, isAdmin]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminData();
  };

  const exportEmails = async () => {
    try {
      const allEmails = users.map(user => user.email).join('\n');
      const proEmails = users
        .filter(user => user.subscription_status === 'pro' || user.usage_limit === -1)
        .map(user => user.email)
        .join('\n');
      const freeEmails = users
        .filter(user => user.subscription_status !== 'pro' && user.usage_limit !== -1)
        .map(user => user.email)
        .join('\n');

      const exportData = `AI Music Prompter - Email Export
Generated: ${new Date().toLocaleString()}

ALL USERS (${users.length} total):
${allEmails}

PRO USERS (${users.filter(u => u.subscription_status === 'pro' || u.usage_limit === -1).length} total):
${proEmails}

FREE USERS (${users.filter(u => u.subscription_status !== 'pro' && u.usage_limit !== -1).length} total):
${freeEmails}`;

      // Try to share first, fallback to clipboard
      try {
        await Share.share({
          message: exportData,
          title: 'AI Music Prompter - Email Export'
        });
      } catch {
        // If sharing fails, copy to clipboard
        await Clipboard.setStringAsync(exportData);
        Alert.alert('Exported!', 'Email list copied to clipboard');
      }
    } catch {
      Alert.alert('Error', 'Failed to export emails');
    }
  };

  const upgradeUserToPro = async (userId: string) => {
    try {
      await db.from('users').update(userId, {
        subscription_status: 'pro',
        usage_limit: -1
      });
      
      const updatedUsers = await db.from('users').getAll();
      if (updatedUsers) {
        setUsers(updatedUsers.map(userData => ({
          id: String(userData.id || userData.email || ''),
          email: String(userData.email || userData.id || ''),
          name: String(userData.name || ''),
          subscription_status: String(userData.subscription_status || 'free'),
          usage_count: Number(userData.usage_count || 0),
          usage_limit: Number(userData.usage_limit || 10),
          created_at: String(userData.created_at || ''),
          last_active: String(userData.last_active || '')
        })));
      }
      
      Alert.alert('Success', 'User upgraded to Pro successfully!');
    } catch (upgradeError) {
      console.error('Error upgrading user:', upgradeError);
      Alert.alert('Error', `Failed to upgrade user: ${upgradeError instanceof Error ? upgradeError.message : 'Unknown error'}`);
    }
  };

  const updateUserLimit = async (userId: string, newLimit: number) => {
    if (!db) return;
    
    try {
      let existingUser;
      try {
        existingUser = await db.from('users').get(userId);
      } catch {
        existingUser = null;
      }
      
      const updateData = {
        usage_limit: newLimit,
        last_active: new Date().toISOString()
      };
      
      if (existingUser) {
        await db.from('users').update(userId, updateData);
      } else {
        const newUserData = {
          email: userId,
          name: '',
          usage_count: 0,
          subscription_status: 'free',
          usage_limit: newLimit,
          stripe_customer_id: '',
          subscription_end_date: '',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        };
        await db.from('users').add(newUserData);
      }
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, usage_limit: newLimit } : u
      ));
      
      Alert.alert('Success', `Usage limit updated to ${newLimit === -1 ? 'Unlimited' : newLimit}`);
      setSelectedUser(null);
      setNewUsageLimit('');
      
      fetchAdminData();
      
    } catch (updateError) {
      console.error('Error updating user limit:', updateError);
      Alert.alert(
        'Error', 
        `Failed to update usage limit: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`
      );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSubscriptionBadge = (status?: string, usageLimit?: number) => {
    if (status === 'pro' || usageLimit === -1) {
      return { text: 'PRO', color: '#4CAF50' };
    }
    return { text: 'FREE', color: '#FF9800' };
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const badge = getSubscriptionBadge(item.subscription_status, item.usage_limit);
    
    return (
      <View style={styles.userItem}>
        <View style={styles.userHeader}>
          <View style={styles.userMainInfo}>
            <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
            <Text style={styles.usageText}>
              {item.usage_count || 0} prompts
            </Text>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.userDetails}>
          <Text style={styles.detailText}>
            Limit: {item.usage_limit === -1 ? 'Unlimited' : item.usage_limit || 10}
          </Text>
          <Text style={styles.detailText}>
            Last Active: {formatDate(item.last_active)}
          </Text>
        </View>
        
        <View style={styles.userActions}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => {
              setSelectedUser(item);
              setNewUsageLimit(String(item.usage_limit || 10));
            }}
          >
            <Text style={styles.actionButtonText}>Set Limit</Text>
          </Pressable>
          
          {item.subscription_status !== 'pro' && item.usage_limit !== -1 && (
            <Pressable 
              style={[styles.actionButton, styles.upgradeButton]}
              onPress={() => upgradeUserToPro(item.id)}
            >
              <Text style={styles.actionButtonText}>Upgrade Pro</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Access Denied</Text>
          <Text style={styles.errorSubtext}>You don&apos;t have admin privileges</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading admin data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Admin Panel</Text>
        <Text style={styles.subtitle}>User Management & Analytics</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalPrompts}</Text>
          <Text style={styles.statLabel}>Total Prompts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {users.filter(u => u.subscription_status === 'pro' || u.usage_limit === -1).length}
          </Text>
          <Text style={styles.statLabel}>Pro Users</Text>
        </View>
      </View>

      {/* Export Button */}
      <View style={styles.exportContainer}>
        <Pressable style={styles.exportButton} onPress={exportEmails}>
          <Text style={styles.exportButtonText}>📧 Export Email List</Text>
        </Pressable>
      </View>

      {/* Users List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
      />

      {/* Usage Limit Modal */}
      {selectedUser && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Usage Limit</Text>
            <Text style={styles.modalSubtitle}>
              User: {selectedUser.email}
            </Text>
            
            <TextInput
              style={styles.input}
              value={newUsageLimit}
              onChangeText={setNewUsageLimit}
              placeholder="Enter usage limit (-1 for unlimited)"
              placeholderTextColor="#888888"
              keyboardType="numeric"
            />
            
            <View style={styles.modalActions}>
              <Pressable 
                style={styles.cancelButton}
                onPress={() => {
                  setSelectedUser(null);
                  setNewUsageLimit('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={styles.saveButton}
                onPress={() => {
                  const limit = parseInt(newUsageLimit);
                  if (!isNaN(limit)) {
                    updateUserLimit(selectedUser.id, limit);
                  }
                }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
  },
  errorText: {
    fontSize: 20,
    color: '#f44336',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#cccccc',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 5,
  },
  exportContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  exportButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  userItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444444',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userMainInfo: {
    flex: 1,
    marginRight: 10,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  usageText: {
    fontSize: 14,
    color: '#cccccc',
  },
  badgeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 12,
    color: '#888888',
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#666666',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
