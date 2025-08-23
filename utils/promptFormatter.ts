import { MusicPromptData } from '../types';

// Genre-specific BPM ranges for intelligent suggestions
const GENRE_BPM_RANGES: Record<string, { min: number; max: number; typical: number }> = {
  'House': { min: 120, max: 130, typical: 128 },
  'Tech House': { min: 125, max: 130, typical: 128 },
  'Deep House': { min: 120, max: 125, typical: 122 },
  'Techno': { min: 125, max: 135, typical: 130 },
  'Trance': { min: 128, max: 140, typical: 132 },
  'Drum & Bass': { min: 170, max: 180, typical: 174 },
  'Dubstep': { min: 140, max: 150, typical: 140 },
  'Hip Hop': { min: 70, max: 140, typical: 85 },
  'Trap': { min: 130, max: 170, typical: 140 },
  'Ambient': { min: 60, max: 90, typical: 75 },
  'Breakbeat': { min: 130, max: 180, typical: 140 },
};

// Mood to key suggestions
const MOOD_KEY_SUGGESTIONS: Record<string, string[]> = {
  'melancholic': ['D minor', 'A minor', 'F minor', 'C minor'],
  'uplifting': ['C major', 'G major', 'D major', 'A major'],
  'dark': ['D minor', 'G minor', 'C minor', 'F# minor'],
  'dreamy': ['F major', 'Bb major', 'Eb major', 'Ab major'],
  'energetic': ['E major', 'B major', 'F# major', 'C# major'],
  'peaceful': ['F major', 'C major', 'G major', 'D major'],
  'mysterious': ['F# minor', 'C# minor', 'G# minor', 'D# minor'],
  'euphoric': ['A major', 'E major', 'B major', 'D major'],
};

// Enhanced genre combinations that work well together
const GENRE_SYNERGIES: Record<string, string[]> = {
  'House': ['Deep House', 'Tech House', 'Progressive House', 'Melodic House'],
  'Techno': ['Minimal Techno', 'Melodic Techno', 'Peak-Time Techno'],
  'Trance': ['Progressive Trance', 'Uplifting Trance', 'Melodic Trance'],
  'Drum & Bass': ['Liquid DnB', 'Neurofunk', 'Atmospheric DnB'],
};

// Simple prompt formatter for basic form data
export function formatPrompt(formData: any): string {
  const sections: string[] = [];
  
  // Basic genre and style
  if (formData.genre) {
    let genreText = `Create a ${formData.genre}`;
    if (formData.subgenre) {
      genreText += ` (${formData.subgenre})`;
    }
    genreText += ' track';
    sections.push(genreText);
  }
  
  // Mood and atmosphere
  if (formData.mood) {
    sections.push(`with a ${formData.mood} atmosphere`);
  }
  
  // Technical specs
  const techSpecs: string[] = [];
  if (formData.tempo) techSpecs.push(`${formData.tempo} tempo`);
  if (formData.key) techSpecs.push(`in ${formData.key}`);
  if (formData.timeSignature) techSpecs.push(`${formData.timeSignature} time signature`);
  
  if (techSpecs.length > 0) {
    sections.push(`featuring ${techSpecs.join(', ')}`);
  }
  
  // Instruments
  if (formData.instruments && formData.instruments.length > 0) {
    sections.push(`incorporating ${formData.instruments.join(', ')}`);
  }
  
  // Additional details
  if (formData.vocals) {
    sections.push(`with ${formData.vocals}`);
  }
  
  if (formData.lyrics) {
    sections.push(`exploring themes of ${formData.lyrics}`);
  }
  
  if (formData.structure) {
    sections.push(`following a ${formData.structure} structure`);
  }
  
  if (formData.production) {
    sections.push(`produced with a ${formData.production} style`);
  }
  
  if (formData.reference) {
    sections.push(`similar to ${formData.reference}`);
  }
  
  // Weirdness level
  if (formData.weirdness > 0) {
    const weirdnessLevels = [
      '', 'slightly experimental', 'creative', 'unconventional', 
      'experimental', 'very experimental', 'avant-garde', 
      'highly experimental', 'extremely avant-garde', 'completely experimental', 'absolutely avant-garde'
    ];
    sections.push(`with ${weirdnessLevels[formData.weirdness]} elements`);
  }
  
  // Custom additions
  if (formData.customPrompt) {
    sections.push(formData.customPrompt);
  }
  
  return sections.join('. ') + '.';
}

// Export the constants that the screen expects
export const GENRES = [
  'House', 'Techno', 'Trance', 'Drum & Bass', 'Dubstep', 'Hip Hop', 
  'Pop', 'Rock', 'Jazz', 'Classical', 'Ambient', 'Electronic'
];

export const MOODS = [
  'energetic', 'melancholic', 'uplifting', 'dark', 'dreamy', 'aggressive',
  'peaceful', 'nostalgic', 'mysterious', 'euphoric', 'intense', 'chill'
];

export const INSTRUMENTS = [
  'Piano', 'Guitar', 'Bass', 'Drums', 'Synthesizer', 'Strings', 
  'Brass', 'Woodwinds', 'Vocals', 'Percussion'
];

export const TEMPOS = [
  'Very Slow (60-70 BPM)', 'Slow (70-90 BPM)', 'Moderate (90-120 BPM)', 
  'Fast (120-140 BPM)', 'Very Fast (140+ BPM)'
];

export const KEYS = [
  'C major', 'C minor', 'D major', 'D minor', 'E major', 'E minor',
  'F major', 'F minor', 'G major', 'G minor', 'A major', 'A minor', 'B major', 'B minor'
];

export const TIME_SIGNATURES = ['4/4', '3/4', '6/8', '7/8', '5/4', '2/4'];
