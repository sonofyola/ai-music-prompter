import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

interface LogoSVGProps {
  size?: number;
  style?: any;
}

export default function LogoSVG({ size = 32, style }: LogoSVGProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ff6b6b" />
            <Stop offset="50%" stopColor="#ff8e53" />
            <Stop offset="100%" stopColor="#ff6b9d" />
          </LinearGradient>
        </Defs>
        
        {/* Flame shape */}
        <Path
          d="M20 80 Q15 60 25 40 Q35 20 50 15 Q65 20 75 40 Q85 60 80 80 Q75 85 65 85 Q55 80 50 75 Q45 80 35 85 Q25 85 20 80 Z"
          fill="url(#flameGradient)"
        />
        
        {/* Audio waveform inside */}
        <Path
          d="M40 50 L42 45 L44 55 L46 40 L48 60 L50 35 L52 65 L54 45 L56 55 L58 50 L60 50"
          stroke="#1a1a1a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}