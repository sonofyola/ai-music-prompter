import { MusicPromptData } from '../types';

export function formatMusicPrompt(data: MusicPromptData): string {
  const parts: string[] = [];

  // Genres
  const allGenres = [...data.genres_primary, ...data.genres_electronic].filter(Boolean);
  if (allGenres.length > 0) {
    parts.push(allGenres.join(', '));
  }

  // Subject and mood
  if (data.subject.trim()) {
    parts.push(data.subject.trim());
  }
  if (data.mood.length > 0) {
    parts.push(data.mood.join(', '));
  }

  // Tempo, key, time signature, energy
  const technicalSpecs: string[] = [];
  if (data.tempo_bpm.trim()) technicalSpecs.push(`${data.tempo_bpm} BPM`);
  if (data.key_scale.trim()) technicalSpecs.push(data.key_scale);
  if (data.time_signature.trim()) technicalSpecs.push(data.time_signature);
  if (data.energy) technicalSpecs.push(`${data.energy} energy`);
  if (technicalSpecs.length > 0) {
    parts.push(technicalSpecs.join(', '));
  }

  // Beat, bass, groove
  const rhythmSpecs: string[] = [];
  if (data.beat.trim()) rhythmSpecs.push(data.beat);
  if (data.bass.trim()) rhythmSpecs.push(data.bass);
  if (data.groove_swing) rhythmSpecs.push(`${data.groove_swing} groove`);
  if (rhythmSpecs.length > 0) {
    parts.push(rhythmSpecs.join(', '));
  }

  // Sound palette
  if (data.sound_palette.trim()) {
    parts.push(data.sound_palette);
  }

  // Vocals
  const vocalSpecs: string[] = [];
  if (data.vocal_gender && data.vocal_gender !== 'none') {
    vocalSpecs.push(`${data.vocal_gender} vocals`);
  }
  if (data.vocal_delivery) {
    vocalSpecs.push(data.vocal_delivery);
  }
  if (vocalSpecs.length > 0) {
    parts.push(vocalSpecs.join(', '));
  }

  // Arrangement
  if (data.arrangement.trim()) {
    parts.push(data.arrangement);
  }

  // FX and space
  const productionSpecs: string[] = [];
  if (data.fx_processing.trim()) productionSpecs.push(data.fx_processing);
  if (data.space.trim()) productionSpecs.push(data.space);
  if (productionSpecs.length > 0) {
    parts.push(productionSpecs.join(', '));
  }

  // References
  if (data.references.trim()) {
    parts.push(`inspired by ${data.references}`);
  }

  // Mix and master
  const audioSpecs: string[] = [];
  if (data.mix_notes.trim()) audioSpecs.push(data.mix_notes);
  if (data.master_notes.trim()) audioSpecs.push(data.master_notes);
  if (audioSpecs.length > 0) {
    parts.push(audioSpecs.join(', '));
  }

  // Era and length
  const finalSpecs: string[] = [];
  if (data.era.trim()) finalSpecs.push(data.era);
  if (data.length.trim()) finalSpecs.push(data.length);
  if (finalSpecs.length > 0) {
    parts.push(finalSpecs.join(', '));
  }

  // Freeform notes
  if (data.general_freeform.trim()) {
    parts.push(data.general_freeform);
  }

  const prompt = parts.filter(Boolean).join('. ');
  return `Prompt: ${prompt}`;
}