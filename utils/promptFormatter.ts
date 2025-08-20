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

export function formatMusicPrompt(data: MusicPromptData): string {
  const sections: string[] = [];
  
  // Analyze the input for intelligent suggestions
  const allGenres = [...data.genres_primary, ...data.genres_electronic].filter(Boolean);
  const primaryGenre = allGenres[0];
  const hasVocals = data.vocal_gender && data.vocal_gender !== 'none';
  
  // 1. OPENING HOOK - Make it compelling and specific
  const openingHook = createOpeningHook(data, allGenres);
  if (openingHook) sections.push(openingHook);
  
  // 2. GENRE & STYLE FOUNDATION
  const genreFoundation = createGenreFoundation(allGenres, data.era);
  if (genreFoundation) sections.push(genreFoundation);
  
  // 3. EMOTIONAL CORE & MOOD
  const emotionalCore = createEmotionalCore(data.mood, data.subject);
  if (emotionalCore) sections.push(emotionalCore);
  
  // 4. TECHNICAL SPECIFICATIONS
  const techSpecs = createTechnicalSpecs(data, primaryGenre);
  if (techSpecs) sections.push(techSpecs);
  
  // 5. RHYTHMIC FOUNDATION
  const rhythmicFoundation = createRhythmicFoundation(data, allGenres);
  if (rhythmicFoundation) sections.push(rhythmicFoundation);
  
  // 6. VOCAL DIRECTION (if applicable)
  if (hasVocals) {
    const vocalDirection = createVocalDirection(data);
    if (vocalDirection) sections.push(vocalDirection);
  }
  
  // 7. PRODUCTION & ARRANGEMENT
  const productionNotes = createProductionNotes(data, allGenres);
  if (productionNotes) sections.push(productionNotes);
  
  // 8. CREATIVE DIRECTION & FREEFORM
  if (data.general_freeform.trim()) {
    sections.push(`Creative direction: ${data.general_freeform.trim()}`);
  }
  
  // 9. PROFESSIONAL CLOSING
  const professionalClosing = createProfessionalClosing(data, allGenres);
  if (professionalClosing) sections.push(professionalClosing);
  
  return sections.filter(Boolean).join(' ');
}

function createOpeningHook(data: MusicPromptData, genres: string[]): string {
  const subject = data.subject.trim();
  
  if (genres.length > 0 && subject) {
    const genreText = genres.length === 1 ? genres[0] : `${genres.slice(0, -1).join(', ')} and ${genres[genres.length - 1]}`;
    return `Produce a captivating ${genreText} track that explores the theme of "${subject}".`;
  } else if (genres.length > 0) {
    const genreText = genres.length === 1 ? genres[0] : `${genres.slice(0, -1).join(', ')} and ${genres[genres.length - 1]}`;
    return `Create a powerful ${genreText} composition that showcases the genre's signature elements.`;
  } else if (subject) {
    return `Craft a compelling musical piece centered around "${subject}".`;
  }
  
  return 'Produce an engaging and professionally crafted musical composition.';
}

function createGenreFoundation(genres: string[], era: string): string {
  if (genres.length === 0) return '';
  
  let foundation = '';
  
  if (genres.length === 1) {
    foundation = `Draw from the core elements of ${genres[0]}, incorporating its characteristic sound design, arrangement patterns, and production techniques.`;
  } else {
    // Check for genre synergies
    const primaryGenre = genres[0];
    const synergisticGenres = genres.filter(g => GENRE_SYNERGIES[primaryGenre]?.includes(g));
    
    if (synergisticGenres.length > 0) {
      foundation = `Blend ${primaryGenre} with ${synergisticGenres.join(' and ')} influences, creating a cohesive fusion that highlights the best of each style.`;
    } else {
      foundation = `Expertly fuse ${genres.slice(0, -1).join(', ')} and ${genres[genres.length - 1]}, ensuring each genre's signature elements complement rather than compete.`;
    }
  }
  
  if (era.trim()) {
    foundation += ` Channel the ${era} aesthetic with period-authentic production choices, sound selection, and arrangement philosophy.`;
  }
  
  return foundation;
}

function createEmotionalCore(moods: string[], subject: string): string {
  if (moods.length === 0) return '';
  
  let emotional = '';
  
  if (moods.length === 1) {
    emotional = `The track should radiate a ${moods[0]} atmosphere`;
  } else if (moods.length === 2) {
    emotional = `Create an emotional journey that transitions between ${moods[0]} and ${moods[1]} feelings`;
  } else {
    emotional = `Weave together ${moods.slice(0, -1).join(', ')} and ${moods[moods.length - 1]} emotions`;
  }
  
  if (subject.trim()) {
    emotional += `, using the theme of "${subject}" as the emotional anchor that guides every musical decision.`;
  } else {
    emotional += ', ensuring every element serves the emotional narrative.';
  }
  
  return emotional;
}

function createTechnicalSpecs(data: MusicPromptData, primaryGenre?: string): string {
  const specs: string[] = [];
  
  // Intelligent BPM handling
  if (data.tempo_bpm.trim()) {
    const bpmText = data.tempo_bpm.trim();
    if (primaryGenre && GENRE_BPM_RANGES[primaryGenre]) {
      const range = GENRE_BPM_RANGES[primaryGenre];
      specs.push(`Set the tempo at ${bpmText} BPM, optimized for ${primaryGenre}'s typical energy and danceability`);
    } else {
      specs.push(`Maintain a ${bpmText} BPM tempo that supports the track's energy and groove`);
    }
  }
  
  // Smart key selection
  if (data.key_scale.trim()) {
    const keyText = data.key_scale.trim();
    const moodKeys = data.mood.flatMap(mood => MOOD_KEY_SUGGESTIONS[mood] || []);
    if (moodKeys.includes(keyText)) {
      specs.push(`Compose in ${keyText}, perfectly chosen to enhance the track's emotional resonance`);
    } else {
      specs.push(`Structure the composition in ${keyText}`);
    }
  }
  
  // Energy dynamics
  if (data.energy) {
    const energyDescriptions = {
      'low': 'subtle, introspective energy that draws listeners into an intimate sonic space',
      'medium': 'balanced energy that maintains engagement without overwhelming',
      'high': 'driving, intense energy that commands attention and movement',
      'evolving': 'dynamic energy that builds and releases strategically throughout the arrangement'
    };
    
    specs.push(`Maintain ${energyDescriptions[data.energy] || data.energy + ' energy levels'}`);
  }
  
  if (specs.length === 0) return '';
  
  return specs.join(', ') + '.';
}

function createRhythmicFoundation(data: MusicPromptData, genres: string[]): string {
  const rhythmElements: string[] = [];
  
  if (data.beat.length > 0) {
    const beatText = data.beat.length === 1 
      ? `${data.beat[0]} rhythm` 
      : `${data.beat.slice(0, -1).join(', ')} and ${data.beat[data.beat.length - 1]} rhythmic elements`;
    rhythmElements.push(`Build the rhythmic foundation on ${beatText}`);
  }
  
  if (data.bass.length > 0) {
    const bassText = data.bass.length === 1 
      ? `${data.bass[0]} bass` 
      : `${data.bass.slice(0, -1).join(', ')} and ${data.bass[data.bass.length - 1]} bass characteristics`;
    rhythmElements.push(`featuring ${bassText} that provides both harmonic support and rhythmic drive`);
  }
  
  if (data.groove_swing) {
    const grooveDescriptions = {
      'straight': 'precise, quantized timing that emphasizes clarity and power',
      'light swing': 'subtle rhythmic displacement that adds organic feel without losing the pocket',
      'heavy swing': 'pronounced swing that creates compelling rhythmic tension and release',
      'shuffle': 'triplet-based groove that adds sophisticated rhythmic complexity'
    };
    
    rhythmElements.push(`incorporating ${grooveDescriptions[data.groove_swing] || data.groove_swing + ' groove'}`);
  }
  
  if (rhythmElements.length === 0) return '';
  
  return rhythmElements.join(', ') + '. The rhythmic section should lock together seamlessly, creating an irresistible foundation that supports the entire arrangement.';
}

function createVocalDirection(data: MusicPromptData): string {
  if (!data.vocal_gender || data.vocal_gender === 'none') return '';
  
  let vocalDirection = '';
  
  const genderDescriptions = {
    'male': 'male vocals with rich, resonant tone',
    'female': 'female vocals with expressive, dynamic range',
    'male+female': 'male and female vocals in compelling harmony and counterpoint',
    'androgynous': 'androgynous vocals that transcend traditional gender boundaries'
  };
  
  vocalDirection = `Feature ${genderDescriptions[data.vocal_gender] || data.vocal_gender + ' vocals'}`;
  
  if (data.vocal_delivery) {
    const deliveryDescriptions = {
      'singing': 'with melodic, expressive singing that serves the song\'s emotional core',
      'spoken word': 'delivered as rhythmic spoken word that adds narrative depth',
      'whispered': 'using intimate whispered delivery that creates atmospheric tension',
      'acapella': 'in pure acapella style, showcasing vocal harmony and rhythm',
      'rap': 'with skillful rap delivery that complements the instrumental arrangement',
      'chant': 'using hypnotic chant-style delivery that builds ritualistic energy',
      'vocoder': 'processed through vocoder for futuristic, robotic character',
      'robotic': 'with heavily processed, robotic treatment that serves the track\'s aesthetic'
    };
    
    vocalDirection += ` ${deliveryDescriptions[data.vocal_delivery] || 'with ' + data.vocal_delivery + ' delivery'}`;
  }
  
  vocalDirection += '. The vocal performance should integrate seamlessly with the instrumental arrangement, enhancing rather than competing with the musical elements.';
  
  return vocalDirection;
}

function createProductionNotes(data: MusicPromptData, genres: string[]): string {
  const productionElements: string[] = [];
  
  // Length-specific arrangement notes
  if (data.length.trim()) {
    const lengthText = data.length.trim().toLowerCase();
    if (lengthText.includes('radio') || lengthText.includes('edit')) {
      productionElements.push('Structure as a radio-friendly arrangement with clear intro, verse, chorus, and outro sections');
    } else if (lengthText.includes('club') || lengthText.includes('extended')) {
      productionElements.push('Arrange for club play with extended intro/outro sections and strategic breakdown moments');
    } else if (lengthText.includes('loop')) {
      productionElements.push('Design as a seamless loop with careful attention to beginning/end transitions');
    } else {
      productionElements.push(`Structure the arrangement for ${data.length} duration`);
    }
  }
  
  // Master notes integration
  if (data.master_notes.trim()) {
    productionElements.push(`Master with ${data.master_notes.trim()}, ensuring the final mix translates well across all playback systems`);
  }
  
  // Genre-specific production advice
  if (genres.length > 0) {
    const primaryGenre = genres[0].toLowerCase();
    if (primaryGenre.includes('house')) {
      productionElements.push('Pay special attention to the kick-bass relationship and sidechain compression for that signature house groove');
    } else if (primaryGenre.includes('techno')) {
      productionElements.push('Focus on precise sound design and spatial arrangement to create the characteristic techno atmosphere');
    } else if (primaryGenre.includes('drum') || primaryGenre.includes('bass')) {
      productionElements.push('Emphasize the drum programming and bass design as the primary driving forces');
    }
  }
  
  if (productionElements.length === 0) return '';
  
  return productionElements.join('. ') + '.';
}

function createProfessionalClosing(data: MusicPromptData, genres: string[]): string {
  const hasSpecificElements = data.subject.trim() || data.mood.length > 0 || genres.length > 0;
  
  if (hasSpecificElements) {
    return 'Ensure every element serves the artistic vision while maintaining professional production standards and commercial viability. The final result should be a cohesive, impactful piece that stands out in today\'s competitive music landscape.';
  } else {
    return 'Focus on creating a professionally produced, engaging composition that demonstrates strong musical craftsmanship and attention to detail.';
  }
}