import React from 'react';
import { Image } from 'react-native';

interface LogoSVGProps {
  size?: number;
  style?: any;
}

export default function LogoSVG({ size = 32, style }: LogoSVGProps) {
  return (
    <Image
      source={require('../assets/images/FINAL_LOGO_AI_MUSIC_PROMPTR.png')}
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
