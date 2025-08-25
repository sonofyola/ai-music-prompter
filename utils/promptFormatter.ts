interface FormData {
  genre: string;
  mood: string;
  tempo: string;
  trackLength: string;
  weirdness: string;
  instruments: string[];
  vocals: string;
  bass: string;
  tone: string;
  structure: string;
  theme: string;
  style: string;
  energy: string;
  production: string;
  customPrompt: string;
}

interface GenreDetails {
  characteristics: string[];
  typicalBPM: string;
  commonInstruments: string[];
  productionNotes: string[];
}

interface MoodDetails {
  atmosphere: string;
  emotionalTone: string;
  energyLevel: string;
  musicalElements: string[];
}

const genreDatabase: Record<string, GenreDetails> = {
  'Electronic': {
    characteristics: ['synthesized sounds', 'digital production', 'programmed beats', 'electronic textures'],
    typicalBPM: '120-140 BPM',
    commonInstruments: ['synthesizers', 'drum machines', 'samplers', 'digital effects'],
    productionNotes: ['crisp digital clarity', 'wide stereo field', 'precise timing', 'layered synthesis']
  },
  'Rock': {
    characteristics: ['guitar-driven', 'strong rhythm section', 'powerful dynamics', 'organic energy'],
    typicalBPM: '120-160 BPM',
    commonInstruments: ['electric guitar', 'bass guitar', 'drums', 'vocals'],
    productionNotes: ['punchy drums', 'guitar presence', 'dynamic range', 'live energy feel']
  },
  'Pop': {
    characteristics: ['catchy melodies', 'accessible structure', 'polished production', 'mainstream appeal'],
    typicalBPM: '100-130 BPM',
    commonInstruments: ['vocals', 'guitar', 'piano', 'drums', 'bass'],
    productionNotes: ['radio-ready mix', 'clear vocals', 'balanced frequency spectrum', 'commercial polish']
  },
  'Hip-Hop': {
    characteristics: ['rhythmic vocals', 'strong beat emphasis', 'sampling culture', 'urban aesthetics'],
    typicalBPM: '70-140 BPM',
    commonInstruments: ['drums', '808 bass', 'samples', 'vocals', 'synthesizers'],
    productionNotes: ['punchy drums', 'sub-bass presence', 'vocal clarity', 'rhythmic precision']
  },
  'Jazz': {
    characteristics: ['improvisation', 'complex harmonies', 'swing rhythms', 'instrumental virtuosity'],
    typicalBPM: '60-200 BPM',
    commonInstruments: ['piano', 'upright bass', 'drums', 'horns', 'guitar'],
    productionNotes: ['natural acoustics', 'instrument separation', 'dynamic expression', 'room ambience']
  },
  'Classical': {
    characteristics: ['orchestral arrangements', 'formal structures', 'acoustic instruments', 'dynamic expression'],
    typicalBPM: '60-180 BPM',
    commonInstruments: ['strings', 'woodwinds', 'brass', 'percussion', 'piano'],
    productionNotes: ['natural reverb', 'orchestral balance', 'dynamic range', 'spatial positioning']
  },
  'Ambient': {
    characteristics: ['atmospheric textures', 'minimal structure', 'immersive soundscapes', 'meditative quality'],
    typicalBPM: '60-100 BPM',
    commonInstruments: ['synthesizers', 'field recordings', 'processed instruments', 'effects'],
    productionNotes: ['spacious reverb', 'subtle evolution', 'textural layers', 'immersive stereo field']
  }
};

const moodDatabase: Record<string, MoodDetails> = {
  'Happy': {
    atmosphere: 'bright and uplifting',
    emotionalTone: 'joyful and optimistic',
    energyLevel: 'positive and energetic',
    musicalElements: ['major keys', 'upward melodic movement', 'bright timbres', 'rhythmic drive']
  },
  'Sad': {
    atmosphere: 'melancholic and introspective',
    emotionalTone: 'sorrowful and contemplative',
    energyLevel: 'subdued and reflective',
    musicalElements: ['minor keys', 'descending melodies', 'slower tempos', 'emotional expression']
  },
  'Energetic': {
    atmosphere: 'dynamic and powerful',
    emotionalTone: 'exciting and motivating',
    energyLevel: 'high-intensity and driving',
    musicalElements: ['fast tempos', 'strong rhythms', 'powerful dynamics', 'forward momentum']
  },
  'Calm': {
    atmosphere: 'peaceful and serene',
    emotionalTone: 'tranquil and soothing',
    energyLevel: 'relaxed and gentle',
    musicalElements: ['slow tempos', 'soft dynamics', 'flowing melodies', 'minimal percussion']
  },
  'Dark': {
    atmosphere: 'mysterious and brooding',
    emotionalTone: 'ominous and intense',
    energyLevel: 'heavy and dramatic',
    musicalElements: ['minor keys', 'low frequencies', 'dissonant harmonies', 'dramatic contrasts']
  },
  'Romantic': {
    atmosphere: 'intimate and passionate',
    emotionalTone: 'loving and tender',
    energyLevel: 'warm and embracing',
    musicalElements: ['lush harmonies', 'expressive melodies', 'gentle rhythms', 'rich textures']
  }
};

function getGenreDetails(genre: string): GenreDetails {
  return genreDatabase[genre] || {
    characteristics: ['unique musical elements'],
    typicalBPM: 'moderate tempo',
    commonInstruments: ['various instruments'],
    productionNotes: ['professional production quality']
  };
}

function getMoodDetails(mood: string): MoodDetails {
  return moodDatabase[mood] || {
    atmosphere: 'distinctive atmosphere',
    emotionalTone: 'expressive emotional content',
    energyLevel: 'appropriate energy level',
    musicalElements: ['fitting musical elements']
  };
}

function generateTempoDescription(tempo: string): string {
  const tempoDescriptions: Record<string, string> = {
    'Very Slow (60-80 BPM)': 'extremely relaxed pace with spacious timing, allowing each musical element to breathe and develop naturally',
    'Slow (80-100 BPM)': 'deliberate and contemplative tempo that creates space for emotional expression and detailed musical development',
    'Medium (100-120 BPM)': 'comfortable walking pace that balances energy with accessibility, perfect for both active listening and background ambience',
    'Fast (120-140 BPM)': 'energetic and driving tempo that creates forward momentum and encourages physical response',
    'Very Fast (140+ BPM)': 'high-energy pace that generates excitement and intensity, demanding attention and creating urgency'
  };
  
  return tempoDescriptions[tempo] || 'appropriately paced for the musical context';
}

function generateStructureDescription(structure: string): string {
  const structureDescriptions: Record<string, string> = {
    'Verse-Chorus': 'traditional song structure with distinct verse sections that build narrative tension, followed by memorable chorus sections that provide emotional release and melodic hooks',
    'AABA': 'classic 32-bar form with two identical A sections establishing the main theme, a contrasting B section (bridge) that provides harmonic and melodic variation, and a return to the A section for resolution',
    'Free Form': 'organic, non-repetitive structure that evolves naturally, allowing musical ideas to develop and transform without predetermined constraints',
    'Minimalist': 'repetitive structure with subtle variations, focusing on gradual evolution of simple musical elements through layering, filtering, and textural changes',
    'Build-up/Drop': 'electronic music structure featuring extended tension-building sections with rising energy, followed by explosive release sections with full arrangement and maximum impact'
  };
  
  return structureDescriptions[structure] || 'well-organized musical structure that serves the artistic vision';
}

function generateInstrumentDetails(instruments: string[]): string {
  const instrumentDescriptions: Record<string, string> = {
    'Piano': 'expressive piano with dynamic touch sensitivity, rich harmonic content, and natural acoustic resonance',
    'Guitar': 'guitar with authentic string resonance, natural fret noise, and expressive playing techniques including bends, slides, and vibrato',
    'Drums': 'full drum kit with punchy kick, crisp snare, detailed hi-hats, and natural room ambience',
    'Bass': 'deep, foundational bass with clear note definition, appropriate sustain, and rhythmic precision',
    'Violin': 'expressive violin with natural bow articulation, string resonance, and dynamic expression',
    'Synthesizer': 'versatile synthesizer with rich harmonic content, smooth parameter modulation, and creative sound design',
    'Saxophone': 'warm saxophone with natural breath sounds, expressive vibrato, and authentic jazz articulation',
    'Trumpet': 'bright trumpet with natural brass resonance, precise attack, and expressive dynamic range',
    'Flute': 'ethereal flute with gentle breath sounds, smooth legato passages, and delicate high-frequency content',
    'Cello': 'rich cello with warm low-end resonance, expressive bowing techniques, and natural string harmonics'
  };
  
  if (instruments.length === 0) return '';
  
  const details = instruments.map(instrument => 
    instrumentDescriptions[instrument] || `${instrument.toLowerCase()} with authentic sound characteristics and expressive performance qualities`
  );
  
  return details.join(', ');
}

function generateVocalDescription(vocals: string): string {
  const vocalDescriptions: Record<string, string> = {
    'Male Lead': 'confident male lead vocals with natural breath sounds, clear articulation, and expressive dynamic range that conveys emotion authentically',
    'Female Lead': 'expressive female lead vocals with smooth tone, natural vibrato, and emotional depth that connects with the listener',
    'Harmonies': 'rich vocal harmonies with careful voice leading, balanced blend, and supportive arrangement that enhances the main melody',
    'Choir': 'full choir arrangement with multiple voice parts, natural blend, and spatial positioning that creates an immersive vocal landscape',
    'Rap': 'rhythmic rap vocals with clear articulation, natural flow, and authentic delivery that matches the beat perfectly',
    'Acapella': 'pure vocal arrangement without instrumental accompaniment, featuring rich harmonies, vocal percussion, and creative vocal techniques',
    'Instrumental': 'purely instrumental composition focusing on melodic instruments and musical interplay without vocal elements'
  };
  
  return vocalDescriptions[vocals] || 'vocal elements that serve the musical arrangement effectively';
}

function generateBassDescription(bass: string): string {
  const bassDescriptions: Record<string, string> = {
    'Deep Bass': 'profound sub-bass frequencies (20-60 Hz) that create physical impact and foundational support, felt as much as heard',
    'Heavy Bass': 'powerful, aggressive bass presence with strong attack, sustained energy, and commanding low-end dominance',
    'Sub Bass': 'pure sub-bass tones focusing on the lowest audible frequencies, providing invisible foundation and physical sensation',
    'Punchy Bass': 'tight, percussive bass with sharp attack transients, quick decay, and rhythmic precision that cuts through the mix',
    'Warm Bass': 'rich, rounded bass tones with harmonic content, smooth sustain, and inviting musical character',
    'Tight Bass': 'controlled, precise bass with clean definition, minimal resonance, and professional polish',
    'Boomy Bass': 'resonant bass with extended decay, room-like qualities, and natural acoustic characteristics',
    'Distorted Bass': 'harmonically saturated bass with overdrive character, aggressive edge, and powerful presence',
    'Clean Bass': 'pure, unprocessed bass tones with natural clarity, transparent quality, and authentic instrument character',
    'Funky Bass': 'rhythmically complex bass with syncopated patterns, percussive techniques, and groove-oriented playing style'
  };
  
  return bassDescriptions[bass] || 'bass elements that provide appropriate low-end foundation';
}

function generateWeirdnessDescription(weirdness: string): string {
  const weirdnessDescriptions: Record<string, string> = {
    'Very Normal (0-20%)': 'conventional musical elements following established genre traditions, familiar chord progressions, standard song structures, and accessible melodic content that appeals to mainstream audiences',
    'Slightly Unusual (20-40%)': 'subtle creative departures from convention including occasional unexpected chord changes, minor structural variations, and gentle genre-blending elements that maintain accessibility while adding interest',
    'Moderately Weird (40-60%)': 'noticeable experimental elements including unconventional song structures, creative instrumentation choices, unusual harmonic progressions, and genre-fusion approaches that challenge expectations while remaining engaging',
    'Very Weird (60-80%)': 'significantly experimental content featuring abstract musical concepts, dissonant harmonies, non-traditional structures, and creative sound design that pushes artistic boundaries',
    'Extremely Experimental (80-95%)': 'highly avant-garde approach with abstract musical concepts, atonal harmonies, non-traditional sound sources, and challenging artistic statements that prioritize innovation over accessibility',
    'Completely Abstract (95-100%)': 'pure sonic exploration without conventional musical elements, focusing on texture, atmosphere, and conceptual sound art rather than traditional melody, harmony, or rhythm'
  };
  
  return weirdnessDescriptions[weirdness] || 'appropriate level of creative experimentation for the artistic context';
}

function generateToneDescription(tone: string): string {
  const toneDescriptions: Record<string, string> = {
    'Warm': 'warm, inviting tonal qualities with rich harmonic content and comfortable frequency response',
    'Bright': 'bright, clear tonal characteristics with enhanced high-frequency presence and crisp definition',
    'Dark': 'dark, moody tonal palette with emphasis on lower frequencies and subdued high-end',
    'Cold': 'cold, precise tonal qualities with clean, analytical frequency response and minimal warmth',
    'Rich': 'rich, full-bodied tonal characteristics with complex harmonic content and depth',
    'Thin': 'thin, focused tonal qualities with minimal low-end and concentrated mid-range presence',
    'Full': 'full, expansive tonal range with balanced frequency spectrum and substantial presence',
    'Hollow': 'hollow, resonant tonal qualities with scooped mid-range and atmospheric character',
    'Crisp': 'crisp, well-defined tonal characteristics with sharp transients and clear articulation',
    'Smooth': 'smooth, polished tonal qualities with gentle frequency response and flowing character',
    'Rough': 'rough, textured tonal characteristics with harmonic distortion and gritty character',
    'Clean': 'clean, pristine tonal qualities with minimal processing and natural frequency response',
    'Dirty': 'dirty, saturated tonal characteristics with harmonic distortion and aggressive character',
    'Vintage': 'vintage-inspired tonal qualities with analog warmth and period-appropriate character',
    'Modern': 'modern, contemporary tonal characteristics with digital precision and current production standards'
  };
  
  return toneDescriptions[tone] || 'distinctive tonal characteristics that serve the musical arrangement';
}

export function formatPrompt(formData: FormData): string {
  const promptParts: string[] = [];
  
  // Start with genre foundation
  if (formData.genre) {
    promptParts.push(`Create a ${formData.genre.toLowerCase()} track`);
    
    if (formData.style) {
      promptParts.push(`with ${formData.style.toLowerCase()} influences`);
    }
  } else if (formData.style) {
    promptParts.push(`Create a ${formData.style.toLowerCase()} style track`);
  } else {
    promptParts.push('Create a musical track');
  }
  
  // Add mood and energy
  if (formData.mood) {
    const moodDetails = getMoodDetails(formData.mood);
    promptParts.push(`with a ${formData.mood.toLowerCase()} mood featuring ${moodDetails.musicalElements.slice(0, 2).join(' and ')}`);
  }
  
  if (formData.energy && formData.energy !== formData.mood) {
    promptParts.push(`and ${formData.energy.toLowerCase()} energy`);
  }
  
  // Add tone
  if (formData.tone) {
    const toneDesc = generateToneDescription(formData.tone);
    promptParts.push(`with ${toneDesc}`);
  }
  
  // Add tempo and length
  if (formData.tempo) {
    promptParts.push(`at ${formData.tempo.toLowerCase()}`);
  }
  
  if (formData.trackLength) {
    promptParts.push(`lasting ${formData.trackLength.toLowerCase()}`);
  }
  
  // Add instrumentation
  if (formData.instruments.length > 0) {
    const instrumentDetails = generateInstrumentDetails(formData.instruments);
    promptParts.push(`featuring ${instrumentDetails}`);
  }
  
  // Add vocals
  if (formData.vocals) {
    const vocalDesc = generateVocalDescription(formData.vocals);
    promptParts.push(`with ${vocalDesc}`);
  }
  
  // Add bass
  if (formData.bass) {
    const bassDesc = generateBassDescription(formData.bass);
    promptParts.push(`built on ${bassDesc}`);
  }
  
  // Add structure
  if (formData.structure) {
    const structureDesc = generateStructureDescription(formData.structure);
    promptParts.push(`using ${structureDesc}`);
  }
  
  // Add production style
  if (formData.production) {
    promptParts.push(`with ${formData.production.toLowerCase()} production quality`);
  }
  
  // Add weirdness level
  if (formData.weirdness) {
    const weirdnessDesc = generateWeirdnessDescription(formData.weirdness);
    promptParts.push(`incorporating ${weirdnessDesc}`);
  }
  
  // Add theme
  if (formData.theme) {
    promptParts.push(`centered around ${formData.theme.toLowerCase()}`);
  }
  
  // Add custom instructions
  if (formData.customPrompt) {
    promptParts.push(`while including ${formData.customPrompt}`);
  }
  
  // Add quality directive
  promptParts.push('Ensure professional audio quality with clear mix, balanced frequencies, authentic instrument sounds, and engaging musical flow throughout.');
  
  // Join all parts into one paragraph
  let finalPrompt = promptParts.join(' ');
  
  // Clean up spacing and flow
  finalPrompt = finalPrompt.replace(/\s+/g, ' ').trim();
  
  // If no meaningful content, return guidance
  if (promptParts.length <= 2) {
    return 'Please fill in the form fields above to generate a detailed music prompt. The more information you provide, the better your AI music results will be.';
  }
  
  return finalPrompt;
}
