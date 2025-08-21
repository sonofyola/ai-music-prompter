import React from 'react';
import { View, Text } from 'react-native';

export default function SubscriptionScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <Text style={{ fontSize: 24, color: '#000' }}>Subscription Screen Works!</Text>
      <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>This is the subscription screen</Text>
    </View>
  );
}