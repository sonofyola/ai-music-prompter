import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicPromptData } from '../types';

export interface SavedPrompt {
  id: string;
  name: string;
  formData: MusicPromptData;
  generatedPrompt: string;
  createdAt: string;
}

interface PromptHistoryContextType {
  prompts: SavedPrompt[];
  savePrompt: (name: string, formData: MusicPromptData, generatedPrompt: string) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadPrompts: () => Promise<void>;
}

const PromptHistoryContext = createContext<PromptHistoryContextType | undefined>(undefined);

export function PromptHistoryProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const stored = await AsyncStorage.getItem('promptHistory');
      if (stored) {
        setPrompts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading prompts from local storage:', error);
      setPrompts([]);
    }
  };

  const savePrompt = async (name: string, formData: MusicPromptData, generatedPrompt: string) => {
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      name,
      formData,
      generatedPrompt,
      createdAt: new Date().toISOString(),
    };

    try {
      const updatedPrompts = [newPrompt, ...prompts];
      setPrompts(updatedPrompts);
      await AsyncStorage.setItem('promptHistory', JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error('Error saving prompt to local storage:', error);
      throw error;
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      const updatedPrompts = prompts.filter(p => p.id !== id);
      setPrompts(updatedPrompts);
      await AsyncStorage.setItem('promptHistory', JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error('Error deleting prompt from local storage:', error);
      throw error;
    }
  };

  const clearHistory = async () => {
    try {
      setPrompts([]);
      await AsyncStorage.removeItem('promptHistory');
    } catch (error) {
      console.error('Error clearing prompts from local storage:', error);
      throw error;
    }
  };

  return (
    <PromptHistoryContext.Provider value={{
      prompts,
      savePrompt,
      deletePrompt,
      clearHistory,
      loadPrompts,
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
