import React from 'react';
import { Image, StyleProp, ViewStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Logo({ size = 40, style }: LogoProps) {
  return (
    <Image
      source={require('../assets/images/ai-music-prompter-logo-final.png')}
      style={[
        {
          width: size,
          height: size,
          resizeMode: 'contain',
        },
        style,
      ]}
    />
  );
}
