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

const themes = [
  'love and romance', 'adventure and exploration', 'nostalgia and memories', 'freedom and rebellion',
  'city nightlife', 'nature and wilderness', 'dreams and aspirations', 'overcoming challenges',
  'friendship and unity', 'mystery and intrigue', 'celebration and joy', 'solitude and reflection',
  'technology and future', 'childhood innocence', 'spiritual journey', 'dance and movement',
  'heartbreak and loss', 'hope and renewal', 'party and fun', 'meditation and peace'
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
    theme: getRandomItem(themes),
    style: getRandomItem(musicData.styles),
    energy: getRandomItem(musicData.energyLevels),
    production: getRandomItem(musicData.productionStyles),
  };
}
