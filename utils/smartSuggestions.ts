import { MusicPromptData } from '../types';

// BPM suggestions based on genre
export function getBPMSuggestions(genres: string[]): string[] {
  const suggestions: string[] = [];
  
  for (const genre of genres) {
    switch (genre.toLowerCase()) {
      case 'house':
      case 'deep house':
        suggestions.push('122', '124', '126', '128');
        break;
      case 'tech house':
      case 'techno':
        suggestions.push('128', '130', '132');
        break;
      case 'trance':
        suggestions.push('132', '134', '136', '138');
        break;
      case 'drum & bass':
      case 'liquid dnb':
        suggestions.push('174', '176', '178');
        break;
      case 'dubstep':
        suggestions.push('140', '142', '144');
        break;
      case 'hip hop':
        suggestions.push('85', '90', '95', '100');
        break;
      case 'trap':
        suggestions.push('140', '150', '160');
        break;
      case 'ambient':
        suggestions.push('60', '70', '80');
        break;
    }
  }
  
  // Remove duplicates and return top 3
  return [...new Set(suggestions)].slice(0, 3);
}

// Key suggestions based on mood
export function getKeySuggestions(moods: string[]): string[] {
  const suggestions: string[] = [];
  
  for (const mood of moods) {
    switch (mood.toLowerCase()) {
      case 'melancholic':
      case 'dark':
        suggestions.push('D minor', 'A minor', 'F minor');
        break;
      case 'uplifting':
      case 'euphoric':
        suggestions.push('C major', 'G major', 'D major');
        break;
      case 'dreamy':
      case 'peaceful':
        suggestions.push('F major', 'Bb major', 'C major');
        break;
      case 'mysterious':
        suggestions.push('F# minor', 'C# minor', 'G# minor');
        break;
      case 'energetic':
      case 'intense':
        suggestions.push('E major', 'B major', 'A major');
        break;
    }
  }
  
  return [...new Set(suggestions)].slice(0, 3);
}

// Beat suggestions based on genre
export function getBeatSuggestions(genres: string[]): string[] {
  const suggestions: string[] = [];
  
  for (const genre of genres) {
    switch (genre.toLowerCase()) {
      case 'house':
      case 'deep house':
      case 'tech house':
        suggestions.push('four-on-the-floor', 'off-beat hi-hats', 'minimal percussion');
        break;
      case 'techno':
        suggestions.push('four-on-the-floor', 'rolling hi-hats', 'minimal percussion');
        break;
      case 'drum & bass':
        suggestions.push('amen break', 'rolling DnB', 'half-time');
        break;
      case 'trap':
        suggestions.push('trap hi-hats', '808 rolls', 'half-time');
        break;
      case 'hip hop':
        suggestions.push('boom-bap', 'trap hi-hats', 'shuffle');
        break;
      case 'breakbeat':
        suggestions.push('amen break', 'think break', 'broken beat');
        break;
    }
  }
  
  return [...new Set(suggestions)].slice(0, 3);
}

// Bass suggestions based on genre
export function getBassSuggestions(genres: string[]): string[] {
  const suggestions: string[] = [];
  
  for (const genre of genres) {
    switch (genre.toLowerCase()) {
      case 'house':
      case 'deep house':
        suggestions.push('warm analog', 'punchy', 'side-chained');
        break;
      case 'tech house':
      case 'techno':
        suggestions.push('tight', 'punchy', 'compressed');
        break;
      case 'drum & bass':
        suggestions.push('deep sub', 'wobbly', 'distorted');
        break;
      case 'dubstep':
        suggestions.push('wobbly', 'distorted', 'deep sub');
        break;
      case 'trap':
      case 'hip hop':
        suggestions.push('deep sub', 'punchy', '808 rolls');
        break;
      case 'ambient':
        suggestions.push('warm analog', 'creamy sub', 'evolving');
        break;
    }
  }
  
  return [...new Set(suggestions)].slice(0, 3);
}

// Era suggestions based on genre
export function getEraSuggestions(genres: string[]): string[] {
  const suggestions: string[] = [];
  
  for (const genre of genres) {
    switch (genre.toLowerCase()) {
      case 'house':
        suggestions.push('1985 Chicago house', '1990s deep house', '2000s French house');
        break;
      case 'techno':
        suggestions.push('1988 Detroit techno', '1990s Berlin techno', '2000s minimal techno');
        break;
      case 'trance':
        suggestions.push('1990s rave', '2000s uplifting trance', '2010s progressive trance');
        break;
      case 'drum & bass':
        suggestions.push('1993 warehouse', '1990s jungle', '2000s liquid DnB');
        break;
      case 'dubstep':
        suggestions.push('2005 South London', '2010s brostep', '2020s melodic dubstep');
        break;
    }
  }
  
  return [...new Set(suggestions)].slice(0, 3);
}

// Get all smart suggestions for current form state
export function getSmartSuggestions(formData: MusicPromptData) {
  const allGenres = [...formData.genres_primary, ...formData.genres_electronic];
  
  return {
    bpm: getBPMSuggestions(allGenres),
    keys: getKeySuggestions(formData.mood),
    beats: getBeatSuggestions(allGenres),
    bass: getBassSuggestions(allGenres),
    era: getEraSuggestions(allGenres),
  };
}