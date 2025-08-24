import React from 'react';
import { View, StyleSheet } from 'react-native';
import LogoSVG from './LogoSVG';

interface LogoProps {
  size?: number;
  style?: any;
}

export default function Logo({ size = 32, style }: LogoProps) {
  return (
    <View style={[styles.container, style]}>
      <LogoSVG size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
