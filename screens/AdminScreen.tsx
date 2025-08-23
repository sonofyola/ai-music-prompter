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
  const { user, signout } = useBasic();
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [manualUpgradeEmail, setManualUpgradeEmail] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [unlimitedEmails, setUnlimitedEmails] = useState<string[]>([]);

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

  useEffect(() => {
    loadEmails();
    loadUnlimitedEmails();
  }, []);

  const loadEmails = async () => {
    try {
      const storedEmails = await AsyncStorage.getItem('collected_emails');
      if (storedEmails) {
        setEmails(JSON.parse(storedEmails));
      }
    } catch {
      console.error('Error loading emails');
    }
  };

  const loadUnlimitedEmails = async () => {
    try {
      const storedUnlimitedEmails = await AsyncStorage.getItem('unlimited_emails');
      if (storedUnlimitedEmails) {
        setUnlimitedEmails(JSON.parse(storedUnlimitedEmails));
      }
    } catch {
      console.error('Error loading unlimited emails');
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

  const handleMaintenanceToggle = async (enabled: boolean) => {
    try {
      await toggleMaintenanceMode(enabled, customMaintenanceMessage);
      Alert.alert(
        'Maintenance Mode',
        enabled 
          ? 'Maintenance mode has been enabled. Users will see the maintenance screen.'
          : 'Maintenance mode has been disabled. Users can now access the app normally.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle maintenance mode. Please try again.');
    }
  };

  const updateMaintenanceMessage = async () => {
    if (!customMaintenanceMessage.trim()) {
      Alert.alert('Message Required', 'Please enter a maintenance message.');
      return;
    }

    try {
      await toggleMaintenanceMode(isMaintenanceMode, customMaintenanceMessage);
      Alert.alert('Success', 'Maintenance message has been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update maintenance message. Please try again.');
    }
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

        {/* Maintenance Mode Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Maintenance Mode</Text>
          
          <View style={styles.maintenanceContainer}>
            <View style={styles.maintenanceToggleRow}>
              <View style={styles.maintenanceToggleInfo}>
                <Text style={styles.maintenanceToggleTitle}>
                  {isMaintenanceMode ? '🔴 Maintenance Active' : '🟢 App Online'}
                </Text>
                <Text style={styles.maintenanceToggleSubtitle}>
                  {isMaintenanceMode 
                    ? 'Users see maintenance screen (admins can still access)'
                    : 'App is accessible to all users'
                  }
                </Text>
              </View>
              <Switch
                value={isMaintenanceMode}
                onValueChange={handleMaintenanceToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isMaintenanceMode ? '#fff' : colors.textSecondary}
              />
            </View>

            <View style={styles.maintenanceMessageContainer}>
              <Text style={styles.maintenanceMessageLabel}>Maintenance Message:</Text>
              <TextInput
                style={styles.maintenanceMessageInput}
                value={customMaintenanceMessage}
                onChangeText={setCustomMaintenanceMessage}
                placeholder="Enter maintenance message for users..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity 
                style={styles.updateMessageButton}
                onPress={updateMaintenanceMessage}
              >
                <MaterialIcons name="update" size={16} color="#fff" />
                <Text style={styles.updateMessageButtonText}>Update Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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

        {/* Admin-Only Sections */}
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
  maintenanceContainer: {
    gap: 16,
  },
  maintenanceToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  maintenanceToggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  maintenanceToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  maintenanceToggleSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  maintenanceMessageContainer: {
    gap: 8,
  },
  maintenanceMessageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  maintenanceMessageInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
    textAlignVertical: 'top',
  },
  updateMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  updateMessageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
});
