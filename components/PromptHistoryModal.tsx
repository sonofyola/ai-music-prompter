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
import { useTheme } from '../contexts/ThemeContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';
import { SavedPrompt, MusicPromptData } from '../types';
import IconFallback from './IconFallback';

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
  const { prompts, deletePrompt } = usePromptHistory();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  const filteredPrompts = prompts;

  const handleLoadPrompt = (prompt: SavedPrompt) => {
    Alert.alert(
      'Load This Prompt?',
      `"${prompt.name}"\n\nThis will replace your current form data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Load Prompt', 
          onPress: () => {
            onLoadPrompt(prompt.formData);
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
            📚 Prompt History
          </Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            accessible={true}
            accessibilityLabel="Close history modal"
            accessibilityHint="Returns to the main prompt form"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* History list */}
        <ScrollView 
          style={styles.historyList}
          accessible={false}
          showsVerticalScrollIndicator={true}
        >
          {history.length > 0 ? (
            <>
              <Text 
                style={styles.sectionTitle}
                accessibilityRole="header"
                accessibilityLevel={2}
              >
                Your recent prompts:
              </Text>

              {history.map((item, index) => (
                <View
                  key={item.id}
                  style={styles.historyItem}
                  accessible={true}
                  accessibilityLabel={`Prompt from ${formatDate(item.createdAt)}`}
                  accessibilityRole="region"
                >
                  {/* Date header */}
                  <Text 
                    style={styles.historyDate}
                    accessibilityRole="text"
                    accessible={false}
                  >
                    {formatDate(item.createdAt)}
                  </Text>

                  {/* Prompt content */}
                  <Text 
                    style={styles.historyPrompt}
                    accessible={true}
                    accessibilityLabel={`Generated prompt: ${item.prompt}`}
                    accessibilityRole="text"
                  >
                    {item.prompt}
                  </Text>

                  {/* Action buttons */}
                  <View style={styles.historyActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleCopyPrompt(item.prompt)}
                      accessible={true}
                      accessibilityLabel="Copy this prompt"
                      accessibilityHint="Copies this prompt to your clipboard"
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionButtonText}>📋 Copy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleReusePrompt(item)}
                      accessible={true}
                      accessibilityLabel="Reuse this prompt"
                      accessibilityHint="Fills the form with this prompt's parameters"
                      accessibilityRole="button"
                    >
                      <Text style={styles.actionButtonText}>🔄 Reuse</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeletePrompt(item.id)}
                      accessible={true}
                      accessibilityLabel="Delete this prompt"
                      accessibilityHint="Permanently removes this prompt from your history"
                      accessibilityRole="button"
                    >
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View 
              style={styles.emptyState}
              accessible={true}
              accessibilityLabel="No prompt history"
              accessibilityRole="text"
            >
              <Text style={styles.emptyStateText}>
                No prompts generated yet. Create your first prompt to see it here!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Clear all button */}
        {history.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={handleClearAll}
              accessible={true}
              accessibilityLabel="Clear all history"
              accessibilityHint="Permanently deletes all saved prompts from your history"
              accessibilityRole="button"
            >
              <Text style={styles.clearAllButtonText}>Clear All History</Text>
            </TouchableOpacity>
          </View>
        )}
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
  historyList: {
    flex: 1,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    fontSize: 14,
    color: colors.textTertiary,
    marginBottom: 8,
  },
  historyPrompt: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  deleteButton: {
    backgroundColor: colors.textTertiary,
  },
  deleteButtonText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearAllButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  clearAllButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
