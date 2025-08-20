import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_COLLECTION_ENDPOINT = 'https://your-backend.com/api/collect-email';
const LOCAL_EMAILS_KEY = 'collected_emails';

export interface EmailData {
  email: string;
  tier: 'free' | 'premium';
  timestamp: string;
  source: 'registration' | 'upgrade';
}

// Enhanced email validation function
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const trimmedEmail = email.trim().toLowerCase();
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  // Length checks
  if (trimmedEmail.length < 5) {
    return { isValid: false, error: 'Email too short' };
  }
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email too long' };
  }
  
  // Local part (before @) validation
  const [localPart, domain] = trimmedEmail.split('@');
  if (localPart.length > 64) {
    return { isValid: false, error: 'Local part too long' };
  }
  
  // Domain validation
  if (domain.length > 253) {
    return { isValid: false, error: 'Domain too long' };
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return { isValid: false, error: 'Consecutive dots not allowed' };
  }
  
  // Check for dots at start/end
  if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return { isValid: false, error: 'Cannot start or end with dot' };
  }
  
  // Check for common invalid patterns
  const invalidPatterns = [
    /^[.-]/, // starts with dot or dash
    /[.-]$/, // ends with dot or dash
    /@[.-]/, // @ followed by dot or dash
    /[.-]@/, // dot or dash before @
  ];
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(trimmedEmail)) {
      return { isValid: false, error: 'Invalid email pattern' };
    }
  }
  
  return { isValid: true };
};

// Store email locally for admin export
const storeEmailLocally = async (emailData: EmailData): Promise<void> => {
  try {
    const existingEmails = await AsyncStorage.getItem(LOCAL_EMAILS_KEY);
    const emails: EmailData[] = existingEmails ? JSON.parse(existingEmails) : [];
    
    // Check for duplicates (case-insensitive)
    const emailExists = emails.some(
      existing => existing.email.toLowerCase() === emailData.email.toLowerCase()
    );
    
    if (!emailExists) {
      // Add new email
      emails.push(emailData);
      
      // Store updated list
      await AsyncStorage.setItem(LOCAL_EMAILS_KEY, JSON.stringify(emails));
      console.log('Email stored locally:', emailData.email);
    } else {
      console.log('Email already exists, skipping:', emailData.email);
    }
  } catch (error) {
    console.error('Error storing email locally:', error);
  }
};

export const collectEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Validate email before storing
    const validation = validateEmail(emailData.email);
    if (!validation.isValid) {
      console.error('Invalid email rejected:', emailData.email, validation.error);
      return false;
    }

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
