import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ScrollView } from 'react-native';
import { promptTemplates, PromptTemplate } from '../utils/promptTemplates';

interface TemplatesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PromptTemplate) => void;
}

export default function TemplatesModal({ visible, onClose, onSelectTemplate }: TemplatesModalProps) {
  const handleSelectTemplate = (template: PromptTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const renderTemplate = ({ item }: { item: PromptTemplate }) => (
    <TouchableOpacity
      style={styles.templateItem}
      onPress={() => handleSelectTemplate(item)}
    >
      <Text style={styles.templateName}>{item.name}</Text>
      <Text style={styles.templateDescription}>{item.description}</Text>
      <View style={styles.templateDetails}>
        <Text style={styles.templateGenre}>{item.formData.genre}</Text>
        <Text style={styles.templateMood}>{item.formData.mood}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Template</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={promptTemplates}
            keyExtractor={(item) => item.id}
            renderItem={renderTemplate}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  templateItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444444',
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  templateDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 10,
  },
  templateDetails: {
    flexDirection: 'row',
    gap: 10,
  },
  templateGenre: {
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: '#1a3a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  templateMood: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#1a2a3a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});