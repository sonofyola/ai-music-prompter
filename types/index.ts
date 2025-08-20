export interface MusicPromptData {
  genres_primary: string[];
  genres_electronic: string[];
  subject: string;
  vocal_gender: 'male' | 'female' | 'male+female' | 'androgynous' | 'none' | '';
  vocal_delivery: 'singing' | 'spoken word' | 'whispered' | 'acapella' | 'rap' | 'chant' | 'vocoder' | 'robotic' | '';
  mood: string[];
  tempo_bpm: string;
  key_scale: string;
  time_signature: string;
  energy: 'low' | 'medium' | 'high' | 'evolving' | '';
  bass: string;
  beat: string;
  groove_swing: 'straight' | 'light swing' | 'heavy swing' | 'shuffle' | '';
  sound_palette: string;
  arrangement: string;
  fx_processing: string;
  space: string;
  references: string;
  mix_notes: string;
  master_notes: string;
  era: string;
  length: string;
  general_freeform: string;
  // Audio analysis fields
  audio_analysis?: {
    detected_genres: string[];
    detected_mood: string[];
    detected_tempo: string;
    detected_energy: string;
    detected_style: string;
    detected_instruments: string;
    detected_vibe: string;
  };
}
