export const PRIMARY_GENRES = [
  'House', 'Techno', 'Trance', 'Drum & Bass', 'Dubstep', 'Breaks', 'Electro', 
  'Downtempo', 'Hardcore', 'Ambient', 'Hip Hop', 'Pop', 'Rock', 'Jazz', 
  'Classical', 'Folk', 'R&B', 'Reggae', 'Country', 'Blues', 'Funk', 'Disco', 
  'Punk', 'Metal', 'Indie', 'Alternative'
];

export const ELECTRONIC_GENRES = [
  // House variants
  'Deep House', 'Tech House', 'Minimal Deep Tech', 'Progressive House', 'Electro House', 'Bass House', 
  'G-House', 'Chicago House', 'Detroit House', 'Melodic House', 'Organic House', 
  'Minimal House', 'Acid House', 'Funky House', 'Tribal House', 'Afro House',
  
  // Techno variants
  'Hard Techno', 'Peak-Time Techno', 'Minimal Techno', 'Dub Techno', 'Acid Techno', 
  'Industrial Techno', 'Schranz', 'Detroit Techno', 'Berlin Techno', 'Melodic Techno',
  
  // Trance variants
  'Progressive Trance', 'Psytrance', 'Full-On Psytrance', 'Forest Psytrance', 
  'Dark Psytrance', 'Uplifting Trance', 'Tech Trance', 'Vocal Trance', 'Goa Trance',
  
  // Drum & Bass variants
  'Liquid DnB', 'Neurofunk', 'Jungle', 'Rollers', 'Atmospheric DnB', 'Jump-Up', 
  'Darkstep', 'Techstep', 'Ragga Jungle', 'Intelligent DnB',
  
  // Breaks & UK variants
  'Breakbeat', 'Big Beat', 'UK Garage', '2-Step', 'Speed Garage', 'Bassline', 
  'UK Funky', 'Grime', 'Dubstep', 'Future Garage',
  
  // Dubstep variants
  'Classic Dubstep', 'Brostep', 'Riddim', 'Melodic Dubstep', 'Chillstep', 
  'Deathstep', 'Trapstep',
  
  // Bass music
  'Future Bass', 'EDM Trap', 'Wave', 'Jersey Club', 'Footwork', 'Juke', 
  'Bass Music', 'Halftime', 'Experimental Bass',
  
  // Electro variants
  'Electro', 'Electroclash', 'Synthwave', 'Darksynth', 'Retrowave', 'Outrun', 
  'Cyberpunk', 'New Wave', 'Italo Disco', 'Hi-NRG', 'Space Disco',
  
  // Downtempo & Chill
  'Trip-Hop', 'Chillout', 'Lounge', 'Ambient House', 'Dub', 'Chillwave', 
  'Vaporwave', 'Lo-Fi House', 'Balearic',
  
  // Hardcore & Hard Dance
  'Hardcore', 'Gabber', 'Happy Hardcore', 'Hardstyle', 'Rawstyle', 'Frenchcore',
  
  // Experimental & IDM
  'IDM', 'Glitch', 'Breakcore', 'Digital Hardcore', 'Drill & Bass', 'Ambient Techno',
  
  // Commercial & Festival
  'Big Room', 'Festival Progressive', 'Mainstage', 'Commercial House', 'Slap House'
];

export const MOODS = [
  'energetic', 'melancholic', 'uplifting', 'dark', 'dreamy', 'aggressive',
  'peaceful', 'nostalgic', 'mysterious', 'euphoric', 'intense', 'chill',
  'dramatic', 'playful', 'romantic', 'haunting', 'triumphant', 'introspective'
];

export const VOCAL_GENDERS = [
  { label: 'None', value: 'none' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Male + Female', value: 'male+female' },
  { label: 'Androgynous', value: 'androgynous' }
];

export const VOCAL_DELIVERIES = [
  { label: 'None', value: '' },
  { label: 'Singing', value: 'singing' },
  { label: 'Spoken Word', value: 'spoken word' },
  { label: 'Whispered', value: 'whispered' },
  { label: 'Acapella', value: 'acapella' },
  { label: 'Rap', value: 'rap' },
  { label: 'Chant', value: 'chant' },
  { label: 'Vocoder', value: 'vocoder' },
  { label: 'Robotic', value: 'robotic' }
];

export const ENERGY_LEVELS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Evolving', value: 'evolving' }
];

export const GROOVE_SWINGS = [
  { label: 'Straight', value: 'straight' },
  { label: 'Light Swing', value: 'light swing' },
  { label: 'Heavy Swing', value: 'heavy swing' },
  { label: 'Shuffle', value: 'shuffle' }
];

export const TIME_SIGNATURES = ['4/4', '3/4', '6/8', '7/8', '5/4', '2/4'];

export const COMMON_KEYS = [
  'C major', 'C minor', 'C# major', 'C# minor', 'D major', 'D minor',
  'D# major', 'D# minor', 'E major', 'E minor', 'F major', 'F minor',
  'F# major', 'F# minor', 'G major', 'G minor', 'G# major', 'G# minor',
  'A major', 'A minor', 'A# major', 'A# minor', 'B major', 'B minor'
];

export const BEAT_STYLES = [
  // House & Techno
  'four-on-the-floor', 'off-beat hi-hats', 'rolling hi-hats', 'minimal percussion',
  
  // Breakbeat & DnB
  'amen break', 'think break', 'rolling DnB', 'half-time', 'double-time',
  
  // Hip-Hop & Trap
  'trap hi-hats', '808 rolls', 'boom-bap', 'drill patterns', 'jersey club',
  
  // Electronic
  'broken beat', 'syncopated', 'polyrhythmic', 'shuffle', 'swing',
  
  // Experimental
  'odd time signatures', 'metric modulation', 'polymetric', 'irregular patterns'
];

export const BASS_CHARACTERISTICS = [
  // Analog & Vintage
  'warm analog', 'vintage Moog', 'rubbery 303', 'creamy sub', 'tube saturation',
  
  // Digital & Modern
  'crisp digital', 'FM synthesis', 'wavetable', 'granular', 'formant filtered',
  
  // Character & Texture
  'punchy', 'deep sub', 'mid-heavy', 'distorted', 'filtered sweep',
  'wobbly', 'tight', 'boomy', 'compressed', 'saturated',
  
  // Movement & Dynamics
  'side-chained', 'pumping', 'breathing', 'evolving', 'static'
];

export const WEIRDNESS_LEVELS = [
  { label: 'Conventional', value: 'conventional' },
  { label: 'Slightly Experimental', value: 'slightly_experimental' },
  { label: 'Moderately Weird', value: 'moderately_weird' },
  { label: 'Very Experimental', value: 'very_experimental' },
  { label: 'Completely Avant-garde', value: 'completely_avant_garde' }
];

export const ERA_SUGGESTIONS = [
  // Classic Electronic
  '1970s Kraftwerk', '1980s new wave', '1990s rave', '1993 warehouse',
  
  // House Evolution
  '1985 Chicago house', '1988 acid house', '1990s deep house', '2000s French house',
  
  // Techno Timeline
  '1988 Detroit techno', '1990s Berlin techno', '2000s minimal techno',
  
  // Modern Eras
  'Y2K bloghouse', '2010s EDM boom', '2020s future garage', 'modern 2025'
];
