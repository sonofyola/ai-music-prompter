import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  console.log('🚀 Minimal App rendering...');
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#ffffff',
      padding: 20 
    }}>
      <Text style={{ 
        fontSize: 32, 
        fontWeight: 'bold', 
        marginBottom: 30,
        textAlign: 'center',
        color: '#000000'
      }}>
        🔧 MINIMAL TEST
      </Text>
      
      <Text style={{ 
        fontSize: 18, 
        marginBottom: 30,
        textAlign: 'center',
        color: '#333333'
      }}>
        If you can see this text, React is working!
      </Text>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 20, 
          borderRadius: 10,
          marginBottom: 20,
          minWidth: 200
        }}
        onPress={() => {
          console.log('✅ Button pressed successfully!');
          Alert.alert('Success!', 'The button works perfectly!');
        }}
      >
        <Text style={{ 
          color: 'white', 
          textAlign: 'center', 
          fontWeight: 'bold',
          fontSize: 16
        }}>
          Test Button
        </Text>
      </TouchableOpacity>
      
      <Text style={{ 
        fontSize: 14, 
        color: '#666666',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic'
      }}>
        Check browser console for logs
      </Text>
    </View>
  );
}