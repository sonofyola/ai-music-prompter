import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
  style?: any;
}

export default function Logo({ size = 32, style }: LogoProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../assets/images/ai-music-prompter-logo.png')}
        style={[
          styles.logo,
          {
            width: size,
            height: size,
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // The logo will be sized by the size prop
  },
});