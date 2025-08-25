export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  formData: {
    genre: string;
    mood: string;
    tempo: string;
    instruments: string[];
    vocals: string;
    structure: string;
    theme: string;
    style: string;
    energy: string;
    production: string;
    customPrompt: string;
  };
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: 'deep-house-club',
    name: 'Deep House Club Banger',
    description: 'Perfect for club nights and dance floors',
    formData: {
      genre: 'Deep House',
      mood: 'Energetic',
      tempo: 'Fast (120-140 BPM)',
      instruments: ['Synthesizer', 'Bass', 'Drums'],
      vocals: 'Female Lead',
      structure: 'Intro-Verse-Chorus-Outro',
      theme: 'nightlife, dancing, freedom',
      style: 'Modern',
      energy: 'High',
      production: 'Studio Quality',
      customPrompt: 'Four-on-the-floor kick pattern, filtered synth sweeps, deep bassline'
    }
  },
  {
    id: 'minimal-techno',
    name: 'Minimal Techno Journey',
    description: 'Hypnotic and driving minimal techno',
    formData: {
      genre: 'Minimal Techno',
      mood: 'Dark',
      tempo: 'Fast (120-140 BPM)',
      instruments: ['Synthesizer', 'Drums'],
      vocals: 'Instrumental Only',
      structure: 'Free Form',
      theme: 'industrial, machinery, repetition',
      style: 'Minimalist',
      energy: 'Medium',
      production: 'Compressed',
      customPrompt: 'Repetitive percussion, subtle filter automation, sparse arrangement'
    }
  },
  {
    id: 'ambient-chill',
    name: 'Ambient Chillout',
    description: 'Relaxing ambient soundscape',
    formData: {
      genre: 'Ambient',
      mood: 'Calm',
      tempo: 'Very Slow (60-70 BPM)',
      instruments: ['Synthesizer', 'Piano'],
      vocals: 'Instrumental Only',
      structure: 'Free Form',
      theme: 'nature, meditation, peace',
      style: 'Ambient',
      energy: 'Very Low',
      production: 'Reverb Heavy',
      customPrompt: 'Atmospheric pads, field recordings, slow evolution'
    }
  },
  {
    id: 'synthwave-retro',
    name: 'Synthwave Nostalgia',
    description: '80s inspired synthwave track',
    formData: {
      genre: 'Synthwave',
      mood: 'Nostalgic',
      tempo: 'Moderate (90-120 BPM)',
      instruments: ['Synthesizer', 'Drums'],
      vocals: 'Instrumental Only',
      structure: 'Verse-Chorus-Verse-Chorus-Bridge-Chorus',
      theme: 'retro, neon, cyberpunk',
      style: 'Vintage',
      energy: 'Medium',
      production: 'Hi-Fi',
      customPrompt: 'Analog synth leads, gated reverb drums, arpeggiated basslines'
    }
  },
  {
    id: 'drum-bass-liquid',
    name: 'Liquid Drum & Bass',
    description: 'Smooth and melodic liquid DnB',
    formData: {
      genre: 'Liquid DnB',
      mood: 'Uplifting',
      tempo: 'Very Fast (140+ BPM)',
      instruments: ['Bass', 'Drums', 'Piano'],
      vocals: 'Female Lead',
      structure: 'Intro-Verse-Chorus-Outro',
      theme: 'flowing, water, movement',
      style: 'Modern',
      energy: 'High',
      production: 'Layered',
      customPrompt: 'Chopped breakbeats, rolling basslines, jazzy chord progressions'
    }
  }
];