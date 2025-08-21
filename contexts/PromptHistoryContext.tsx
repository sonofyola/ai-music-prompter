import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBasic } from '@basictech/expo';
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
  const { user, db, isSignedIn } = useBasic();
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    loadPrompts();
  }, [isSignedIn, user, db]);

  const loadPrompts = async () => {
    if (isSignedIn && user && db) {
      // Load from database
      try {
        const userPrompts = await db.from('prompt_history').getAll();
        const filteredPrompts = userPrompts?.filter(p => p.user_id === user.id) || [];
        const formattedPrompts = filteredPrompts.map(p => ({
          id: String(p.id),
          name: String(p.name),
          formData: JSON.parse(String(p.form_data)),
          generatedPrompt: String(p.generated_prompt),
          createdAt: String(p.created_at),
        }));
        setPrompts(formattedPrompts);
      } catch (error) {
        console.error('Error loading prompts from database:', error);
        setPrompts([]);
      }
    } else {
      // Load from local storage
      try {
        const stored = await AsyncStorage.getItem('promptHistory');
        if (stored) {
          setPrompts(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading prompts from local storage:', error);
        setPrompts([]);
      }
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

    if (isSignedIn && user && db) {
      // Save to database
      try {
        await db.from('prompt_history').add({
          id: newPrompt.id,
          user_id: user.id,
          name: newPrompt.name,
          form_data: JSON.stringify(newPrompt.formData),
          generated_prompt: newPrompt.generatedPrompt,
          created_at: newPrompt.createdAt,
        });
        setPrompts(prev => [newPrompt, ...prev]);
      } catch (error) {
        console.error('Error saving prompt to database:', error);
        throw error;
      }
    } else {
      // Save to local storage
      try {
        const updatedPrompts = [newPrompt, ...prompts];
        setPrompts(updatedPrompts);
        await AsyncStorage.setItem('promptHistory', JSON.stringify(updatedPrompts));
      } catch (error) {
        console.error('Error saving prompt to local storage:', error);
        throw error;
      }
    }
  };

  const deletePrompt = async (id: string) => {
    if (isSignedIn && user && db) {
      // Delete from database
      try {
        await db.from('prompt_history').delete(id);
        setPrompts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting prompt from database:', error);
        throw error;
      }
    } else {
      // Delete from local storage
      try {
        const updatedPrompts = prompts.filter(p => p.id !== id);
        setPrompts(updatedPrompts);
        await AsyncStorage.setItem('promptHistory', JSON.stringify(updatedPrompts));
      } catch (error) {
        console.error('Error deleting prompt from local storage:', error);
        throw error;
      }
    }
  };

  const clearHistory = async () => {
    if (isSignedIn && user && db) {
      // Clear from database
      try {
        const userPrompts = await db.from('prompt_history').getAll();
        const userPromptIds = userPrompts?.filter(p => p.user_id === user.id).map(p => String(p.id)) || [];
        
        for (const id of userPromptIds) {
          await db.from('prompt_history').delete(id);
        }
        setPrompts([]);
      } catch (error) {
        console.error('Error clearing prompts from database:', error);
        throw error;
      }
    } else {
      // Clear from local storage
      try {
        setPrompts([]);
        await AsyncStorage.removeItem('promptHistory');
      } catch (error) {
        console.error('Error clearing prompts from local storage:', error);
        throw error;
      }
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
