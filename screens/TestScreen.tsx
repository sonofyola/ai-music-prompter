import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { triggerGlobalLogout } from '../App';

export default function TestScreen() {
  const { user, signout } = useBasic();

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#f0f0f0' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        🧪 TEST SCREEN
      </Text>
      
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        User: {user?.email || 'No user'}
      </Text>
      
      <TouchableOpacity 
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={() => Alert.alert('Test', 'Button works!')}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Test Alert
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={async () => {
          try {
            if (signout) {
              await signout();
              Alert.alert('Success', 'Signout completed');
            } else {
              Alert.alert('Error', 'No signout function');
            }
          } catch (error) {
            Alert.alert('Error', `Signout failed: ${error.message}`);
          }
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Test Signout
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ backgroundColor: '#FF9500', padding: 15, borderRadius: 8 }}
        onPress={() => {
          console.log('🔥 Triggering global logout...');
          triggerGlobalLogout();
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          💥 Force Reset
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}