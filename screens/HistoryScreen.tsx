import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePromptHistory } from '../contexts/PromptHistoryContext';
import { useTheme } from '../utils/theme';
import IconFallback from '../components/IconFallback';
import * as Clipboard from 'expo-clipboard';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { prompts, deletePrompt, isLoading } = usePromptHistory();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const styles = createStyles(colors);

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

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await Clipboard.setStringAsync(prompt);
      Alert.alert('Copied!', 'Prompt copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy prompt');
    }
  };

  const handleViewPrompt = (prompt: any) => {
    Alert.alert(
      prompt.name,
      prompt.generatedPrompt,
      [
        { text: 'Close', style: 'cancel' },
        { 
          text: 'Copy', 
          onPress: () => handleCopyPrompt(prompt.generatedPrompt)
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
            onPress={() => handleViewPrompt(item)}
          >
            <IconFallback name="eye" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCopyPrompt(item.generatedPrompt)}
          >
            <IconFallback name="copy" size={20} color={colors.success} />
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
        {item.formData.genre && (
          <Text style={styles.previewText} numberOfLines={1}>
            Genre: {item.formData.genre}
          </Text>
        )}
        {item.formData.mood && (
          <Text style={styles.previewText} numberOfLines={1}>
            Mood: {item.formData.mood}
          </Text>
        )}
        {item.formData.tempo && (
          <Text style={styles.previewText}>
            Tempo: {item.formData.tempo}
          </Text>
        )}
        {item.formData.theme && (
          <Text style={styles.previewText} numberOfLines={1}>
            Theme: {item.formData.theme}
          </Text>
        )}
      </View>

      {/* Generated prompt preview */}
      <View style={styles.generatedPreview}>
        <Text style={styles.generatedLabel}>Generated Prompt:</Text>
        <Text style={styles.generatedText} numberOfLines={3}>
          {item.generatedPrompt}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your prompts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📝 Prompt History</Text>
        <Text style={styles.subtitle}>
          {prompts.length} saved prompt{prompts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Prompts List */}
      {prompts.length === 0 ? (
        <View style={styles.emptyState}>
          <IconFallback name="history" size={64} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>No Saved Prompts</Text>
          <Text style={styles.emptySubtitle}>
            Generate prompts in the Prompter tab to see them here
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
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  promptsList: {
    flex: 1,
  },
  promptsContent: {
    padding: 20,
    gap: 16,
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
    fontSize: 18,
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
    marginBottom: 12,
  },
  previewText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  generatedPreview: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  generatedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  generatedText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});