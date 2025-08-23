import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBasic } from '@basictech/expo';
import { useTheme } from '../contexts/ThemeContext';
import { useUsage } from '../contexts/UsageContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
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
  const { isMaintenanceMode, maintenanceMessage, toggleMaintenanceMode, isAdmin, setAdminStatus } = useMaintenance();
  const { user } = useBasic();

  const handleLogout = () => {
    console.log('🚨 LOGOUT BUTTON PRESSED!');
    Alert.alert(
      'Logout Admin',
      'Are you sure you want to logout and return to the main app?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚨 LOGOUT CONFIRMED - Setting admin status to false');
              await setAdminStatus(false);
              console.log('🚨 LOGOUT CONFIRMED - Admin status set to false');
              console.log('🚨 LOGOUT CONFIRMED - Calling onBackToApp');
              onBackToApp();
              console.log('🚨 LOGOUT COMPLETE');
            } catch (error) {
              console.error('🚨 LOGOUT ERROR:', error);
              // Even if there's an error, still try to go back
              onBackToApp();
            }
          }
        }
      ]
    );
  };

  const handleTestButton = () => {
    console.log('🧪 TEST BUTTON PRESSED IN ADMIN!');
    Alert.alert('Test', 'Admin test button works!');
  };

  // SIMPLIFIED TEST VERSION
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 20,
    }}>
      <Text style={{ 
        fontSize: 24, 
        color: colors.text, 
        marginBottom: 30,
        textAlign: 'center' 
      }}>
        ADMIN PANEL - TOUCH TEST
      </Text>
      
      {/* LARGE TEST BUTTONS */}
      <TouchableOpacity 
        onPress={handleTestButton}
        style={{
          backgroundColor: 'green',
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          🧪 TEST BUTTON - CLICK ME
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={handleLogout}
        style={{
          backgroundColor: 'red',
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          🚪 LOGOUT BUTTON
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onBackToApp}
        style={{
          backgroundColor: 'blue',
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          ⬅️ BACK TO APP
        </Text>
      </TouchableOpacity>

      <Text style={{ 
        color: colors.text, 
        textAlign: 'center',
        marginTop: 20 
      }}>
        User: {user?.email || 'Unknown'}
      </Text>
      
      <Text style={{ 
        color: colors.text, 
        textAlign: 'center',
        marginTop: 10 
      }}>
        Admin Status: {isAdmin ? 'TRUE' : 'FALSE'}
      </Text>
    </View>
  );
}
