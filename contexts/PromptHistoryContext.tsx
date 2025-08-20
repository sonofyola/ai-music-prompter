
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedPrompt, MusicPromptData } from '../types';

interface PromptHistoryContextType {
  savedPrompts: SavedPrompt[];
  savePrompt: (name: string, formData: MusicPromptData, generatedPrompt: string) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  loadPrompt: (id: string) => SavedPrompt | null;
  updateLastUsed: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const PROMPTS_KEY = 'saved_prompts';

const PromptHistoryContext = createContext<PromptHistoryContextType | undefined>(undefined);

export function PromptHistoryProvider({ children }: { children: React.ReactNode }) {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    loadSavedPrompts();
  }, []);

  const loadSavedPrompts = async () => {
    try {
      const data = await AsyncStorage.getItem(PROMPTS_KEY);
      if (data) {
        const prompts: SavedPrompt[] = JSON.parse(data);
        // Sort by creation date, most recent first
        prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSavedPrompts(prompts);
      }
    } catch (error) {
      console.error('Error loading saved prompts:', error);
    }
  };

  const saveSavedPrompts = async (prompts: SavedPrompt[]) => {
    try {
      await AsyncStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
    } catch (error) {
      console.error('Error saving prompts:', error);
    }
  };

  const savePrompt = async (name: string, formData: MusicPromptData, generatedPrompt: string) => {
    const newPrompt: SavedPrompt = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name.trim() || 'Untitled Prompt',
      formData,
      generatedPrompt,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    const updatedPrompts = [newPrompt, ...savedPrompts];
    setSavedPrompts(updatedPrompts);
    await saveSavedPrompts(updatedPrompts);
  };

  const deletePrompt = async (id: string) => {
    const updatedPrompts = savedPrompts.filter(prompt => prompt.id !== id);
    setSavedPrompts(updatedPrompts);
    await saveSavedPrompts(updatedPrompts);
  };

  const toggleFavorite = async (id: string) => {
    const updatedPrompts = savedPrompts.map(prompt =>
      prompt.id === id ? { ...prompt, isFavorite: !prompt.isFavorite } : prompt
    );
    setSavedPrompts(updatedPrompts);
    await saveSavedPrompts(updatedPrompts);
  };

  const loadPrompt = (id: string): SavedPrompt | null => {
    return savedPrompts.find(prompt => prompt.id === id) || null;
  };

  const updateLastUsed = async (id: string) => {
    const updatedPrompts = savedPrompts.map(prompt =>
      prompt.id === id ? { ...prompt, lastUsed: new Date().toISOString() } : prompt
    );
    setSavedPrompts(updatedPrompts);
    await saveSavedPrompts(updatedPrompts);
  };

  const clearHistory = async () => {
    setSavedPrompts([]);
    await AsyncStorage.removeItem(PROMPTS_KEY);
  };

  return (
    <PromptHistoryContext.Provider value={{
      savedPrompts,
      savePrompt,
      deletePrompt,
      toggleFavorite,
      loadPrompt,
      updateLastUsed,
      clearHistory,
    }}>
      {children}
    </PromptHistoryContext.Provider>
  );
}

export function usePromptHistory() {
  const context = useContext(PromptHistoryContext);
  if (context === undefined) {
    throw new Error('usePromptHistory must be used within a PromptHistoryProvider');
  }
  return context;
}
