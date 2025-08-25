import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
// Temporarily comment out MaterialIcons to test
// import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';

export default function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();
  const [animation] = React.useState(new Animated.Value(theme === 'dark' ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: theme === 'dark' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [theme, animation]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.textSecondary],
  });

  const iconOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.container} activeOpacity={0.7}>
      <Animated.View style={[styles.button, { backgroundColor, opacity: iconOpacity }]}>
        <Text style={{ fontSize: 16, color: theme === 'light' ? colors.textSecondary : colors.text }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // No extra padding needed
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
