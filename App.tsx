import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  console.log('App is rendering!');
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Hello World!</Text>
    </View>
  );
}