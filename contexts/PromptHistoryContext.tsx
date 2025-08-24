import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useBasic } from '@basictech/expo';
import { MusicPromptData, SavedPrompt } from '../types';

interface PromptHistoryContextType {
  prompts: SavedPrompt[];
  savePrompt: (name: string, formData: MusicPromptData, generatedPrompt: string) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadPrompts: () => Promise<void>;
  isLoading: boolean;
}

const PromptHistoryContext = createContext<PromptHistoryContextType | undefined>(undefined);

export function PromptHistoryProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { db, user, isSignedIn } = useBasic();

  const loadPrompts = useCallback(async () => {
    if (!db || !user) {
      setPrompts([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const userPrompts = await db.from('prompt_history').getAll();
      
      // Filter prompts for current user and parse the data
      const filteredPrompts = userPrompts
        .filter((prompt: any) => prompt.user_id === user.id)
        .map((prompt: any) => {
          try {
            return {
              id: String(prompt.id),
              name: String(prompt.name),
              formData: JSON.parse(String(prompt.form_data)),
              generatedPrompt: String(prompt.generated_prompt),
              createdAt: String(prompt.created_at),
              userId: String(prompt.user_id),
            };
          } catch (parseError) {
            console.error('Error parsing prompt data:', parseError);
            return null;
          }
        })
        .filter(Boolean) // Remove null entries
        .sort((a: SavedPrompt, b: SavedPrompt) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      
      setPrompts(filteredPrompts);
    } catch (error) {
      console.error('Error loading prompts from database:', error);
      setPrompts([]);
    } finally {
      setIsLoading(false);
    }
  }, [db, user]);

  useEffect(() => {
    if (isSignedIn && db && user) {
      loadPrompts().catch(error => {
        console.error('Failed to load prompts:', error);
        setPrompts([]);
        setIsLoading(false);
      });
    } else {
      setPrompts([]);
      setIsLoading(false);
    }
  }, [isSignedIn, db, user, loadPrompts]);

  const savePrompt = async (name: string, formData: MusicPromptData, generatedPrompt: string) => {
    if (!db || !user) {
      throw new Error('Database not available or user not signed in');
    }

    try {
      const promptData = {
        name,
        form_data: JSON.stringify(formData),
        generated_prompt: generatedPrompt,
        created_at: new Date().toISOString(),
        user_id: user.id,
      };

      const savedPrompt = await db.from('prompt_history').add(promptData);
      
      if (savedPrompt) {
        try {
          const newPrompt: SavedPrompt = {
            id: String(savedPrompt.id),
            name: String(savedPrompt.name),
            formData: JSON.parse(String(savedPrompt.form_data)),
            generatedPrompt: String(savedPrompt.generated_prompt),
            createdAt: String(savedPrompt.created_at),
            userId: String(savedPrompt.user_id),
          };
          
          setPrompts(prev => [newPrompt, ...prev]);
        } catch (parseError) {
          console.error('Error parsing saved prompt:', parseError);
          // Reload prompts to ensure consistency
          await loadPrompts();
        }
      }
    } catch (error) {
      console.error('Error saving prompt to database:', error);
      throw error;
    }
  };

  const deletePrompt = async (id: string) => {
    if (!db) {
      throw new Error('Database not available');
    }

    try {
      await db.from('prompt_history').delete(id);
      setPrompts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting prompt from database:', error);
      throw error;
    }
  };

  const clearHistory = async () => {
    if (!db || !user) {
      throw new Error('Database not available or user not signed in');
    }

    try {
      // Get all user prompts and delete them
      const userPrompts = prompts.filter(p => p.userId === user.id);
      
      for (const prompt of userPrompts) {
        try {
          await db.from('prompt_history').delete(prompt.id);
        } catch (deleteError) {
          console.error('Error deleting individual prompt:', deleteError);
          // Continue with other deletions
        }
      }
      
      setPrompts([]);
    } catch (error) {
      console.error('Error clearing prompts from database:', error);
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
      isLoading,
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
