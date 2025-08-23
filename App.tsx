import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  console.log('🚀 App component rendering...');
  
  return (
    <SafeAreaProvider>
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f0f0f0',
        padding: 20 
      }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          marginBottom: 20,
          textAlign: 'center'
        }}>
          🔧 MINIMAL TEST APP
        </Text>
        
        <Text style={{ 
          fontSize: 16, 
          marginBottom: 20,
          textAlign: 'center'
        }}>
          If you can see this, React is working!
        </Text>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#007AFF', 
            padding: 15, 
            borderRadius: 8,
            marginBottom: 10
          }}
          onPress={() => {
            console.log('Button pressed!');
            Alert.alert('Success', 'Button works!');
          }}
        >
          <Text style={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 'bold' 
          }}>
            Test Button
          </Text>
        </TouchableOpacity>
        
        <Text style={{ 
          fontSize: 12, 
          color: '#666',
          textAlign: 'center',
          marginTop: 20
        }}>
          Check the browser console for any error messages
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

// Export the global logout function as a placeholder
export const triggerGlobalLogout = () => {
  console.log('Global logout called');
};