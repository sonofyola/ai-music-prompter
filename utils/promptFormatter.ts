import { MusicPromptData } from '../types';

export function formatMusicPrompt(data: MusicPromptData): string {
  const sections: string[] = [];

  // Opening statement with genre and theme
  const openingParts: string[] = [];
  const allGenres = [...data.genres_primary, ...data.genres_electronic].filter(Boolean);
  
  if (allGenres.length > 0 && data.subject.trim()) {
    openingParts.push(`Create a ${allGenres.join(' and ')} track about ${data.subject.trim()}`);
  } else if (allGenres.length > 0) {
    openingParts.push(`Create a ${allGenres.join(' and ')} track`);
  } else if (data.subject.trim()) {
    openingParts.push(`Create a music track about ${data.subject.trim()}`);
  } else {
    openingParts.push('Create a music track');
  }

  if (openingParts.length > 0) {
    sections.push(openingParts.join('. ') + '.');
  }

  // Mood and emotional direction
  if (data.mood.length > 0) {
    const moodText = data.mood.length === 1 
      ? `The overall mood should be ${data.mood[0]}`
      : `The track should blend ${data.mood.slice(0, -1).join(', ')} and ${data.mood[data.mood.length - 1]} moods`;
    sections.push(`${moodText}, creating an emotional atmosphere that draws listeners in.`);
  }

  // Technical specifications
  const techSpecs: string[] = [];
  if (data.tempo_bpm.trim()) {
    techSpecs.push(`Set the tempo at ${data.tempo_bpm} BPM`);
  }
  if (data.key_scale.trim()) {
    techSpecs.push(`compose it in ${data.key_scale}`);
  }
  if (data.energy) {
    techSpecs.push(`maintain ${data.energy} energy levels throughout`);
  }
  
  if (techSpecs.length > 0) {
    sections.push(`${techSpecs.join(', ')}.`);
  }

  // Rhythm and bass foundation
  const rhythmParts: string[] = [];
  if (data.beat.length > 0) {
    rhythmParts.push(`The beat should feature ${data.beat.join(' and ')}`);
  }
  if (data.bass.length > 0) {
    rhythmParts.push(`with ${data.bass.join(' and ')} bass`);
  }
  if (data.groove_swing) {
    rhythmParts.push(`incorporating ${data.groove_swing} groove elements`);
  }
  
  if (rhythmParts.length > 0) {
    sections.push(`${rhythmParts.join(' ')}, providing a solid rhythmic foundation that makes people want to move.`);
  }

  // Vocal specifications
  if (data.vocal_gender && data.vocal_gender !== 'none') {
    let vocalDescription = `Include ${data.vocal_gender} vocals`;
    if (data.vocal_delivery) {
      vocalDescription += ` with ${data.vocal_delivery} delivery`;
    }
    sections.push(`${vocalDescription}, ensuring the vocal performance complements and enhances the instrumental arrangement.`);
  }

  // Era and stylistic context
  if (data.era.trim()) {
    sections.push(`The track should evoke the ${data.era} era, incorporating period-appropriate production techniques and aesthetic choices.`);
  }

  // Master specifications
  if (data.master_notes.trim()) {
    sections.push(`For mastering: ${data.master_notes}, ensuring professional audio quality that translates well across all playback systems.`);
  }

  // Length and format
  if (data.length.trim()) {
    sections.push(`The final track should be ${data.length}, optimized for its intended use and audience.`);
  }

  // Additional creative direction
  if (data.general_freeform.trim()) {
    sections.push(`Additional creative direction: ${data.general_freeform}`);
  }

  // Closing statement
  if (sections.length > 0) {
    sections.push('Focus on creating a cohesive, professional-sounding track that achieves the artistic vision while maintaining commercial appeal and technical excellence.');
  }

  return sections.filter(Boolean).join(' ');
}
