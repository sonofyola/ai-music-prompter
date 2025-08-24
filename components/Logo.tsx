import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Text as SvgText } from 'react-native-svg';

interface LogoProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Logo({ size = 40, style }: LogoProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF9A56" />
            <Stop offset="50%" stopColor="#FF6B6B" />
            <Stop offset="100%" stopColor="#FF4757" />
          </LinearGradient>
        </Defs>
        
        {/* Left flame curve */}
        <Path
          d="M40 180 Q20 120 30 80 Q40 40 60 20 Q80 10 90 30 Q95 50 85 80 Q80 100 75 120 Q70 140 65 160 Q60 175 55 180 Q50 175 45 165 Q40 150 40 180 Z"
          fill="url(#flameGradient)"
        />
        
        {/* Right flame curve */}
        <Path
          d="M160 180 Q180 120 170 80 Q160 40 140 20 Q120 10 110 30 Q105 50 115 80 Q120 100 125 120 Q130 140 135 160 Q140 175 145 180 Q150 175 155 165 Q160 150 160 180 Z"
          fill="url(#flameGradient)"
        />
        
        {/* Center circle */}
        <Path
          d="M100 170 Q60 150 50 100 Q60 50 100 30 Q140 50 150 100 Q140 150 100 170 Z"
          fill="#1a1a1a"
        />
        
        {/* AI Text */}
        <SvgText
          x="100"
          y="110"
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
          fill="url(#flameGradient)"
          fontFamily="Arial, sans-serif"
        >
          AI
        </SvgText>
      </Svg>
    </View>
  );
}
