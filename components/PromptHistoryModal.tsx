import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { usePromptHistory } from '../contexts/PromptHistoryContext';
import IconFallback from './IconFallback';

interface PromptHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onLoadPrompt: (formData: any) => void;
  onSaveCurrentPrompt: (name: string) => void;
  currentFormData: any;
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
  const styles = createStyles(colors);

  const handleSavePrompt = () => {
    if (!currentGeneratedPrompt) {
      Alert.alert('No Prompt to Save', 'Please generate a prompt first before saving.');
      return;
    }
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    if (!saveName.trim()) {
      Alert.alert('Name Required', 'Please enter a name for your prompt.');
      return;
    }
    onSaveCurrentPrompt(saveName.trim());
    setSaveName('');
    setShowSaveDialog(false);
  };

  const handleDeletePrompt = (promptId: string, promptName: string) => {
    Alert.alert(
      'Delete Prompt',
      `Are you sure you want to delete "${promptName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deletePrompt(promptId)
        }
      ]
    );
  };

  const renderPrompt = ({ item }: { item: any }) => (
    <View style={styles.promptCard}>
      <View style={styles.promptHeader}>
        <View style={styles.promptInfo}>
          <Text style={styles.promptName}>{item.name}</Text>
          <Text style={styles.promptDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.promptActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              onLoadPrompt(item.formData);
              onClose();
            }}
          >
            <IconFallback name="download" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeletePrompt(item.id, item.name)}
          >
            <IconFallback name="delete" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Preview of key settings */}
      <View style={styles.promptPreview}>
        {item.formData.subject && (
          <Text style={styles.previewText} numberOfLines={1}>
            Subject: {item.formData.subject}
          </Text>
        )}
        {item.formData.genres_primary && item.formData.genres_primary.length > 0 && (
          <Text style={styles.previewText} numberOfLines={1}>
            Genres: {item.formData.genres_primary.join(', ')}
          </Text>
        )}
        {item.formData.tempo_bpm && (
          <Text style={styles.previewText}>
            Tempo: {item.formData.tempo_bpm}
          </Text>
        )}
      </View>
    </View>
  );

  if (showSaveDialog) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={styles.container}>
          <View style={styles.saveDialog}>
            <Text style={styles.saveTitle}>Save Current Prompt</Text>
            <Text style={styles.saveSubtitle}>
              Give your prompt a memorable name
            </Text>
            
            <TextInput
              style={styles.saveInput}
              placeholder="Enter prompt name..."
              placeholderTextColor={colors.textTertiary}
              value={saveName}
              onChangeText={setSaveName}
              autoFocus
            />
            
            <View style={styles.saveActions}>
              <TouchableOpacity
                style={[styles.saveButton, styles.cancelButton]}
                onPress={() => {
                  setShowSaveDialog(false);
                  setSaveName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, styles.confirmButton]}
                onPress={confirmSave}
              >
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Prompt History</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconFallback name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Save Current Prompt Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.saveCurrentButton}
            onPress={handleSavePrompt}
          >
            <IconFallback name="save" size={20} color="#fff" />
            <Text style={styles.saveCurrentButtonText}>Save Current Prompt</Text>
          </TouchableOpacity>
        </View>

        {/* Prompts List */}
        {prompts.length === 0 ? (
          <View style={styles.emptyState}>
            <IconFallback name="history" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Saved Prompts</Text>
            <Text style={styles.emptySubtitle}>
              Generate and save prompts to access them later
            </Text>
          </View>
        ) : (
          <FlatList
            data={prompts}
            renderItem={renderPrompt}
            keyExtractor={(item) => item.id}
            style={styles.promptsList}
            contentContainerStyle={styles.promptsContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  saveCurrentButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  saveCurrentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  promptsList: {
    flex: 1,
  },
  promptsContent: {
    padding: 20,
    gap: 12,
  },
  promptCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  promptInfo: {
    flex: 1,
  },
  promptName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  promptDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  promptActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  promptPreview: {
    gap: 4,
  },
  previewText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Save dialog styles
  saveDialog: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  saveTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  saveSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  saveInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 32,
  },
  saveActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});