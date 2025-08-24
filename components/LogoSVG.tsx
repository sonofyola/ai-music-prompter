import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';

interface LogoSVGProps {
  size?: number;
  style?: any;
}

export default function LogoSVG({ size = 32, style }: LogoSVGProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ff6b6b" />
            <Stop offset="30%" stopColor="#ff8e53" />
            <Stop offset="70%" stopColor="#ff6b9d" />
            <Stop offset="100%" stopColor="#ff4757" />
          </LinearGradient>
        </Defs>
        
        {/* Left flame curve */}
        <Path
          d="M30 50 Q20 30 40 20 Q60 15 80 30 Q90 50 85 80 Q80 120 70 140 Q60 160 50 170 Q40 160 45 140 Q50 120 45 100 Q40 80 35 70 Q30 60 30 50 Z"
          fill="url(#flameGradient)"
        />
        
        {/* Right flame curve */}
        <Path
          d="M170 50 Q180 30 160 20 Q140 15 120 30 Q110 50 115 80 Q120 120 130 140 Q140 160 150 170 Q160 160 155 140 Q150 120 155 100 Q160 80 165 70 Q170 60 170 50 Z"
          fill="url(#flameGradient)"
        />
        
        {/* Center circle with audio bars */}
        <Circle
          cx="100"
          cy="100"
          r="45"
          fill="#1a1a1a"
        />
        
        {/* Audio bars - vertical lines representing sound waves */}
        <Path
          d="M85 85 L85 115"
          stroke="url(#flameGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Path
          d="M95 75 L95 125"
          stroke="url(#flameGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Path
          d="M105 70 L105 130"
          stroke="url(#flameGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <Path
          d="M115 75 L115 125"
          stroke="url(#flameGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
