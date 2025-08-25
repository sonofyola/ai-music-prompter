import { musicData } from './musicData';

export interface RandomTrackData {
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
}

const realLifeSubjects = [
  // Love & Relationships
  'I love her, but I\'m scared to let her know',
  'He ghosted me, but I\'m better off without him',
  'Long distance love is worth the wait',
  'My ex became my best friend',
  'Dating apps are ruining romance',
  'I found love in the grocery store',
  'She said yes and I can\'t stop smiling',
  'Breaking up was the best thing we ever did',
  'I\'m learning to love myself first',
  'My grandparents\' 60-year love story',
  
  // Self-Love & Personal Growth
  'The benefits of loving myself',
  'Rejection was my protection',
  'I\'m not broken, I\'m becoming',
  'My scars tell a beautiful story',
  'I choose progress over perfection',
  'Therapy changed my life',
  'I\'m proud of how far I\'ve come',
  'My anxiety doesn\'t define me',
  'I\'m enough, just as I am',
  'Learning to say no without guilt',
  
  // Funny & Quirky
  'I live to twerk',
  'My cat judges my life choices',
  'I put hot sauce on everything',
  'Dancing in my underwear at 3am',
  'I talk to my plants and they listen',
  'My mom was right about everything',
  'I\'m addicted to true crime podcasts',
  'I cry at dog videos on the internet',
  'My cooking could end world hunger (badly)',
  'I have 47 unfinished projects',
  
  // Social & Humanity
  'The benefits of being generous',
  'I have no problem with Adam and Steve',
  'Kindness is my superpower',
  'We\'re all just walking each other home',
  'Different doesn\'t mean wrong',
  'Love wins every single time',
  'Building bridges, not walls',
  'Your struggle is valid too',
  'We rise by lifting others',
  'Empathy is the answer',
  
  // Festive & Celebrations
  'Christmas morning magic never gets old',
  'New Year, same me, better vibes',
  'Birthday cake for breakfast',
  'Halloween is my personality',
  'Thanksgiving with chosen family',
  'Fourth of July fireworks in my heart',
  'Valentine\'s Day single and thriving',
  'Easter egg hunts at thirty-five',
  'Graduation day tears of joy',
  'Wedding bells and happy tears',
  
  // Life Struggles & Triumphs
  'Paying bills with pocket change',
  'My student loans have student loans',
  'Working three jobs to chase my dreams',
  'I survived my twenties',
  'Adulting is harder than they said',
  'My mental health journey',
  'Coming out to my family',
  'Losing weight for me, not them',
  'Quitting the job that killed my soul',
  'Moving back in with my parents',
  
  // Dreams & Aspirations
  'Chasing dreams on minimum wage',
  'My vision board is coming true',
  'From small town to big city',
  'Starting over at forty',
  'My side hustle became my main thing',
  'Learning to fly after being grounded',
  'Building an empire from my bedroom',
  'My comeback story is still being written',
  'Dreams don\'t have expiration dates',
  'I\'m writing my own fairy tale',
  
  // Friendship & Community
  'My friends are my chosen family',
  'Group chat therapy sessions',
  'Friends who stay through the mess',
  'Making friends as an adult is hard',
  'My ride or die since kindergarten',
  'Found my tribe in unexpected places',
  'Friends who celebrate your wins',
  'The friend who always brings snacks',
  'Long distance friendships that last',
  'My friend saved my life',
  
  // Everyday Moments
  'Coffee is my love language',
  'Sundays are for self-care',
  'Road trips with no destination',
  'Dancing in the kitchen while cooking',
  'Rainy days and cozy blankets',
  'The magic of golden hour',
  'Finding peace in morning routines',
  'Late night conversations that heal',
  'The smell of fresh laundry',
  'Laughing until my stomach hurts',
  
  // Inspirational & Motivational
  'I am the author of my story',
  'My setbacks are my comebacks',
  'Turning my pain into purpose',
  'I choose joy despite the chaos',
  'My voice matters and I\'ll use it',
  'Breaking generational cycles',
  'I\'m planting seeds for future me',
  'My journey is my message',
  'I\'m not lucky, I\'m blessed',
  'Every ending is a new beginning'
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateRandomTrack(): RandomTrackData {
  const instrumentCount = Math.floor(Math.random() * 4) + 1; // 1-4 instruments
  
  return {
    genre: getRandomItem(musicData.genres),
    mood: getRandomItem(musicData.moods),
    tempo: getRandomItem(musicData.tempos),
    trackLength: getRandomItem(musicData.trackLengths),
    weirdness: getRandomItem(musicData.weirdnessLevels),
    instruments: getRandomItems(musicData.instruments, instrumentCount),
    vocals: getRandomItem(musicData.vocals),
    bass: getRandomItem(musicData.bassStyles),
    tone: getRandomItem(musicData.tones),
    structure: getRandomItem(musicData.structures),
    theme: getRandomItem(realLifeSubjects),
    style: getRandomItem(musicData.styles),
    energy: getRandomItem(musicData.energyLevels),
    production: getRandomItem(musicData.productionStyles),
  };
}
