const EMAIL_COLLECTION_ENDPOINT = 'https://your-backend.com/api/collect-email';

export interface EmailData {
  email: string;
  tier: 'free' | 'premium';
  timestamp: string;
  source: 'registration' | 'upgrade';
}

export const collectEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const response = await fetch(EMAIL_COLLECTION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      console.log('Email successfully collected:', emailData.email);
      return true;
    } else {
      console.error('Failed to collect email:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error collecting email:', error);
    return false;
  }
};