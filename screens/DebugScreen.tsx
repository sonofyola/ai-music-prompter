import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import { triggerGlobalLogout } from '../App';

export default function DebugScreen() {
  const { user, signout, isSignedIn, isLoading } = useBasic();

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#f0f0f0' }}>
      <ScrollView>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          🔧 DEBUG SCREEN
        </Text>
        
        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Auth State:</Text>
          <Text>isSignedIn: {String(isSignedIn)}</Text>
          <Text>isLoading: {String(isLoading)}</Text>
          <Text>User ID: {user?.id || 'None'}</Text>
          <Text>User Email: {user?.email || 'None'}</Text>
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10 }}
          onPress={() => Alert.alert('Debug', `Signed in: ${isSignedIn}, User: ${user?.email || 'None'}`)}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            Show Current State
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ backgroundColor: '#FF9500', padding: 15, borderRadius: 8, marginBottom: 10 }}
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
            Try Normal Signout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, marginBottom: 10 }}
          onPress={() => {
            console.log('🔥 Triggering force reset...');
            triggerGlobalLogout();
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            💥 Force Reset App
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ backgroundColor: '#34C759', padding: 15, borderRadius: 8 }}
          onPress={() => {
            // Clear any local storage
            if (typeof localStorage !== 'undefined') {
              localStorage.clear();
              Alert.alert('Success', 'Local storage cleared');
            } else {
              Alert.alert('Info', 'No local storage to clear');
            }
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            🧹 Clear Local Storage
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}