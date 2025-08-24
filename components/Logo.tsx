import React from 'react';
import { Image, StyleProp, ImageStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export default function Logo({ size = 40, style }: LogoProps) {
  return (
    <Image
      source={require('../assets/images/ff0f3bfe-d5db-43e6-a3d1-2553a8a65707.png')}
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
