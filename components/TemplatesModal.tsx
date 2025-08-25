import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/theme';
import { PROMPT_TEMPLATES, TEMPLATE_CATEGORIES } from '../utils/promptTemplates';
import IconFallback from './IconFallback';

interface TemplatesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

export default function TemplatesModal({ visible, onClose, onSelectTemplate }: TemplatesModalProps) {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const styles = createStyles(colors);

  const filteredTemplates = selectedCategory === 'All' 
    ? PROMPT_TEMPLATES 
    : PROMPT_TEMPLATES.filter(template => template.category === selectedCategory);

  const handleSelectTemplate = (template: any) => {
    onSelectTemplate(template.formData);
    onClose();
  };

  const renderTemplate = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.templateCard}
      onPress={() => handleSelectTemplate(item)}
    >
      <View style={styles.templateHeader}>
        <View style={styles.templateIcon}>
          <IconFallback name={item.icon || 'music-note'} size={24} color={colors.primary} />
        </View>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName}>{item.name}</Text>
          <Text style={styles.templateCategory}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.templateDescription}>{item.description}</Text>
      
      {/* Preview some key settings */}
      <View style={styles.templatePreview}>
        {item.formData.genres_primary && (
          <Text style={styles.previewTag}>
            {item.formData.genres_primary.join(', ')}
          </Text>
        )}
        {item.formData.tempo_bpm && (
          <Text style={styles.previewTag}>
            {item.formData.tempo_bpm} BPM
          </Text>
        )}
        {item.formData.energy && (
          <Text style={styles.previewTag}>
            {item.formData.energy} Energy
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Templates</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconFallback name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

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
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Templates List */}
        <FlatList
          data={filteredTemplates}
          renderItem={renderTemplate}
          keyExtractor={(item) => item.id}
          style={styles.templatesList}
          contentContainerStyle={styles.templatesContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextActive: {
    color: '#fff',
  },
  templatesList: {
    flex: 1,
  },
  templatesContent: {
    padding: 20,
    gap: 16,
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
    marginBottom: 12,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  templateCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
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
    gap: 8,
  },
  previewTag: {
    fontSize: 12,
    color: colors.textTertiary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
