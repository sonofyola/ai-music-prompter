
import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';
import { SavedPrompt, MusicPromptData } from '../types';

interface PromptHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onLoadPrompt: (formData: MusicPromptData) => void;
  onSaveCurrentPrompt: (name: string) => void;
  currentFormData: MusicPromptData;
  currentGeneratedPrompt: string;
}

export default function PromptHistoryModal({ 
  visible, 
  onClose, 
  onLoadPrompt,
  onSaveCurrentPrompt,
  currentFormData,
  currentGeneratedPrompt
}: PromptHistoryModalProps) {
  const { colors } = useTheme();
  const { savedPrompts, deletePrompt, toggleFavorite, updateLastUsed } = usePromptHistory();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredPrompts = filter === 'favorites' 
    ? savedPrompts.filter(prompt => prompt.isFavorite)
    : savedPrompts;

  const handleLoadPrompt = (prompt: SavedPrompt) => {
    Alert.alert(
      'Load This Prompt?',
      `"${prompt.name}"\n\nThis will replace your current form data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Load Prompt', 
          onPress: async () => {
            onLoadPrompt(prompt.formData);
            await updateLastUsed(prompt.id);
            onClose();
          }
        }
      ]
    );
  };

  const handleDeletePrompt = (prompt: SavedPrompt) => {
    Alert.alert(
      'Delete Prompt?',
      `Are you sure you want to delete "${prompt.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deletePrompt(prompt.id)
        }
      ]
    );
  };

  const handleSavePrompt = () => {
    if (saveName.trim()) {
      onSaveCurrentPrompt(saveName.trim());
      setSaveName('');
      setShowSaveDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPromptPreview = (formData: MusicPromptData) => {
    const parts = [];
    if (formData.subject) parts.push(formData.subject);
    if (formData.genres_primary.length > 0) parts.push(formData.genres_primary.join(', '));
    if (formData.mood.length > 0) parts.push(formData.mood.join(', '));
    return parts.slice(0, 3).join(' • ') || 'Empty prompt';
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
            <MaterialIcons name="history" size={24} color={colors.primary} />
            <Text style={styles.title}>Prompt History</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => setShowSaveDialog(true)}
          >
            <MaterialIcons name="save" size={18} color="#fff" />
            <Text style={styles.saveButtonText}>Save Current</Text>
          </TouchableOpacity>

          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setFilter('all')}
            >
              <Text style={[
                styles.filterButtonText,
                filter === 'all' && styles.filterButtonTextActive
              ]}>
                All ({savedPrompts.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'favorites' && styles.filterButtonActive
              ]}
              onPress={() => setFilter('favorites')}
            >
              <MaterialIcons 
                name="favorite" 
                size={16} 
                color={filter === 'favorites' ? '#fff' : colors.textSecondary} 
              />
              <Text style={[
                styles.filterButtonText,
                filter === 'favorites' && styles.filterButtonTextActive
              ]}>
                {savedPrompts.filter(p => p.isFavorite).length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredPrompts.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="history" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyStateText}>
                {filter === 'favorites' ? 'No favorite prompts yet' : 'No saved prompts yet'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {filter === 'favorites' 
                  ? 'Star some prompts to see them here' 
                  : 'Save your current prompt to get started'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.promptsContainer}>
              {filteredPrompts.map((prompt) => (
                <View key={prompt.id} style={styles.promptCard}>
                  <TouchableOpacity
                    style={styles.promptContent}
                    onPress={() => handleLoadPrompt(prompt)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.promptHeader}>
                      <Text style={styles.promptName}>{prompt.name}</Text>
                      <View style={styles.promptActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => toggleFavorite(prompt.id)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <MaterialIcons 
                            name={prompt.isFavorite ? "favorite" : "favorite-border"} 
                            size={20} 
                            color={prompt.isFavorite ? colors.primary : colors.textSecondary} 
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeletePrompt(prompt)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <MaterialIcons name="delete" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <Text style={styles.promptPreview}>
                      {getPromptPreview(prompt.formData)}
                    </Text>
                    
                    <View style={styles.promptMeta}>
                      <Text style={styles.promptDate}>
                        Created: {formatDate(prompt.createdAt)}
                      </Text>
                      {prompt.lastUsed && (
                        <Text style={styles.promptDate}>
                          Last used: {formatDate(prompt.lastUsed)}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Save Dialog */}
        <Modal
          visible={showSaveDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSaveDialog(false)}
        >
          <View style={styles.saveDialogOverlay}>
            <View style={styles.saveDialog}>
              <Text style={styles.saveDialogTitle}>Save Current Prompt</Text>
              <TextInput
                style={styles.saveDialogInput}
                placeholder="Enter a name for this prompt..."
                placeholderTextColor={colors.textTertiary}
                value={saveName}
                onChangeText={setSaveName}
                autoFocus
              />
              <View style={styles.saveDialogButtons}>
                <TouchableOpacity
                  style={styles.saveDialogCancelButton}
                  onPress={() => {
                    setShowSaveDialog(false);
                    setSaveName('');
                  }}
                >
                  <Text style={styles.saveDialogCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveDialogSaveButton,
                    !saveName.trim() && styles.saveDialogSaveButtonDisabled
                  ]}
                  onPress={handleSavePrompt}
                  disabled={!saveName.trim()}
                >
                  <Text style={styles.saveDialogSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 8,
    textAlign: 'center',
  },
  promptsContainer: {
    padding: 16,
    gap: 12,
  },
  promptCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promptContent: {
    padding: 16,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  promptName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  promptActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  promptPreview: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  promptMeta: {
    gap: 2,
  },
  promptDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  saveDialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  saveDialog: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  saveDialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  saveDialogInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: 20,
  },
  saveDialogButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveDialogCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  saveDialogCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  saveDialogSaveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveDialogSaveButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  saveDialogSaveText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
