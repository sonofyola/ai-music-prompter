import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import IconFallback from './IconFallback';

interface FormFieldProps extends TextInputProps {
  label: string;
  showRandomGenerator?: boolean;
  onRandomPress?: () => void;
}

export default function FormField({ 
  label, 
  showRandomGenerator = false, 
  onRandomPress,
  ...props 
}: FormFieldProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {showRandomGenerator && onRandomPress && (
          <TouchableOpacity 
            style={styles.diceButton}
            onPress={onRandomPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <IconFallback name="casino" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={[styles.input, props.multiline && styles.multilineInput]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  diceButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
