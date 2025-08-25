interface FormData {
  genre: string;
  mood: string;
  tempo: string;
  instruments: string[];
  vocals: string;
  structure: string;
  theme: string;
  style: string;
  energy: string;
  production: string;
  customPrompt: string;
}

export function formatPrompt(formData: FormData): string {
  const parts: string[] = [];

  // Add genre
  if (formData.genre) {
    parts.push(`Genre: ${formData.genre}`);
  }

  // Add mood
  if (formData.mood) {
    parts.push(`Mood: ${formData.mood}`);
  }

  // Add tempo
  if (formData.tempo) {
    parts.push(`Tempo: ${formData.tempo}`);
  }

  // Add instruments
  if (formData.instruments.length > 0) {
    parts.push(`Instruments: ${formData.instruments.join(', ')}`);
  }

  // Add vocals
  if (formData.vocals) {
    parts.push(`Vocals: ${formData.vocals}`);
  }

  // Add structure
  if (formData.structure) {
    parts.push(`Structure: ${formData.structure}`);
  }

  // Add theme
  if (formData.theme) {
    parts.push(`Theme: ${formData.theme}`);
  }

  // Add style
  if (formData.style) {
    parts.push(`Style: ${formData.style}`);
  }

  // Add energy
  if (formData.energy) {
    parts.push(`Energy: ${formData.energy}`);
  }

  // Add production
  if (formData.production) {
    parts.push(`Production: ${formData.production}`);
  }

  // Add custom prompt
  if (formData.customPrompt) {
    parts.push(`Additional Instructions: ${formData.customPrompt}`);
  }

  // Join all parts with line breaks
  let prompt = parts.join('\n');

  // If no fields are filled, provide a default message
  if (parts.length === 0) {
    prompt = 'Please fill in some fields to generate a music prompt.';
  }

  return prompt;
}