import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBasic } from '@basictech/expo';
import * as Clipboard from 'expo-clipboard';

interface PromptHistoryItem {
  id: string;
  name: string;
  user_id: string;
  form_data: string;
  generated_prompt: string;
  created_at: string;
}

export default function HistoryScreen() {
  const { user, db } = useBasic();
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    if (!user || !db) return;
    
    try {
      const historyData = await db.from('prompt_history').getAll();
      if (historyData) {
        // Filter by current user and sort by date
        const userHistory = historyData
          .filter((item: any) => (item as PromptHistoryItem).user_id === (user.email || user.id))
          .sort((a: any, b: any) => 
            new Date((b as PromptHistoryItem).created_at).getTime() - new Date((a as PromptHistoryItem).created_at).getTime()
          );
        setHistory(userHistory as unknown as PromptHistoryItem[]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, db]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const copyPrompt = async (prompt: string) => {
    try {
      await Clipboard.setStringAsync(prompt);
      Alert.alert('Copied!', 'Prompt copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy prompt');
    }
  };

  const deleteHistoryItem = async (id: string) => {
    if (!db) return;
    
    Alert.alert(
      'Delete Prompt',
      'Are you sure you want to delete this prompt from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.from('prompt_history').delete(id);
              setHistory(prev => prev.filter(item => item.id !== id));
              Alert.alert('Success', 'Prompt deleted from history');
            } catch (error) {
              console.error('Error deleting history item:', error);
              Alert.alert('Error', 'Failed to delete prompt');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFormDataPreview = (formDataString: string) => {
    try {
      const formData = JSON.parse(formDataString);
      const parts = [];
      if (formData.genre) parts.push(formData.genre);
      if (formData.mood) parts.push(formData.mood);
      if (formData.tempo) parts.push(formData.tempo);
      return parts.join(' • ') || 'Custom prompt';
    } catch {
      return 'Custom prompt';
    }
  };

  const renderHistoryItem = ({ item }: { item: PromptHistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>{item.name}</Text>
        <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
      </View>
      
      <Text style={styles.historyPreview}>{getFormDataPreview(item.form_data)}</Text>
      
      <View style={styles.promptContainer}>
        <Text style={styles.promptText} numberOfLines={3}>
          {item.generated_prompt}
        </Text>
      </View>
      
      <View style={styles.historyActions}>
        <TouchableOpacity 
          style={styles.copyButton} 
          onPress={() => copyPrompt(item.generated_prompt)}
        >
          <Text style={styles.copyButtonText}>📋 Copy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => deleteHistoryItem(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Prompt History</Text>
        <Text style={styles.subtitle}>Your generated music prompts</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No prompts in history yet</Text>
          <Text style={styles.emptySubtext}>Generate some prompts to see them here!</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ffffff"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
  },
  emptyText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
  },
  historyItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444444',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: '#888888',
  },
  historyPreview: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 10,
  },
  promptContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  historyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
