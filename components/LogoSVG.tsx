import React from 'react';
import { Image } from 'react-native';

interface LogoSVGProps {
  size?: number;
  style?: any;
}

export default function LogoSVG({ size = 32, style }: LogoSVGProps) {
  return (
    <Image
      source={require('../assets/images/ai-music-prompter-logo-correct.png')}
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
