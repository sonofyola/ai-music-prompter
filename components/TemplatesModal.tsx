import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { PromptTemplate, MusicPromptData } from '../types';
import { PROMPT_TEMPLATES, TEMPLATE_CATEGORIES } from '../utils/promptTemplates';

interface TemplatesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (formData: Partial<MusicPromptData>) => void;
}

export default function TemplatesModal({ 
  visible, 
  onClose, 
  onSelectTemplate 
}: TemplatesModalProps) {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? PROMPT_TEMPLATES 
    : PROMPT_TEMPLATES.filter(template => template.category === selectedCategory);

  const handleSelectTemplate = (template: PromptTemplate) => {
    Alert.alert(
      'Use This Template?',
      `"${template.name}"\n\n${template.description}\n\nThis will replace your current form data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Template', 
          onPress: () => {
            onSelectTemplate(template.formData);
            onClose();
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="dashboard" size={24} color={colors.primary} />
            <Text style={styles.title}>Prompt Templates</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Choose from pre-built templates to get started quickly!
        </Text>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {TEMPLATE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.templatesContainer}>
            {filteredTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => handleSelectTemplate(template)}
                activeOpacity={0.7}
              >
                <View style={styles.templateHeader}>
                  <View style={styles.templateTitleContainer}>
                    <MaterialIcons 
                      name={template.icon as any} 
                      size={24} 
                      color={colors.primary} 
                    />
                    <View style={styles.templateTextContainer}>
                      <Text style={styles.templateName}>{template.name}</Text>
                      <Text style={styles.templateCategory}>{template.category}</Text>
                    </View>
                  </View>
                  <MaterialIcons name="arrow-forward" size={20} color={colors.primary} />
                </View>
                <Text style={styles.templateDescription}>{template.description}</Text>
                
                {/* Preview of key settings */}
                <View style={styles.templatePreview}>
                  {template.formData.genres_primary && template.formData.genres_primary.length > 0 && (
                    <View style={styles.previewTag}>
                      <Text style={styles.previewTagText}>
                        {template.formData.genres_primary.join(', ')}
                      </Text>
                    </View>
                  )}
                  {template.formData.tempo_bpm && (
                    <View style={styles.previewTag}>
                      <Text style={styles.previewTagText}>
                        {template.formData.tempo_bpm} BPM
                      </Text>
                    </View>
                  )}
                  {template.formData.energy && (
                    <View style={styles.previewTag}>
                      <Text style={styles.previewTagText}>
                        {template.formData.energy} Energy
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 16,
    backgroundColor: colors.surface,
  },
  categoryScroll: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  templatesContainer: {
    padding: 16,
    gap: 12,
  },
  templateCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  templateTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  templateTextContainer: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  templateCategory: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  templateDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  templatePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  previewTag: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewTagText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
