export interface MusicPromptData {
  subject: string;
  genres_primary: string[];
  genres_electronic: string[];
  mood: string[];
  tempo_bpm: string;
  key_scale: string;
  energy: string;
  beat: string[];
  bass: string[];
  groove_swing: string;
  vocal_gender: string;
  vocal_delivery: string;
  era: string;
  master_notes: string;
  length: string;
  weirdness_level: string;
  general_freeform: string;
}

export interface SavedPrompt {
  id: string;
  name: string;
  formData: MusicPromptData;
  generatedPrompt: string;
  isFavorite: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  formData: Partial<MusicPromptData>;
}
