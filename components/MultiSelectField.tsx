import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

interface MultiSelectFieldProps {
  label: string;
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  options: string[];
  placeholder?: string;
}

export default function MultiSelectField({
  label,
  selectedValues,
  onSelectionChange,
  options,
  placeholder = "Select options..."
}: MultiSelectFieldProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleOption = (option: string) => {
    const newSelection = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onSelectionChange(newSelection);
  };

  const displayText = selectedValues.length > 0 
    ? selectedValues.join(', ')
    : placeholder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectorText, selectedValues.length === 0 && styles.placeholder]}>
          {displayText}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => toggleOption(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  <View style={[
                    styles.checkbox,
                    selectedValues.includes(item) && styles.checkboxSelected
                  ]}>
                    {selectedValues.includes(item) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  selector: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#444444',
  },
  selectorText: {
    fontSize: 16,
    color: '#ffffff',
  },
  placeholder: {
    color: '#666666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  doneButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  optionText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});