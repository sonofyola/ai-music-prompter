import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();
  const [animation] = React.useState(new Animated.Value(theme === 'dark' ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: theme === 'dark' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [theme, animation]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, '#475569'],
  });

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.container}>
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]}>
          <MaterialIcons 
            name={theme === 'light' ? 'wb-sunny' : 'nightlight-round'} 
            size={16} 
            color={theme === 'light' ? '#fbbf24' : '#e2e8f0'} 
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  track: {
    width: 52,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});