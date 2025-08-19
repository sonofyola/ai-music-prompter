import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MultiSelectFieldProps {
  label: string;
  values: string[];
  onValuesChange: (values: string[]) => void;
  options: string[];
  placeholder?: string;
}

export default function MultiSelectField({ 
  label, 
  values, 
  onValuesChange, 
  options, 
  placeholder = 'Select...' 
}: MultiSelectFieldProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const displayText = values.length > 0 
    ? values.join(', ') 
    : placeholder;

  const toggleOption = (option: string) => {
    if (values.includes(option)) {
      onValuesChange(values.filter(v => v !== option));
    } else {
      onValuesChange([...values, option]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.picker}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerText, values.length === 0 && styles.placeholder]} numberOfLines={2}>
          {displayText}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    values.includes(item) && styles.selectedOption
                  ]}
                  onPress={() => toggleOption(item)}
                >
                  <Text style={[
                    styles.optionText,
                    values.includes(item) && styles.selectedOptionText
                  ]}>
                    {item}
                  </Text>
                  {values.includes(item) && (
                    <MaterialIcons name="check" size={20} color="#fff" />
                  )}
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
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  placeholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
});