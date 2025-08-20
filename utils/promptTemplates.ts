
import { PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // Workout & Energy
  {
    id: 'workout-banger',
    name: 'Workout Banger',
    description: 'High-energy track perfect for gym sessions and cardio',
    category: 'Fitness',
    icon: 'fitness-center',
    formData: {
      subject: 'intense workout motivation',
      genres_primary: ['Electronic', 'Hip Hop'],
      mood: ['Energetic', 'Aggressive'],
      tempo_bpm: '128-140',
      energy: 'Very High',
      beat: ['Four-on-the-floor', 'Punchy'],
      bass: ['Heavy', 'Driving'],
      vocal_delivery: 'Aggressive',
      weirdness_level: 'Normal',
      length: '3:30 radio edit'
    }
  },
  {
    id: 'cardio-pump',
    name: 'Cardio Pump',
    description: 'Fast-paced electronic track for running and cardio',
    category: 'Fitness',
    icon: 'directions-run',
    formData: {
      subject: 'running through the city',
      genres_primary: ['Electronic'],
      genres_electronic: ['Progressive House', 'Trance'],
      mood: ['Uplifting', 'Energetic'],
      tempo_bpm: '132-138',
      energy: 'Very High',
      beat: ['Four-on-the-floor'],
      bass: ['Driving', 'Rhythmic'],
      weirdness_level: 'Normal'
    }
  },

  // Study & Focus
  {
    id: 'chill-study',
    name: 'Chill Study Music',
    description: 'Ambient, non-distracting background music for concentration',
    category: 'Study',
    icon: 'menu-book',
    formData: {
      subject: 'peaceful focus and concentration',
      genres_primary: ['Ambient', 'Electronic'],
      genres_electronic: ['Chillout', 'Downtempo'],
      mood: ['Calm', 'Peaceful'],
      tempo_bpm: '70-90',
      energy: 'Low',
      beat: ['Minimal', 'Soft'],
      bass: ['Subtle', 'Warm'],
      vocal_delivery: 'Ethereal',
      weirdness_level: 'Normal',
      length: '8:00 extended'
    }
  },
  {
    id: 'lo-fi-study',
    name: 'Lo-Fi Study Beats',
    description: 'Classic lo-fi hip hop for studying and relaxation',
    category: 'Study',
    icon: 'headphones',
    formData: {
      subject: 'late night studying with coffee',
      genres_primary: ['Hip Hop', 'Electronic'],
      mood: ['Nostalgic', 'Calm'],
      tempo_bpm: '80-95',
      energy: 'Low',
      beat: ['Laid-back', 'Swing'],
      bass: ['Warm', 'Subtle'],
      groove_swing: 'Swing',
      era: '90s lo-fi aesthetic',
      weirdness_level: 'Normal'
    }
  },

  // Dance & Party
  {
    id: 'dance-floor-banger',
    name: 'Dance Floor Banger',
    description: 'Peak-time club track guaranteed to fill the dance floor',
    category: 'Dance',
    icon: 'nightlife',
    formData: {
      subject: 'euphoric dance floor energy',
      genres_primary: ['Electronic'],
      genres_electronic: ['House', 'Tech House'],
      mood: ['Euphoric', 'Energetic'],
      tempo_bpm: '125-130',
      energy: 'Very High',
      beat: ['Four-on-the-floor', 'Driving'],
      bass: ['Heavy', 'Punchy'],
      vocal_delivery: 'Powerful',
      era: 'modern 2024 club sound',
      weirdness_level: 'Normal',
      length: '6:30 club mix'
    }
  },
  {
    id: 'festival-anthem',
    name: 'Festival Anthem',
    description: 'Massive crowd-pleasing track for festival main stages',
    category: 'Dance',
    icon: 'celebration',
    formData: {
      subject: 'festival crowd going wild',
      genres_primary: ['Electronic'],
      genres_electronic: ['Progressive House', 'Big Room'],
      mood: ['Euphoric', 'Uplifting'],
      tempo_bpm: '128-132',
      energy: 'Very High',
      beat: ['Four-on-the-floor', 'Anthemic'],
      bass: ['Massive', 'Driving'],
      vocal_delivery: 'Anthemic',
      weirdness_level: 'Normal',
      length: '5:00 festival edit'
    }
  },

  // Chill & Relaxation
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    description: 'Warm, relaxing track perfect for golden hour moments',
    category: 'Chill',
    icon: 'wb-sunny',
    formData: {
      subject: 'golden hour sunset by the ocean',
      genres_primary: ['Electronic', 'Ambient'],
      genres_electronic: ['Chillout', 'Downtempo'],
      mood: ['Peaceful', 'Nostalgic'],
      tempo_bpm: '95-110',
      key_scale: 'C Major',
      energy: 'Medium',
      beat: ['Laid-back', 'Soft'],
      bass: ['Warm', 'Subtle'],
      vocal_delivery: 'Ethereal',
      era: 'modern chillwave',
      weirdness_level: 'Normal'
    }
  },
  {
    id: 'rainy-day-mood',
    name: 'Rainy Day Mood',
    description: 'Contemplative track for introspective rainy afternoons',
    category: 'Chill',
    icon: 'grain',
    formData: {
      subject: 'contemplation on a rainy afternoon',
      genres_primary: ['Ambient', 'Electronic'],
      mood: ['Melancholic', 'Peaceful'],
      tempo_bpm: '70-85',
      key_scale: 'A Minor',
      energy: 'Low',
      beat: ['Minimal', 'Atmospheric'],
      bass: ['Deep', 'Subtle'],
      vocal_delivery: 'Whispered',
      weirdness_level: 'Normal'
    }
  },

  // Emotional & Cinematic
  {
    id: 'emotional-ballad',
    name: 'Emotional Ballad',
    description: 'Heart-wrenching ballad with powerful emotional impact',
    category: 'Emotional',
    icon: 'favorite',
    formData: {
      subject: 'lost love and heartbreak',
      genres_primary: ['Pop', 'Electronic'],
      mood: ['Melancholic', 'Emotional'],
      tempo_bpm: '65-80',
      key_scale: 'D Minor',
      energy: 'Medium',
      beat: ['Ballad', 'Emotional'],
      bass: ['Warm', 'Supporting'],
      vocal_gender: 'Female',
      vocal_delivery: 'Emotional',
      weirdness_level: 'Normal',
      length: '4:30 radio edit'
    }
  },
  {
    id: 'cinematic-epic',
    name: 'Cinematic Epic',
    description: 'Grand, orchestral-electronic hybrid for dramatic moments',
    category: 'Cinematic',
    icon: 'movie',
    formData: {
      subject: 'heroic journey and triumph',
      genres_primary: ['Cinematic', 'Electronic'],
      mood: ['Epic', 'Uplifting'],
      tempo_bpm: '120-140',
      energy: 'Very High',
      beat: ['Cinematic', 'Driving'],
      bass: ['Massive', 'Orchestral'],
      era: 'modern cinematic hybrid',
      weirdness_level: 'Normal',
      length: '3:00 trailer edit'
    }
  },

  // Gaming & Tech
  {
    id: 'cyberpunk-gaming',
    name: 'Cyberpunk Gaming',
    description: 'Futuristic electronic track perfect for sci-fi games',
    category: 'Gaming',
    icon: 'videogame-asset',
    formData: {
      subject: 'neon-lit cyberpunk cityscape',
      genres_primary: ['Electronic'],
      genres_electronic: ['Synthwave', 'Techno'],
      mood: ['Dark', 'Futuristic'],
      tempo_bpm: '130-140',
      energy: 'High',
      beat: ['Industrial', 'Driving'],
      bass: ['Synthetic', 'Heavy'],
      era: '2087 cyberpunk future',
      weirdness_level: 'Slightly Weird',
      length: '4:00 loop'
    }
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    description: '8-bit inspired chiptune with modern production',
    category: 'Gaming',
    icon: 'sports-esports',
    formData: {
      subject: 'nostalgic arcade gaming memories',
      genres_primary: ['Electronic'],
      genres_electronic: ['Chiptune', 'Synthwave'],
      mood: ['Nostalgic', 'Energetic'],
      tempo_bpm: '140-160',
      energy: 'High',
      beat: ['8-bit', 'Punchy'],
      bass: ['Synthetic', 'Retro'],
      era: '80s arcade aesthetic',
      weirdness_level: 'Normal'
    }
  },

  // Experimental & Creative
  {
    id: 'experimental-ambient',
    name: 'Experimental Ambient',
    description: 'Boundary-pushing ambient soundscape for creative minds',
    category: 'Experimental',
    icon: 'psychology',
    formData: {
      subject: 'exploring consciousness and reality',
      genres_primary: ['Ambient', 'Experimental'],
      mood: ['Mysterious', 'Contemplative'],
      tempo_bpm: '60-90',
      energy: 'Low',
      beat: ['Unconventional', 'Atmospheric'],
      bass: ['Experimental', 'Textural'],
      weirdness_level: 'Very Weird',
      length: '12:00 journey'
    }
  },
  {
    id: 'glitch-hop-fusion',
    name: 'Glitch Hop Fusion',
    description: 'Innovative blend of glitch electronics and hip hop rhythms',
    category: 'Experimental',
    icon: 'auto-fix-high',
    formData: {
      subject: 'digital glitches becoming music',
      genres_primary: ['Electronic', 'Hip Hop'],
      genres_electronic: ['Glitch', 'IDM'],
      mood: ['Quirky', 'Energetic'],
      tempo_bpm: '85-100',
      energy: 'Medium',
      beat: ['Glitchy', 'Syncopated'],
      bass: ['Glitchy', 'Punchy'],
      weirdness_level: 'Weird',
      era: 'modern experimental'
    }
  }
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'Fitness',
  'Study', 
  'Dance',
  'Chill',
  'Emotional',
  'Cinematic',
  'Gaming',
  'Experimental'
];
