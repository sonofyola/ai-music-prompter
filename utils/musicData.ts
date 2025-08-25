export const musicData = {
  genres: [
    // Electronic/EDM Genres
    'House', 'Deep House', 'Tech House', 'Progressive House', 'Electro House', 'Future House',
    'Minimal House', 'Acid House', 'Chicago House', 'French House', 'Tribal House',
    'Techno', 'Minimal Techno', 'Deep Tech', 'Hard Techno', 'Industrial Techno', 'Detroit Techno',
    'Berlin Techno', 'Acid Techno', 'Progressive Techno',
    'Trance', 'Progressive Trance', 'Uplifting Trance', 'Psytrance', 'Tech Trance', 'Vocal Trance',
    'Ambient Trance', 'Hard Trance',
    'Drum & Bass', 'Liquid DnB', 'Neurofunk', 'Jump Up', 'Jungle', 'Breakbeat', 'UK Garage',
    'Dubstep', 'Future Bass', 'Trap', 'Hardstyle', 'Hardcore', 'Gabber',
    'Ambient', 'Downtempo', 'Chillout', 'Lounge', 'Trip Hop', 'IDM', 'Glitch',
    'Synthwave', 'Retrowave', 'Vaporwave', 'Darkwave', 'Cyberpunk',
    'Bass Music', 'UK Bass', 'Future Garage', 'Footwork', 'Juke',
    
    // Traditional Genres
    'Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Country', 'R&B', 'Folk', 'Blues',
    'Reggae', 'Punk', 'Metal', 'Indie', 'Alternative', 'Funk', 'Soul', 'Gospel', 'Latin', 'World'
  ],
  
  moods: [
    'Happy', 'Sad', 'Energetic', 'Calm', 'Romantic', 'Melancholic', 'Uplifting', 'Dark', 'Mysterious',
    'Nostalgic', 'Aggressive', 'Peaceful', 'Dramatic', 'Playful', 'Intense', 'Dreamy', 'Confident'
  ],
  
  tempos: [
    'Very Slow (60-70 BPM)', 'Slow (70-90 BPM)', 'Moderate (90-120 BPM)', 
    'Fast (120-140 BPM)', 'Very Fast (140+ BPM)'
  ],
  
  trackLengths: [
    'Short (30-60 seconds)', 'Medium (1-2 minutes)', 'Standard (2-4 minutes)', 
    'Long (4-6 minutes)', 'Extended (6+ minutes)', 'Loop (seamless)'
  ],
  
  weirdnessLevels: [
    'Very Normal', 'Slightly Unusual', 'Moderately Weird', 'Very Weird', 'Extremely Experimental',
    'Avant-garde', 'Completely Abstract'
  ],
  
  instruments: [
    'Piano', 'Guitar', 'Bass', 'Drums', 'Violin', 'Saxophone', 'Trumpet', 'Flute', 'Synthesizer',
    'Organ', 'Harmonica', 'Cello', 'Clarinet', 'Trombone', 'Harp', 'Banjo', 'Mandolin', 'Accordion'
  ],
  
  vocals: [
    'Male Lead', 'Female Lead', 'Choir', 'Harmony', 'Rap', 'Spoken Word', 'Instrumental Only',
    'Duet', 'Background Vocals', 'Auto-tuned', 'Operatic', 'Whispered', 'Acapella'
  ],
  
  bassStyles: [
    'Deep', 'Heavy', 'Sub', 'Punchy', 'Warm', 'Tight', 'Boomy', 'Distorted', 'Clean', 'Funky', 
    'Synth Bass', 'Acoustic Bass', 'Electric Bass', 'Upright Bass', '808', 'Reese', 'Wobble'
  ],
  
  tones: [
    'Warm', 'Bright', 'Dark', 'Cold', 'Rich', 'Thin', 'Full', 'Hollow', 'Crisp', 'Smooth',
    'Rough', 'Clean', 'Dirty', 'Vintage', 'Modern'
  ],
  
  structures: [
    'Verse-Chorus-Verse-Chorus-Bridge-Chorus', 'AABA', 'Verse-Chorus', 'Intro-Verse-Chorus-Outro',
    'Free Form', 'Call and Response', 'Theme and Variations'
  ],
  
  themes: [
    'Love', 'Heartbreak', 'Adventure', 'Nature', 'City Life', 'Dreams', 'Freedom', 'Nostalgia',
    'Hope', 'Struggle', 'Victory', 'Peace', 'Rebellion', 'Journey', 'Home', 'Time', 'Memory'
  ],
  
  styles: [
    'Acoustic', 'Electric', 'Orchestral', 'Minimalist', 'Experimental', 'Traditional', 'Modern',
    'Vintage', 'Ambient', 'Cinematic', 'Dance', 'Ballad'
  ],
  
  energyLevels: [
    'Very Low', 'Low', 'Medium', 'High', 'Very High'
  ],
  
  productionStyles: [
    'Studio Quality', 'Live Recording', 'Lo-Fi', 'Hi-Fi', 'Compressed', 'Dynamic', 'Reverb Heavy',
    'Dry', 'Layered', 'Stripped Down', 'Polished', 'Raw'
  ]
};

export const musicParameters = [
  { key: 'genre', label: 'Genre', options: musicData.genres },
  { key: 'mood', label: 'Mood', options: musicData.moods },
  { key: 'tempo', label: 'Tempo', options: musicData.tempos },
  { key: 'trackLength', label: 'Track Length', options: musicData.trackLengths },
  { key: 'weirdness', label: 'Weirdness', options: musicData.weirdnessLevels },
  { key: 'instruments', label: 'Instruments', options: musicData.instruments, multiSelect: true },
  { key: 'vocals', label: 'Vocals', options: musicData.vocals },
  { key: 'bass', label: 'Bass Style', options: musicData.bassStyles },
  { key: 'tone', label: 'Tone', options: musicData.tones },
  { key: 'structure', label: 'Structure', options: musicData.structures },
  { key: 'theme', label: 'Theme', options: musicData.themes },
  { key: 'style', label: 'Style', options: musicData.styles },
  { key: 'energy', label: 'Energy', options: musicData.energyLevels },
  { key: 'production', label: 'Production', options: musicData.productionStyles }
];
