import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import AutoresponderConfigComponent from '../components/AutoresponderConfig';

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
  const { isUnlimited, upgradeToUnlimited, generationsToday, userEmail } = useUsage();
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const [manualUpgradeEmail, setManualUpgradeEmail] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

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
      const unlimitedEmails = await AsyncStorage.getItem('unlimited_emails');
      const emailList: string[] = unlimitedEmails ? JSON.parse(unlimitedEmails) : [];
      
      const emailToAdd = manualUpgradeEmail.toLowerCase().trim();
      
      if (emailList.includes(emailToAdd)) {
        Alert.alert('Already Unlimited', 'This email already has unlimited access.');
        setManualUpgradeEmail('');
        return;
      }

      // Add email to unlimited list
      emailList.push(emailToAdd);
      await AsyncStorage.setItem('unlimited_emails', JSON.stringify(emailList));

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

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToApp} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Panel</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Email Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Management</Text>
          
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
          {!isUnlimited && (
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
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  manualUpgradeContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.success + '40',
  },
  manualUpgradeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  manualUpgradeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  manualUpgradeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    backgroundColor: colors.background,
  },
  manualUpgradeInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
    paddingLeft: 12,
  },
  manualUpgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  currentUserUpgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  validateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  exportValidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cleanupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  cleanupButtonText: {
    color: colors.warning,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  clearButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    margin: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  moreText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  emailList: {
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emailItem: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  invalidEmailItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  duplicateEmailItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  invalidEmailText: {
    color: colors.error,
    textDecorationLine: 'line-through',
  },
  duplicateEmailText: {
    color: colors.warning,
  },
  validationBadge: {
    fontSize: 16,
    marginLeft: 8,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  tierBadge: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  timestampText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emailTimestamp: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
