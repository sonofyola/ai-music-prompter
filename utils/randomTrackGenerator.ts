// Random track idea generator for creative inspiration
export interface TrackIdea {
  subject: string;
  description: string;
}

// Real-life situations and emotions people actually experience
const LOVE_SITUATIONS = [
  'I love you but I\'m scared to tell you',
  'You\'re dating my best friend but I had you first',
  'We broke up but you still text me at 2 AM',
  'I saw you with someone else at the coffee shop',
  'You left your hoodie here and it still smells like you',
  'We\'ve been friends for years but I want more',
  'You said you needed space but you\'re all over social media',
  'I wrote you a letter I\'ll never send',
  'We keep running into each other everywhere',
  'You\'re getting married but I still think about us'
];

const FUNNY_SITUATIONS = [
  'Why does this dog keep pooping in my yard',
  'My neighbor plays music way too loud at 6 AM',
  'I accidentally liked your ex\'s photo from 2019',
  'The WiFi is down and I don\'t know what to do with my hands',
  'I ordered food delivery to the wrong address again',
  'My mom keeps asking when I\'m getting married',
  'I pretended to know this song but I have no idea what it is',
  'I\'ve been wearing the same shirt for three days',
  'My phone died right when things got interesting',
  'I waved back at someone who wasn\'t waving at me'
];

const WORK_LIFE_SITUATIONS = [
  'My boss thinks I\'m working but I\'m online shopping',
  'I have 47 unread emails and I\'m pretending they don\'t exist',
  'It\'s Monday morning and I already need a vacation',
  'I said I\'d have this done by Friday... it\'s Friday',
  'My coworker microwaved fish in the break room again',
  'I\'m in a meeting that could have been an email',
  'I accidentally replied all to the entire company',
  'I\'ve been on hold with customer service for an hour',
  'My computer crashed and I lost everything',
  'I quit my job in my head but I\'m still here'
];

const FAMILY_SITUATIONS = [
  'My mom still cuts my food and I\'m 25',
  'Family dinner turned into a political debate again',
  'My dad is trying to be cool on social media',
  'My sister borrowed my clothes without asking... again',
  'Grandma doesn\'t understand why I\'m still single',
  'My parents are cooler than me and it\'s embarrassing',
  'I moved back in with my parents and I\'m not okay',
  'My little brother is taller than me now',
  'Mom found my old diary and won\'t stop laughing',
  'Dad jokes are getting out of control'
];

const SOCIAL_SITUATIONS = [
  'Oh no, she didn\'t come in here looking like that',
  'I saw you at the store but pretended I didn\'t',
  'You read my message but didn\'t reply for 6 hours',
  'I\'m the only one who showed up to this party',
  'My ex is dating someone who looks exactly like me',
  'I accidentally sent a screenshot to the person I was talking about',
  'Everyone\'s getting engaged and I can\'t even get a text back',
  'I\'m too old for this club but here I am',
  'I said I was 5 minutes away but I haven\'t left yet',
  'I\'m pretending to be busy so I don\'t have to hang out'
];

const PERSONAL_STRUGGLES = [
  'I\'m 30 and I still don\'t know what I want to be when I grow up',
  'I bought a gym membership and haven\'t used it once',
  'I\'m addicted to my phone and I know it',
  'I eat cereal for dinner and call it self-care',
  'I have social anxiety but I\'m really funny online',
  'I\'m broke but I keep buying things I don\'t need',
  'I said I\'d start tomorrow but tomorrow never comes',
  'I\'m an adult but I still sleep with a stuffed animal',
  'I Google everything because I don\'t want to look stupid',
  'I\'m tired but I stay up scrolling until 3 AM'
];

const RANDOM_OBSERVATIONS = [
  'Why do I always pick the slowest line at the grocery store',
  'My car makes a weird noise but I just turn the music up louder',
  'I have 200 streaming services but nothing to watch',
  'I take 47 selfies to post one that looks natural',
  'My plants keep dying but I keep buying more',
  'I say I\'m a morning person but I hit snooze 5 times',
  'I have strong opinions about things that don\'t matter',
  'I\'m an expert at avoiding people I know in public',
  'I collect hobbies like Pokemon cards',
  'I\'m 99% sure my cat judges my life choices'
];

// All situations combined
const ALL_SITUATIONS = [
  ...LOVE_SITUATIONS,
  ...FUNNY_SITUATIONS,
  ...WORK_LIFE_SITUATIONS,
  ...FAMILY_SITUATIONS,
  ...SOCIAL_SITUATIONS,
  ...PERSONAL_STRUGGLES,
  ...RANDOM_OBSERVATIONS
];

// Emotional contexts that match these real situations
const REAL_EMOTIONS = [
  'awkward but relatable', 'bittersweet nostalgia', 'frustrated but funny', 'hopeful anxiety',
  'embarrassed but laughing', 'tired but determined', 'confused but curious', 'lonely but independent',
  'overwhelmed but grateful', 'scared but excited', 'annoyed but amused', 'heartbroken but healing',
  'stressed but surviving', 'disappointed but optimistic', 'jealous but supportive', 'angry but understanding'
];

const REAL_SETTINGS = [
  'your bedroom at 3 AM', 'the grocery store checkout line', 'your car in traffic',
  'the office break room', 'your childhood bedroom', 'a crowded coffee shop',
  'the gym you never go to', 'your couch on Sunday', 'the bathroom mirror',
  'your kitchen at midnight', 'the parking lot after work', 'your friend\'s wedding',
  'the DMV waiting area', 'your therapist\'s office', 'the laundromat',
  'your high school reunion', 'the airport security line', 'your ex\'s Instagram'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomTrackIdea(): TrackIdea {
  // Get random elements first
  const situation = getRandomElement(ALL_SITUATIONS);
  const emotion = getRandomElement(REAL_EMOTIONS);
  const setting = getRandomElement(REAL_SETTINGS);
  
  // Choose a random template approach
  const templateChoice = Math.floor(Math.random() * 4);
  
  switch (templateChoice) {
    case 0:
      // Direct situation
      return {
        subject: situation,
        description: `A song about the very real and relatable experience of: ${situation}`
      };
    
    case 1:
      // Situation + emotion
      return {
        subject: situation,
        description: `Capturing the ${emotion} feeling of ${situation.toLowerCase()}`
      };
    
    case 2:
      // Situation + setting
      return {
        subject: `${situation} in ${setting}`,
        description: `The story of ${situation.toLowerCase()} while you're in ${setting}`
      };
    
    case 3:
    default:
      // Emotional take on situation
      return {
        subject: `${situation} (and it's ${emotion})`,
        description: `A ${emotion} anthem about ${situation.toLowerCase()}`
      };
  }
}

// Generate multiple ideas for variety
export function generateMultipleTrackIdeas(count: number = 5): TrackIdea[] {
  const ideas: TrackIdea[] = [];
  const usedSubjects = new Set<string>();
  
  let attempts = 0;
  while (ideas.length < count && attempts < count * 3) {
    const idea = generateRandomTrackIdea();
    if (!usedSubjects.has(idea.subject)) {
      ideas.push(idea);
      usedSubjects.add(idea.subject);
    }
    attempts++;
  }
  
  return ideas;
}

// Rest of the existing code for complete track generation remains the same...
const GENRES_PRIMARY = [
  ['Electronic'], ['Hip Hop'], ['Pop'], ['Rock'], ['Jazz'], ['Classical'], 
  ['Ambient'], ['Folk'], ['R&B'], ['Country'], ['Reggae'], ['Latin'],
  ['Electronic', 'Pop'], ['Hip Hop', 'R&B'], ['Rock', 'Electronic'], 
  ['Jazz', 'Electronic'], ['Pop', 'Rock'], ['Ambient', 'Electronic']
];

const ELECTRONIC_SUBGENRES = [
  ['House'], ['Techno'], ['Trance'], ['Dubstep'], ['Drum & Bass'], ['Synthwave'],
  ['Chillout'], ['Progressive House'], ['Deep House'], ['Tech House'], ['Ambient Techno'],
  ['IDM'], ['Glitch'], ['Downtempo'], ['Trip Hop'], ['Breakbeat']
];

const MOODS = [
  ['Energetic'], ['Calm'], ['Dark'], ['Uplifting'], ['Melancholic'], ['Aggressive'],
  ['Peaceful'], ['Mysterious'], ['Euphoric'], ['Nostalgic'], ['Romantic'], ['Epic'],
  ['Energetic', 'Uplifting'], ['Dark', 'Mysterious'], ['Calm', 'Peaceful'],
  ['Melancholic', 'Nostalgic'], ['Aggressive', 'Energetic']
];

const TEMPOS = [
  '60-70', '70-80', '80-90', '90-100', '100-110', '110-120', 
  '120-130', '130-140', '140-150', '150-160', '160-170', '170-180'
];

const ENERGY_LEVELS = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

const KEYS = [
  'C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'F Major',
  'A Minor', 'E Minor', 'B Minor', 'D Minor', 'G Minor', 'C Minor'
];

const BEATS = [
  ['Four-on-the-floor'], ['Breakbeat'], ['Swing'], ['Laid-back'], ['Driving'],
  ['Syncopated'], ['Minimal'], ['Complex'], ['Groove'], ['Punchy'],
  ['Atmospheric'], ['Industrial'], ['Tribal'], ['Latin'], ['Shuffle']
];

const BASS_STYLES = [
  ['Deep'], ['Punchy'], ['Warm'], ['Heavy'], ['Subtle'], ['Driving'],
  ['Melodic'], ['Rhythmic'], ['Distorted'], ['Clean'], ['Synthetic'], ['Organic']
];

const VOCAL_STYLES = [
  'Powerful', 'Soft', 'Raspy', 'Smooth', 'Ethereal', 'Aggressive',
  'Whispered', 'Soulful', 'Robotic', 'Emotional', 'Anthemic', 'Intimate'
];

const VOCAL_GENDERS = ['Male', 'Female', 'Non-binary'];

const WEIRDNESS_LEVELS = ['Normal', 'Slightly Weird', 'Weird', 'Very Weird'];

const LENGTHS = [
  '2:30 short', '3:00 standard', '3:30 radio edit', '4:00 extended',
  '4:30 album version', '5:00 club mix', '6:00 extended mix', '8:00 journey'
];

const ERAS = [
  '60s vintage', '70s funk', '80s synth', '90s grunge', '2000s pop',
  '2010s EDM', 'modern 2024', 'futuristic 2030', 'retro-futuristic',
  'timeless classic', 'neo-vintage', 'contemporary'
];

// Generate complete random track configuration
export function generateRandomTrackConfiguration(subject?: string): any {
  const primaryGenres = getRandomElement(GENRES_PRIMARY);
  const hasElectronic = primaryGenres.includes('Electronic');
  
  const config: any = {
    subject: subject || generateRandomTrackIdea().subject,
    genres_primary: primaryGenres,
    mood: getRandomElement(MOODS),
    tempo_bpm: getRandomElement(TEMPOS),
    energy: getRandomElement(ENERGY_LEVELS),
    beat: getRandomElement(BEATS),
    bass: getRandomElement(BASS_STYLES),
    weirdness_level: getRandomElement(WEIRDNESS_LEVELS),
  };

  // Add electronic subgenres if Electronic is selected
  if (hasElectronic && Math.random() > 0.3) {
    config.genres_electronic = getRandomElement(ELECTRONIC_SUBGENRES);
  }

  // Randomly add optional fields
  if (Math.random() > 0.4) {
    config.key_scale = getRandomElement(KEYS);
  }

  if (Math.random() > 0.5) {
    config.vocal_gender = getRandomElement(VOCAL_GENDERS);
    config.vocal_delivery = getRandomElement(VOCAL_STYLES);
  }

  if (Math.random() > 0.6) {
    config.length = getRandomElement(LENGTHS);
  }

  if (Math.random() > 0.7) {
    config.era = getRandomElement(ERAS);
  }

  // Add some genre-specific fields
  if (primaryGenres.includes('Hip Hop') && Math.random() > 0.5) {
    config.groove_swing = Math.random() > 0.5 ? 'Swing' : 'Straight';
  }

  if (primaryGenres.includes('Rock') && Math.random() > 0.6) {
    config.guitar_style = getRandomElement(['Clean', 'Distorted', 'Overdriven', 'Acoustic']);
  }

  return config;
}
