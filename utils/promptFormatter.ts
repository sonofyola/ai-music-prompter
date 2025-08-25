interface FormData {
  genre: string;
  mood: string;
  tempo: string;
  trackLength: string;
  weirdness: string;
  instruments: string[];
  vocals: string;
  bass: string;
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
  
  return `Instrumentation featuring: ${details.join('; ')}.`;
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

export function formatPrompt(formData: FormData): string {
  const sections: string[] = [];
  
  // Generate comprehensive header
  sections.push('=== COMPREHENSIVE AI MUSIC GENERATION PROMPT ===\n');
  
  // Core Musical Identity
  if (formData.genre || formData.style) {
    sections.push('🎵 CORE MUSICAL IDENTITY:');
    
    if (formData.genre) {
      const genreDetails = getGenreDetails(formData.genre);
      sections.push(`Primary Genre: ${formData.genre}`);
      sections.push(`Genre Characteristics: ${genreDetails.characteristics.join(', ')}`);
      sections.push(`Typical BPM Range: ${genreDetails.typicalBPM}`);
      sections.push(`Production Notes: ${genreDetails.productionNotes.join(', ')}`);
    }
    
    if (formData.style) {
      sections.push(`Musical Style: ${formData.style} with authentic stylistic elements and period-appropriate production techniques`);
    }
    sections.push('');
  }
  
  // Emotional and Atmospheric Direction
  if (formData.mood || formData.energy || formData.theme) {
    sections.push('🎭 EMOTIONAL & ATMOSPHERIC DIRECTION:');
    
    if (formData.mood) {
      const moodDetails = getMoodDetails(formData.mood);
      sections.push(`Primary Mood: ${formData.mood}`);
      sections.push(`Atmospheric Quality: ${moodDetails.atmosphere}`);
      sections.push(`Emotional Tone: ${moodDetails.emotionalTone}`);
      sections.push(`Energy Characteristics: ${moodDetails.energyLevel}`);
      sections.push(`Musical Elements: ${moodDetails.musicalElements.join(', ')}`);
    }
    
    if (formData.energy) {
      sections.push(`Energy Level: ${formData.energy} with appropriate dynamic range and intensity progression`);
    }
    
    if (formData.theme) {
      sections.push(`Thematic Content: ${formData.theme} - ensure all musical elements support and enhance this central theme throughout the composition`);
    }
    sections.push('');
  }
  
  // Technical Specifications
  sections.push('⚙️ TECHNICAL SPECIFICATIONS:');
  
  if (formData.tempo) {
    sections.push(`Tempo: ${formData.tempo}`);
    sections.push(`Tempo Description: ${generateTempoDescription(formData.tempo)}`);
  }
  
  if (formData.trackLength) {
    sections.push(`Track Duration: ${formData.trackLength}`);
    sections.push(`Length Considerations: Structure the composition to fully utilize the specified duration with appropriate pacing, development, and resolution`);
  }
  
  if (formData.weirdness) {
    sections.push(`Creative Experimentation Level: ${formData.weirdness}`);
    sections.push(`Experimental Approach: ${generateWeirdnessDescription(formData.weirdness)}`);
  }
  sections.push('');
  
  // Instrumentation and Arrangement
  if (formData.instruments.length > 0 || formData.vocals || formData.bass) {
    sections.push('🎼 INSTRUMENTATION & ARRANGEMENT:');
    
    if (formData.instruments.length > 0) {
      sections.push(generateInstrumentDetails(formData.instruments));
      sections.push('Arrangement Notes: Balance all instruments with careful attention to frequency separation, dynamic interaction, and musical conversation between parts.');
    }
    
    if (formData.vocals) {
      sections.push(`Vocal Approach: ${generateVocalDescription(formData.vocals)}`);
    }
    
    if (formData.bass) {
      sections.push(`Bass Characteristics: ${generateBassDescription(formData.bass)}`);
    }
    sections.push('');
  }
  
  // Song Structure and Development
  if (formData.structure) {
    sections.push('🏗️ SONG STRUCTURE & DEVELOPMENT:');
    sections.push(`Structural Framework: ${generateStructureDescription(formData.structure)}`);
    sections.push('Development Notes: Ensure smooth transitions between sections, maintain listener interest through variation, and create satisfying musical arc from beginning to end.');
    sections.push('');
  }
  
  // Production and Sound Design
  if (formData.production) {
    sections.push('🎚️ PRODUCTION & SOUND DESIGN:');
    sections.push(`Production Style: ${formData.production} with attention to sonic clarity, spatial positioning, and professional polish`);
    sections.push('Mix Considerations: Achieve balanced frequency spectrum, appropriate dynamic range, clear instrument separation, and cohesive sonic character throughout.');
    sections.push('');
  }
  
  // Additional Creative Instructions
  if (formData.customPrompt) {
    sections.push('🎨 ADDITIONAL CREATIVE INSTRUCTIONS:');
    sections.push(formData.customPrompt);
    sections.push('Integration Notes: Seamlessly incorporate these additional elements while maintaining overall musical coherence and artistic vision.');
    sections.push('');
  }
  
  // Quality and Performance Standards
  sections.push('✨ QUALITY & PERFORMANCE STANDARDS:');
  sections.push('• Maintain professional audio quality with clear, balanced mix');
  sections.push('• Ensure musical elements work together cohesively');
  sections.push('• Create engaging listening experience from start to finish');
  sections.push('• Balance creativity with musical accessibility');
  sections.push('• Deliver authentic performance characteristics for all instruments');
  sections.push('• Achieve appropriate emotional impact and artistic expression');
  sections.push('');
  
  // Final Creative Direction
  sections.push('🎯 FINAL CREATIVE DIRECTION:');
  sections.push('Create a complete, professional-quality musical composition that fulfills all specified parameters while maintaining artistic integrity and emotional authenticity. Pay special attention to the interplay between all elements, ensuring they support the overall musical vision and create a compelling, memorable listening experience.');
  
  const finalPrompt = sections.join('\n');
  
  // If no meaningful content was provided, return helpful guidance
  if (sections.length <= 3) {
    return `=== AI MUSIC GENERATION PROMPT ===

🎵 GETTING STARTED:
To generate a detailed, professional music prompt, please fill in the form fields above. The more information you provide, the more comprehensive and articulated your prompt will become.

✨ RECOMMENDED FIELDS TO COMPLETE:
• Genre - Defines the musical foundation
• Mood - Sets the emotional direction  
• Tempo - Establishes the rhythmic feel
• Instruments - Specifies the sonic palette
• Structure - Organizes the musical flow

🎯 RESULT:
Once you complete the fields, you'll receive a highly detailed, professional-grade prompt that provides comprehensive instructions for AI music generation, including technical specifications, creative direction, and quality standards.`;
  }
  
  return finalPrompt;
}