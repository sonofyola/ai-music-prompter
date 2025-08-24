import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface LogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export default function Logo({ size = 40, style }: LogoProps) {
  return (
    <Image
      source={require('../assets/images/ai-music-prompter-logo-new.png')}
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
