import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../utils/theme';

interface PickerFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export default function PickerField({ label, value, onValueChange, options }: PickerFieldProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Add a default "Select..." option if not already present
  const allOptions = [
    { label: 'Select...', value: '' },
    ...options.filter(option => option.value !== '')
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor={colors.textSecondary}
        >
          {allOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={colors.text}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  picker: {
    color: colors.text,
    backgroundColor: colors.surface,
  },
});
