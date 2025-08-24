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
import { useTheme } from '../contexts/ThemeContext';
import { PromptTemplate, MusicPromptData } from '../types';
import { PROMPT_TEMPLATES, TEMPLATE_CATEGORIES } from '../utils/promptTemplates';
import IconFallback from './IconFallback';

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
  const [searchQuery, setSearchQuery] = useState('');

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
      accessibilityViewIsModal={true}
      onRequestClose={onClose}
    >
      <View 
        style={styles.container}
        accessible={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text 
            style={styles.title}
            accessibilityRole="header"
            accessibilityLevel={1}
          >
            🎵 Prompt Templates
          </Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            accessible={true}
            accessibilityLabel="Close templates modal"
            accessibilityHint="Returns to the main prompt form"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search templates..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessible={true}
            accessibilityLabel="Search templates"
            accessibilityHint="Type to filter prompt templates by genre or style"
            accessibilityRole="searchbox"
          />
        </View>

        {/* Templates list */}
        <ScrollView 
          style={styles.templatesList}
          accessible={false}
          showsVerticalScrollIndicator={true}
        >
          <Text 
            style={styles.sectionTitle}
            accessibilityRole="header"
            accessibilityLevel={2}
          >
            Choose a template to get started:
          </Text>

          {filteredTemplates.map((template, index) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateItem}
              onPress={() => handleSelectTemplate(template)}
              accessible={true}
              accessibilityLabel={`${template.name} template`}
              accessibilityHint={`${template.description}. Tap to use this template.`}
              accessibilityRole="button"
            >
              <View style={styles.templateHeader}>
                <Text 
                  style={styles.templateName}
                  accessible={false}
                >
                  {template.emoji} {template.name}
                </Text>
                <Text 
                  style={styles.templateGenre}
                  accessible={false}
                >
                  {template.genre}
                </Text>
              </View>
              <Text 
                style={styles.templateDescription}
                accessible={false}
              >
                {template.description}
              </Text>
              <Text 
                style={styles.templatePreview}
                accessible={false}
                numberOfLines={2}
              >
                Preview: {template.prompt.substring(0, 100)}...
              </Text>
            </TouchableOpacity>
          ))}

          {filteredTemplates.length === 0 && (
            <View 
              style={styles.noResults}
              accessible={true}
              accessibilityLabel="No templates found"
              accessibilityRole="text"
            >
              <Text style={styles.noResultsText}>
                No templates found matching "{searchQuery}"
              </Text>
            </View>
          )}
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
  templatesList: {
    flex: 1,
  },
  templateItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    padding: 16,
    backgroundColor: colors.surface,
  },
  noResults: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  noResultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
