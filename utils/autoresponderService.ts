import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AutoresponderConfig {
  provider: 'mailchimp' | 'convertkit' | 'activecampaign' | 'aweber' | 'getresponse' | 'custom';
  apiKey: string;
  listId?: string;
  endpoint?: string;
  enabled: boolean;
  tags?: string[];
  customFields?: Record<string, string>;
}

export interface AutoresponderContact {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  subscriptionStatus?: 'free' | 'premium' | 'trial';
  signupSource?: string;
  signupDate?: string;
}

const AUTORESPONDER_CONFIG_KEY = 'autoresponder_config';
const SYNC_QUEUE_KEY = 'autoresponder_sync_queue';

class AutoresponderService {
  private config: AutoresponderConfig | null = null;

  async loadConfig(): Promise<AutoresponderConfig | null> {
    try {
      const configData = await AsyncStorage.getItem(AUTORESPONDER_CONFIG_KEY);
      if (configData) {
        this.config = JSON.parse(configData);
        return this.config;
      }
    } catch (error) {
      console.error('Error loading autoresponder config:', error);
    }
    return null;
  }

  async saveConfig(config: AutoresponderConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTORESPONDER_CONFIG_KEY, JSON.stringify(config));
      this.config = config;
    } catch (error) {
      console.error('Error saving autoresponder config:', error);
      throw error;
    }
  }

  async isEnabled(): Promise<boolean> {
    if (!this.config) {
      await this.loadConfig();
    }
    return this.config?.enabled || false;
  }

  async addToSyncQueue(contact: AutoresponderContact): Promise<void> {
    try {
      const queueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      const queue: AutoresponderContact[] = queueData ? JSON.parse(queueData) : [];
      
      // Check if contact already exists in queue
      const existingIndex = queue.findIndex(c => c.email === contact.email);
      if (existingIndex >= 0) {
        // Update existing contact
        queue[existingIndex] = { ...queue[existingIndex], ...contact };
      } else {
        // Add new contact
        queue.push({
          ...contact,
          signupDate: contact.signupDate || new Date().toISOString(),
          signupSource: contact.signupSource || 'ai_music_prompt_app'
        });
      }
      
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      
      // Try to sync immediately if enabled
      if (await this.isEnabled()) {
        await this.processSyncQueue();
      }
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  async processSyncQueue(): Promise<void> {
    if (!await this.isEnabled() || !this.config) {
      return;
    }

    try {
      const queueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (!queueData) return;

      const queue: AutoresponderContact[] = JSON.parse(queueData);
      if (queue.length === 0) return;

      console.log(`Processing ${queue.length} contacts for autoresponder sync`);

      const processedContacts: AutoresponderContact[] = [];
      const failedContacts: AutoresponderContact[] = [];

      for (const contact of queue) {
        try {
          const success = await this.syncContact(contact);
          if (success) {
            processedContacts.push(contact);
          } else {
            failedContacts.push(contact);
          }
        } catch (error) {
          console.error(`Failed to sync contact ${contact.email}:`, error);
          failedContacts.push(contact);
        }
      }

      // Keep failed contacts in queue for retry
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(failedContacts));
      
      console.log(`Autoresponder sync complete: ${processedContacts.length} synced, ${failedContacts.length} failed`);
    } catch (error) {
      console.error('Error processing sync queue:', error);
    }
  }

  private async syncContact(contact: AutoresponderContact): Promise<boolean> {
    if (!this.config) return false;

    try {
      switch (this.config.provider) {
        case 'mailchimp':
          return await this.syncToMailchimp(contact);
        case 'convertkit':
          return await this.syncToConvertKit(contact);
        case 'activecampaign':
          return await this.syncToActiveCampaign(contact);
        case 'custom':
          return await this.syncToCustomEndpoint(contact);
        default:
          console.warn(`Unsupported autoresponder provider: ${this.config.provider}`);
          return false;
      }
    } catch (error) {
      console.error(`Error syncing to ${this.config.provider}:`, error);
      return false;
    }
  }

  private async syncToMailchimp(contact: AutoresponderContact): Promise<boolean> {
    if (!this.config?.apiKey || !this.config?.listId) return false;

    const datacenter = this.config.apiKey.split('-')[1];
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${this.config.listId}/members`;

    const payload = {
      email_address: contact.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: contact.firstName || '',
        LNAME: contact.lastName || '',
        SUBSTATUS: contact.subscriptionStatus || 'free',
        SIGNUPDATE: contact.signupDate || new Date().toISOString(),
        ...contact.customFields
      },
      tags: contact.tags || this.config.tags || []
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  }

  private async syncToConvertKit(contact: AutoresponderContact): Promise<boolean> {
    if (!this.config?.apiKey) return false;

    const url = 'https://api.convertkit.com/v3/subscribers';

    const payload = {
      api_key: this.config.apiKey,
      email: contact.email,
      first_name: contact.firstName,
      fields: {
        last_name: contact.lastName,
        subscription_status: contact.subscriptionStatus || 'free',
        signup_date: contact.signupDate || new Date().toISOString(),
        signup_source: contact.signupSource || 'ai_music_prompt_app',
        ...contact.customFields
      },
      tags: contact.tags || this.config.tags || []
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  }

  private async syncToActiveCampaign(contact: AutoresponderContact): Promise<boolean> {
    if (!this.config?.apiKey || !this.config?.endpoint) return false;

    const url = `${this.config.endpoint}/api/3/contacts`;

    const payload = {
      contact: {
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        fieldValues: [
          {
            field: 'subscription_status',
            value: contact.subscriptionStatus || 'free'
          },
          {
            field: 'signup_date',
            value: contact.signupDate || new Date().toISOString()
          },
          {
            field: 'signup_source',
            value: contact.signupSource || 'ai_music_prompt_app'
          }
        ]
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Api-Token': this.config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  }

  private async syncToCustomEndpoint(contact: AutoresponderContact): Promise<boolean> {
    if (!this.config?.endpoint) return false;

    const payload = {
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      subscriptionStatus: contact.subscriptionStatus || 'free',
      signupDate: contact.signupDate || new Date().toISOString(),
      signupSource: contact.signupSource || 'ai_music_prompt_app',
      tags: contact.tags || this.config.tags || [],
      customFields: contact.customFields || {}
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    return response.ok;
  }

  async getSyncQueueCount(): Promise<number> {
    try {
      const queueData = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      if (queueData) {
        const queue: AutoresponderContact[] = JSON.parse(queueData);
        return queue.length;
      }
    } catch (error) {
      console.error('Error getting sync queue count:', error);
    }
    return 0;
  }

  async clearSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Error clearing sync queue:', error);
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'No configuration found' };
    }

    try {
      // Test with a dummy contact
      const testContact: AutoresponderContact = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        subscriptionStatus: 'free',
        signupSource: 'connection_test'
      };

      const success = await this.syncContact(testContact);
      return {
        success,
        message: success ? 'Connection successful' : 'Connection failed'
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const autoresponderService = new AutoresponderService();

// Helper function to sync user email capture
export const syncEmailCapture = async (
  email: string,
  subscriptionStatus: 'free' | 'premium' | 'trial' = 'free',
  additionalData?: Partial<AutoresponderContact>
) => {
  try {
    await autoresponderService.addToSyncQueue({
      email,
      subscriptionStatus,
      signupSource: 'email_capture',
      ...additionalData
    });
  } catch (error) {
    console.error('Error syncing email capture:', error);
  }
};

// Helper function to sync subscription changes
export const syncSubscriptionChange = async (
  email: string,
  newStatus: 'free' | 'premium' | 'trial',
  additionalData?: Partial<AutoresponderContact>
) => {
  try {
    await autoresponderService.addToSyncQueue({
      email,
      subscriptionStatus: newStatus,
      signupSource: 'subscription_change',
      tags: [`subscription_${newStatus}`],
      ...additionalData
    });
  } catch (error) {
    console.error('Error syncing subscription change:', error);
  }
};