import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/theme';

export default function NotificationSettings() {
  const { colors } = useTheme();
  
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications Disabled</Text>
      <Text style={styles.message}>
        Push notifications have been removed from this app.
      </Text>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
