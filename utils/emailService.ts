import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_COLLECTION_ENDPOINT = 'https://your-backend.com/api/collect-email';
const LOCAL_EMAILS_KEY = 'collected_emails';

export interface EmailData {
  email: string;
  tier: 'free' | 'premium';
  timestamp: string;
  source: 'registration' | 'upgrade';
}

// Store email locally for admin export
const storeEmailLocally = async (emailData: EmailData): Promise<void> => {
  try {
    const existingEmails = await AsyncStorage.getItem(LOCAL_EMAILS_KEY);
    const emails: EmailData[] = existingEmails ? JSON.parse(existingEmails) : [];
    
    // Add new email
    emails.push(emailData);
    
    // Store updated list
    await AsyncStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify(emails));
    console.log('Email stored locally:', emailData.email);
  } catch (error) {
    console.error('Error storing email locally:', error);
  }
};

export const collectEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Always store locally for admin export
    await storeEmailLocally(emailData);

    // Try to send to backend (optional)
    try {
      const response = await fetch(EMAIL_COLLECTION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        console.log('Email successfully sent to backend:', emailData.email);
      } else {
        console.warn('Backend collection failed, but stored locally');
      }
    } catch (backendError) {
      console.warn('Backend unavailable, but stored locally');
    }

    return true;
  } catch (error) {
    console.error('Error collecting email:', error);
    return false;
  }
};

// Get all stored emails (for admin use)
export const getAllStoredEmails = async (): Promise<EmailData[]> => {
  try {
    const storedEmails = await AsyncStorage.getItem(LOCAL_EMAILS_KEY);
    return storedEmails ? JSON.parse(storedEmails) : [];
  } catch (error) {
    console.error('Error retrieving stored emails:', error);
    return [];
  }
};
