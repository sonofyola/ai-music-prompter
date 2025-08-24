import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

interface LogoProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Logo({ size = 40, style }: LogoProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF6B6B" stopOpacity="1" />
            <Stop offset="50%" stopColor="#4ECDC4" stopOpacity="1" />
            <Stop offset="100%" stopColor="#45B7D1" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Musical note shape */}
        <Path
          d="M30 20 Q35 15 45 20 L45 60 Q45 70 35 70 Q25 70 25 60 Q25 50 35 50 Q40 50 45 55 L45 25 Q50 20 60 25 L60 45 Q60 55 50 55 Q40 55 40 45 Q40 35 50 35 Q55 35 60 40"
          fill="url(#grad)"
          stroke="none"
        />
        
        {/* AI text overlay */}
        <Path
          d="M35 35 L38 45 L32 45 Z M36.5 40 L36.5 42"
          fill="white"
          opacity="0.9"
        />
        <Path
          d="M42 35 L42 45 M42 35 L45 35 M42 40 L44 40"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
          fill="none"
        />
      </Svg>
    </View>
  );
}
