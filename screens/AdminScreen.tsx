import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import AutoresponderConfigComponent from '../components/AutoresponderConfig';
import NotificationSettings from '../components/NotificationSettings';

interface EmailRecord {
  email: string;
  tier: 'free' | 'premium';
  timestamp: string;
  source: 'registration' | 'upgrade';
}

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_login?: string;
  is_admin: boolean;
}

interface ValidationResult {
  valid: EmailRecord[];
  invalid: EmailRecord[];
  duplicates: EmailRecord[];
}

interface AdminScreenProps {
  onBackToApp: () => void;
}

export default function AdminScreen({ onBackToApp }: AdminScreenProps) {
  const { colors } = useTheme();
  const { subscriptionStatus, upgradeToUnlimited } = useUsage();
  const { user, signout, db } = useBasic();
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [manualUpgradeEmail, setManualUpgradeEmail] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [unlimitedEmails, setUnlimitedEmails] = useState<string[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Check if current user is admin
  const isAdmin = user?.email === 'ibeme8@gmail.com' || user?.email === 'drremotework@gmail.com';

  useEffect(() => {
    loadEmails();
    loadUnlimitedEmails();
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    if (!db || !isAdmin) return;
    
    setIsLoadingUsers(true);
    try {
      const allUsers = await db.from('users').getAll();
      // Convert the database records to our User type
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
      `Are you sure you want to permanently delete user "${userEmail}"? This will also delete all their data including prompts and profile information.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete from users table
              await db.from('users').delete(userId);
              
              // Delete from user_profiles table (find by email)
              const userProfiles = await db.from('user_profiles').getAll();
              const userProfile = userProfiles?.find(profile => profile.email === userEmail);
              if (userProfile) {
                await db.from('user_profiles').delete(userProfile.id);
              }
              
              // Delete from prompt_history table (find by user_id)
              const promptHistory = await db.from('prompt_history').getAll();
              const userPrompts = promptHistory?.filter(prompt => prompt.user_id === userId);
              if (userPrompts) {
                for (const prompt of userPrompts) {
                  await db.from('prompt_history').delete(prompt.id);
                }
              }
              
              // Refresh users list
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

  // Enhanced email validation
  const isValidEmail = (email: string): boolean => {
    // Basic regex pattern for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Additional checks
    const hasValidLength = email.length >= 5 && email.length <= 254;
    const hasValidLocalPart = email.split('@')[0]?.length <= 64;
    const hasValidDomain = email.split('@')[1]?.length <= 253;
    const noConsecutiveDots = !email.includes('..');
    const noStartEndDots = !email.startsWith('.') && !email.endsWith('.');
    
    return emailRegex.test(email) && 
           hasValidLength && 
           hasValidLocalPart && 
           hasValidDomain && 
           noConsecutiveDots && 
           noStartEndDots;
  };

  const loadEmails = async () => {
    try {
      const storedEmails = await AsyncStorage.getItem('collected_emails');
      if (storedEmails) {
        setEmails(JSON.parse(storedEmails));
      }
    } catch (error) {
      console.error('Error loading emails:', error);
    }
  };

  const loadUnlimitedEmails = async () => {
    try {
      const storedUnlimitedEmails = await AsyncStorage.getItem('unlimited_emails');
      if (storedUnlimitedEmails) {
        setUnlimitedEmails(JSON.parse(storedUnlimitedEmails));
      }
    } catch (error) {
      console.error('Error loading unlimited emails:', error);
    }
  };

  // Calculate validation stats
  const validEmails = validationResult ? validationResult.valid : emails.filter(record => isValidEmail(record.email));
  const invalidEmails = validationResult ? validationResult.invalid : emails.filter(record => !isValidEmail(record.email));

  const handleAdminUpgrade = async () => {
    Alert.alert(
      'Admin Upgrade',
      'Enable unlimited generations for this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Enable Unlimited', 
          onPress: async () => {
            await upgradeToUnlimited();
            Alert.alert('Success!', 'Unlimited access enabled! 🎉');
          }
        }
      ]
    );
  };

  const handleManualUpgrade = async () => {
    if (!manualUpgradeEmail.trim()) {
      Alert.alert('Email Required', 'Please enter an email address to upgrade.');
      return;
    }

    if (!isValidEmail(manualUpgradeEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsUpgrading(true);

    try {
      // Get current unlimited emails list
      const unlimitedEmailsData = await AsyncStorage.getItem('unlimited_emails');
      const emailList: string[] = unlimitedEmailsData ? JSON.parse(unlimitedEmailsData) : [];
      
      const emailToAdd = manualUpgradeEmail.toLowerCase().trim();
      
      if (emailList.includes(emailToAdd)) {
        Alert.alert('Already Unlimited', 'This email already has unlimited access.');
        setManualUpgradeEmail('');
        return;
      }

      // Add email to unlimited list
      emailList.push(emailToAdd);
      await AsyncStorage.setItem('unlimited_emails', JSON.stringify(emailList));
      setUnlimitedEmails(emailList); // Update state

      // Update the email record if it exists in collected emails
      const storedEmails = await AsyncStorage.getItem('collected_emails');
      if (storedEmails) {
        const emailRecords: EmailRecord[] = JSON.parse(storedEmails);
        const updatedRecords = emailRecords.map(record => {
          if (record.email.toLowerCase() === emailToAdd) {
            return { ...record, tier: 'premium' as const };
          }
          return record;
        });
        await AsyncStorage.setItem('collected_emails', JSON.stringify(updatedRecords));
        setEmails(updatedRecords);
      }

      Alert.alert(
        'Success! 🎉', 
        `${manualUpgradeEmail} has been upgraded to unlimited access.`
      );
      setManualUpgradeEmail('');
      
    } catch (error) {
      console.error('Error upgrading email:', error);
      Alert.alert('Upgrade Failed', 'Could not upgrade email. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const validateEmails = async () => {
    setIsValidating(true);
    
    try {
      const valid: EmailRecord[] = [];
      const invalid: EmailRecord[] = [];
      const duplicates: EmailRecord[] = [];
      const seenEmails = new Set<string>();

      emails.forEach(record => {
        const emailLower = record.email.toLowerCase().trim();
        
        // Check for duplicates
        if (seenEmails.has(emailLower)) {
          duplicates.push(record);
          return;
        }
        seenEmails.add(emailLower);

        // Check validity
        if (isValidEmail(record.email)) {
          valid.push(record);
        } else {
          invalid.push(record);
        }
      });

      setValidationResult({ valid, invalid, duplicates });
      setShowValidationDetails(true);
      
      Alert.alert(
        'Validation Complete',
        `✅ Valid: ${valid.length}\n❌ Invalid: ${invalid.length}\n🔄 Duplicates: ${duplicates.length}`,
        [{ text: 'View Details', onPress: () => setShowValidationDetails(true) }]
      );
    } catch (error) {
      console.error('Validation error:', error);
      Alert.alert('Validation Failed', 'Could not validate emails. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const exportToCSV = async (emailsToExport: EmailRecord[] = emails, filename?: string) => {
    if (emailsToExport.length === 0) {
      Alert.alert('No Data', 'No emails to export.');
      return;
    }

    setIsExporting(true);

    try {
      // Create CSV content with additional validation info
      const csvHeader = 'Email,Tier,Timestamp,Source,Status\n';
      const csvContent = emailsToExport.map(record => {
        const status = validationResult ? 
          (validationResult.valid.includes(record) ? 'Valid' : 
           validationResult.invalid.includes(record) ? 'Invalid' : 
           validationResult.duplicates.includes(record) ? 'Duplicate' : 'Unknown') : 
          'Not Validated';
        
        return `"${record.email}","${record.tier}","${record.timestamp}","${record.source}","${status}"`;
      }).join('\n');
      
      const csvData = csvHeader + csvContent;
      const defaultFilename = `email_export_${new Date().toISOString().split('T')[0]}.csv`;
      const finalFilename = filename || defaultFilename;

      if (Platform.OS === 'web') {
        // Web-specific export using download
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', finalFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        Alert.alert('Success', `CSV file "${finalFilename}" has been downloaded!`);
      } else {
        // Mobile export using FileSystem and Sharing
        const fileUri = FileSystem.documentDirectory + finalFilename;
        
        await FileSystem.writeAsStringAsync(fileUri, csvData, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Export Email List',
          });
        } else {
          Alert.alert('Success', `CSV exported to: ${fileUri}`);
        }
      }

    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'Could not export emails. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportValidOnly = () => {
    if (!validationResult) {
      Alert.alert('Validation Required', 'Please validate emails first.');
      return;
    }
    exportToCSV(validationResult.valid, `valid_emails_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const cleanupInvalidEmails = async () => {
    if (!validationResult) {
      Alert.alert('Validation Required', 'Please validate emails first.');
      return;
    }

    Alert.alert(
      'Clean Up Invalid Emails',
      `This will permanently remove ${validationResult.invalid.length + validationResult.duplicates.length} invalid/duplicate emails. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clean Up', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('collected_emails', JSON.stringify(validationResult.valid));
              setEmails(validationResult.valid);
              setValidationResult(null);
              setShowValidationDetails(false);
              Alert.alert('Success', 'Invalid and duplicate emails have been removed.');
            } catch (error) {
              Alert.alert('Error', 'Could not clean up emails. Please try again.');
            }
          }
        }
      ]
    );
  };

  const clearAllEmails = () => {
    Alert.alert(
      'Clear All Emails',
      'Are you sure you want to delete all collected emails? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('collected_emails');
            setEmails([]);
            setValidationResult(null);
            setShowValidationDetails(false);
            Alert.alert('Success', 'All emails have been cleared.');
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

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBackToApp} 
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Admin Panel</Text>
        
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
        >
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Admin Status Indicator */}
        <View style={styles.section}>
          <View style={styles.adminStatusContainer}>
            <MaterialIcons name="admin-panel-settings" size={24} color={colors.primary} />
            <Text style={styles.adminStatusText}>Admin Access Active</Text>
            <Text style={styles.adminStatusSubtext}>
              Signed in as: {user?.email || 'Unknown'}
            </Text>
            <Text style={styles.adminStatusSubtext}>
              You have full administrative privileges
            </Text>
          </View>
        </View>

        {/* User Management Section */}
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
                              <MaterialIcons name="admin-panel-settings" size={16} color="#fff" />
                              <Text style={styles.actionButtonText}>Make Admin</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={styles.removeAdminButton}
                              onPress={() => removeAdminPrivileges(userData.id, userData.email)}
                            >
                              <MaterialIcons name="remove-moderator" size={16} color="#fff" />
                              <Text style={styles.actionButtonText}>Remove Admin</Text>
                            </TouchableOpacity>
                          )}
                          
                          <TouchableOpacity
                            style={styles.deleteUserButton}
                            onPress={() => deleteUser(userData.id, userData.email)}
                          >
                            <MaterialIcons name="delete-forever" size={16} color="#fff" />
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

        {/* Email Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📧 Email Management</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{emails.length}</Text>
              <Text style={styles.statLabel}>Total Emails</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{validEmails.length}</Text>
              <Text style={styles.statLabel}>Valid Emails</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{invalidEmails.length}</Text>
              <Text style={styles.statLabel}>Invalid Emails</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{unlimitedEmails.length}</Text>
              <Text style={styles.statLabel}>Unlimited Users</Text>
            </View>
          </View>

          {/* Manual Email Upgrade Section */}
          <View style={styles.manualUpgradeContainer}>
            <Text style={styles.manualUpgradeTitle}>🔓 Manual Account Upgrade</Text>
            <Text style={styles.manualUpgradeSubtitle}>
              Enter any email address to grant unlimited access
            </Text>
            
            <View style={styles.manualUpgradeInputContainer}>
              <MaterialIcons name="email" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.manualUpgradeInput}
                value={manualUpgradeEmail}
                onChangeText={setManualUpgradeEmail}
                placeholder="user@example.com"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.manualUpgradeButton, isUpgrading && styles.disabledButton]}
              onPress={handleManualUpgrade}
              disabled={isUpgrading}
            >
              <MaterialIcons name="upgrade" size={20} color="#fff" />
              <Text style={styles.buttonText}>
                {isUpgrading ? 'Upgrading...' : 'Grant Unlimited Access'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Admin Upgrade Button */}
          {subscriptionStatus !== 'unlimited' && (
            <TouchableOpacity 
              style={styles.currentUserUpgradeButton}
              onPress={handleAdminUpgrade}
            >
              <MaterialIcons name="admin-panel-settings" size={20} color="#fff" />
              <Text style={styles.buttonText}>Enable Unlimited (Current User)</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.validateButton, isValidating && styles.disabledButton]}
            onPress={validateEmails}
            disabled={isValidating}
          >
            <MaterialIcons name="verified" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {isValidating ? 'Validating...' : 'Validate Emails'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.exportButton, isExporting && styles.disabledButton]}
            onPress={() => exportToCSV()}
            disabled={isExporting}
          >
            <MaterialIcons name="file-download" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {isExporting ? 'Exporting...' : 'Export All to CSV'}
            </Text>
          </TouchableOpacity>

          {validationResult && (
            <>
              <TouchableOpacity 
                style={[styles.exportValidButton, isExporting && styles.disabledButton]}
                onPress={exportValidOnly}
                disabled={isExporting}
              >
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>Export Valid Only</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cleanupButton}
                onPress={cleanupInvalidEmails}
              >
                <MaterialIcons name="cleaning-services" size={20} color={colors.warning} />
                <Text style={styles.cleanupButtonText}>Remove Invalid/Duplicates</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.clearButton} onPress={clearAllEmails}>
            <MaterialIcons name="delete-forever" size={20} color={colors.error} />
            <Text style={styles.clearButtonText}>Clear All Emails</Text>
          </TouchableOpacity>
        </View>

        {/* Autoresponder Configuration Section */}
        <View style={styles.section}>
          <AutoresponderConfigComponent />
        </View>

        {/* Notification Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Admin Notification Settings</Text>
          <Text style={styles.sectionSubtitle}>
            Configure system-wide notification preferences
          </Text>
          <NotificationSettings />
        </View>

        {/* Validation Details */}
        {showValidationDetails && validationResult && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>📋 Validation Details</Text>
            
            {validationResult.invalid.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>❌ Invalid Emails ({validationResult.invalid.length})</Text>
                {validationResult.invalid.slice(0, 5).map((record, index) => (
                  <View key={index} style={[styles.emailItem, styles.invalidEmailItem]}>
                    <Text style={styles.invalidEmailText}>{record.email}</Text>
                    <Text style={styles.emailTimestamp}>
                      {new Date(record.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
                {validationResult.invalid.length > 5 && (
                  <Text style={styles.moreText}>... and {validationResult.invalid.length - 5} more</Text>
                )}
              </View>
            )}

            {validationResult.duplicates.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>🔄 Duplicate Emails ({validationResult.duplicates.length})</Text>
                {validationResult.duplicates.slice(0, 5).map((record, index) => (
                  <View key={index} style={[styles.emailItem, styles.duplicateEmailItem]}>
                    <Text style={styles.duplicateEmailText}>{record.email}</Text>
                    <Text style={styles.emailTimestamp}>
                      {new Date(record.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
                {validationResult.duplicates.length > 5 && (
                  <Text style={styles.moreText}>... and {validationResult.duplicates.length - 5} more</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Recent Emails List */}
        <View style={styles.emailList}>
          <Text style={styles.listTitle}>Recent Emails:</Text>
          {emails.slice(-10).reverse().map((record, index) => {
            const isValid = validationResult ? validationResult.valid.includes(record) : null;
            const isInvalid = validationResult ? validationResult.invalid.includes(record) : null;
            const isDuplicate = validationResult ? validationResult.duplicates.includes(record) : null;
            
            return (
              <View key={index} style={[
                styles.emailItem,
                isInvalid && styles.invalidEmailItem,
                isDuplicate && styles.duplicateEmailItem
              ]}>
                <View style={styles.emailHeader}>
                  <Text style={[
                    styles.emailText,
                    isInvalid && styles.invalidEmailText,
                    isDuplicate && styles.duplicateEmailText
                  ]}>
                    {record.email}
                  </Text>
                  {validationResult && (
                    <Text style={[
                      styles.validationBadge,
                      isValid && styles.validBadge,
                      isInvalid && styles.invalidBadge,
                      isDuplicate && styles.duplicateBadge
                    ]}>
                      {isValid ? '✅' : isInvalid ? '❌' : isDuplicate ? '🔄' : '?'}
                    </Text>
                  )}
                </View>
                <View style={styles.emailMeta}>
                  <Text style={styles.tierBadge}>{record.tier}</Text>
                  <Text style={styles.timestampText}>
                    {new Date(record.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          })}
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
  manualUpgradeContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  manualUpgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  manualUpgradeSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  manualUpgradeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  manualUpgradeInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  manualUpgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  currentUserUpgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  validateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.info,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  exportValidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  cleanupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.warning,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cleanupButtonText: {
    color: colors.warning,
    fontWeight: '600',
    fontSize: 14,
  },
  clearButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  detailsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emailList: {
    marginTop: 16,
    marginBottom: 32,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emailItem: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  invalidEmailItem: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  duplicateEmailItem: {
    borderColor: colors.warning,
    backgroundColor: colors.warning + '10',
  },
  emailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  invalidEmailText: {
    color: colors.error,
  },
  duplicateEmailText: {
    color: colors.warning,
  },
  validationBadge: {
    fontSize: 16,
  },
  validBadge: {
    color: colors.success,
  },
  invalidBadge: {
    color: colors.error,
  },
  duplicateBadge: {
    color: colors.warning,
  },
  emailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  timestampText: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  emailTimestamp: {
    fontSize: 10,
    color: colors.textTertiary,
  },
  moreText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
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
});
