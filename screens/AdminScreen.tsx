import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

interface EmailRecord {
  email: string;
  tier: 'free' | 'premium';
  timestamp: string;
  source: 'registration' | 'upgrade';
}

export default function AdminScreen() {
  const { colors } = useTheme();
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [isExporting, setIsExporting] = useState(false);

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

  const exportToCSV = async () => {
    if (emails.length === 0) {
      Alert.alert('No Data', 'No emails to export.');
      return;
    }

    setIsExporting(true);

    try {
      // Create CSV content
      const csvHeader = 'Email,Tier,Timestamp,Source\n';
      const csvContent = emails.map(record => 
        `"${record.email}","${record.tier}","${record.timestamp}","${record.source}"`
      ).join('\n');
      
      const csvData = csvHeader + csvContent;

      // Create file
      const fileName = `email_export_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
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

    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'Could not export emails. Please try again.');
    } finally {
      setIsExporting(false);
    }
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
            Alert.alert('Success', 'All emails have been cleared.');
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <MaterialIcons name="admin-panel-settings" size={32} color={colors.primary} />
          <Text style={styles.title}>Email Export Admin</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{emails.length}</Text>
            <Text style={styles.statLabel}>Total Emails</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {emails.filter(e => e.tier === 'free').length}
            </Text>
            <Text style={styles.statLabel}>Free Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {emails.filter(e => e.tier === 'premium').length}
            </Text>
            <Text style={styles.statLabel}>Premium Users</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.exportButton, isExporting && styles.disabledButton]}
            onPress={exportToCSV}
            disabled={isExporting}
          >
            <MaterialIcons name="file-download" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {isExporting ? 'Exporting...' : 'Export to CSV'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={clearAllEmails}>
            <MaterialIcons name="delete-forever" size={20} color={colors.error} />
            <Text style={styles.clearButtonText}>Clear All Emails</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emailList}>
          <Text style={styles.listTitle}>Recent Emails:</Text>
          {emails.slice(-10).reverse().map((record, index) => (
            <View key={index} style={styles.emailItem}>
              <Text style={styles.emailText}>{record.email}</Text>
              <View style={styles.emailMeta}>
                <Text style={styles.tierBadge}>{record.tier}</Text>
                <Text style={styles.timestampText}>
                  {new Date(record.timestamp).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
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
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
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
  actionsContainer: {
    padding: 16,
    gap: 12,
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
  emailText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
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
});