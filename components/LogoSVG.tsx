import React from 'react';
import { Image } from 'react-native';

interface LogoSVGProps {
  size?: number;
  style?: any;
}

export default function LogoSVG({ size = 32, style }: LogoSVGProps) {
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
