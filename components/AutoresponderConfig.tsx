import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { autoresponderService, AutoresponderConfig } from '../utils/autoresponderService';

export default function AutoresponderConfigComponent() {
  const { colors } = useTheme();
  const [config, setConfig] = useState<AutoresponderConfig>({
    provider: 'mailchimp',
    apiKey: '',
    listId: '',
    endpoint: '',
    enabled: false,
    tags: [],
    customFields: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [syncQueueCount, setSyncQueueCount] = useState(0);

  useEffect(() => {
    loadConfig();
    loadSyncQueueCount();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await autoresponderService.loadConfig();
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error('Error loading autoresponder config:', error);
    }
  };

  const loadSyncQueueCount = async () => {
    try {
      const count = await autoresponderService.getSyncQueueCount();
      setSyncQueueCount(count);
    } catch (error) {
      console.error('Error loading sync queue count:', error);
    }
  };

  const handleSave = async () => {
    if (!config.apiKey.trim()) {
      Alert.alert('Error', 'API Key is required');
      return;
    }

    if (config.provider === 'mailchimp' && !config.listId?.trim()) {
      Alert.alert('Error', 'List ID is required for Mailchimp');
      return;
    }

    if ((config.provider === 'activecampaign' || config.provider === 'custom') && !config.endpoint?.trim()) {
      Alert.alert('Error', 'Endpoint URL is required for this provider');
      return;
    }

    setIsLoading(true);
    try {
      await autoresponderService.saveConfig(config);
      Alert.alert('Success', 'Autoresponder configuration saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const result = await autoresponderService.testConnection();
      Alert.alert(
        result.success ? 'Success' : 'Error',
        result.message
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to test connection');
    } finally {
      setIsTesting(false);
    }
  };

  const handleProcessQueue = async () => {
    setIsLoading(true);
    try {
      await autoresponderService.processSyncQueue();
      await loadSyncQueueCount();
      Alert.alert('Success', 'Sync queue processed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to process sync queue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearQueue = async () => {
    Alert.alert(
      'Clear Queue',
      'Are you sure you want to clear the sync queue? This will remove all pending contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await autoresponderService.clearSyncQueue();
              await loadSyncQueueCount();
              Alert.alert('Success', 'Sync queue cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear sync queue');
            }
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialIcons name="email" size={24} color={colors.primary} />
        <Text style={styles.title}>Autoresponder Integration</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Enable Autoresponder</Text>
          <Switch
            value={config.enabled}
            onValueChange={(enabled) => setConfig(prev => ({ ...prev, enabled }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={config.enabled ? '#fff' : colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Provider Configuration</Text>
        
        <Text style={styles.label}>Provider</Text>
        <View style={styles.providerGrid}>
          {[
            { key: 'mailchimp', label: 'Mailchimp' },
            { key: 'convertkit', label: 'ConvertKit' },
            { key: 'activecampaign', label: 'ActiveCampaign' },
            { key: 'custom', label: 'Custom API' }
          ].map((provider) => (
            <TouchableOpacity
              key={provider.key}
              style={[
                styles.providerButton,
                config.provider === provider.key && styles.providerButtonActive
              ]}
              onPress={() => setConfig(prev => ({ ...prev, provider: provider.key as any }))}
            >
              <Text style={[
                styles.providerButtonText,
                config.provider === provider.key && styles.providerButtonTextActive
              ]}>
                {provider.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>API Key</Text>
        <TextInput
          style={styles.input}
          value={config.apiKey}
          onChangeText={(apiKey) => setConfig(prev => ({ ...prev, apiKey }))}
          placeholder="Enter your API key"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
        />

        {config.provider === 'mailchimp' && (
          <>
            <Text style={styles.label}>List ID</Text>
            <TextInput
              style={styles.input}
              value={config.listId || ''}
              onChangeText={(listId) => setConfig(prev => ({ ...prev, listId }))}
              placeholder="Enter Mailchimp list ID"
              placeholderTextColor={colors.textTertiary}
            />
          </>
        )}

        {(config.provider === 'activecampaign' || config.provider === 'custom') && (
          <>
            <Text style={styles.label}>Endpoint URL</Text>
            <TextInput
              style={styles.input}
              value={config.endpoint || ''}
              onChangeText={(endpoint) => setConfig(prev => ({ ...prev, endpoint }))}
              placeholder="https://your-account.api-us1.com"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync Queue</Text>
        <Text style={styles.queueInfo}>
          {syncQueueCount} contacts pending sync
        </Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleProcessQueue}
            disabled={isLoading || syncQueueCount === 0}
          >
            <MaterialIcons name="sync" size={16} color={colors.primary} />
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Process Queue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleClearQueue}
            disabled={isLoading || syncQueueCount === 0}
          >
            <MaterialIcons name="clear" size={16} color={colors.warning} />
            <Text style={[styles.buttonText, { color: colors.warning }]}>
              Clear Queue
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <MaterialIcons name="save" size={16} color="#fff" />
          <Text style={styles.buttonText}>
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleTest}
          disabled={isTesting || !config.apiKey}
        >
          <MaterialIcons name="wifi-tethering" size={16} color={colors.primary} />
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  providerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  providerButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  providerButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  providerButtonTextActive: {
    color: '#fff',
  },
  queueInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
});