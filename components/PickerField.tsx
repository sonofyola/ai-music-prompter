import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PickerFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: string[];
  placeholder?: string;
}

export default function PickerField({
  label,
  value,
  onValueChange,
  items,
  placeholder = "Select an option..."
}: PickerFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor="#ffffff"
        >
          <Picker.Item label={placeholder} value="" color="#666666" />
          {items.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} color="#ffffff" />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444444',
  },
  picker: {
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});