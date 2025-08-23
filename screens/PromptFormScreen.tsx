import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';

import FormField from '../components/FormField';
import MultiSelectField from '../components/MultiSelectField';
import PickerField from '../components/PickerField';
import ThemeToggle from '../components/ThemeToggle';
import UsageIndicator from '../components/UsageIndicator';
import SubscriptionStatus from '../components/SubscriptionStatus';
import UpgradeModal from '../components/UpgradeModal';
import PromptHistoryModal from '../components/PromptHistoryModal';
import TemplatesModal from '../components/TemplatesModal';
import EmailCaptureModal from '../components/EmailCaptureModal';
import AdminScreen from './AdminScreen';
import SubscriptionScreen from './SubscriptionScreen';

// Admin email whitelist - only these emails can access admin features
const ADMIN_EMAILS = [
  'drremotework@gmail.com',
  'admin@aimusicpromptr.com',
];

export default function PromptFormScreen() {
  // Your existing code remains unchanged
}
