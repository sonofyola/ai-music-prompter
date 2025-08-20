import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import * as FileSystem from 'expo-file-system';
import { AudioAnalysisResult } from '../components/AudioAnalyzer';

const customProvider = createOpenAI({
  compatibility: 'strict',
  baseURL: process.env.EXPO_PUBLIC_KIKI_BASE_URL,
  apiKey: process.env.EXPO_PUBLIC_KIKI_API_KEY
});

export async function analyzeAudioWithAI(audioUri: string): Promise<AudioAnalysisResult> {
  try {
    // Convert audio file to base64
    const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Get file info to determine format
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    const fileName = audioUri.split('/').pop() || 'audio';
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'mp3';
    
    // Create data URI for audio
    const mimeType = getMimeType(fileExtension);
    const audioDataUri = `data:${mimeType};base64,${base64Audio}`;

    const response = await generateText({
      model: customProvider('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: `You are an expert music producer and audio analyst. Analyze the provided audio clip and extract detailed musical characteristics. 

Return your analysis in this exact JSON format:
{
  "genres": ["genre1", "genre2"],
  "mood": ["mood1", "mood2"],
  "tempo": "estimated BPM or description",
  "energy": "low/medium/high/evolving",
  "style": "detailed style description",
  "instruments": "key instruments and sounds detected",
  "vibe": "overall vibe and atmosphere description"
}

Focus on:
- Musical genres and subgenres
- Emotional mood and atmosphere
- Tempo estimation (BPM if possible)
- Energy level throughout the track
- Production style and era
- Key instruments, synths, and sounds
- Overall vibe and feeling

Be specific and use music production terminology. If it's electronic music, identify subgenres precisely.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze this audio clip and provide detailed musical characteristics:'
            },
            {
              type: 'audio',
              audio: audioDataUri
            }
          ]
        }
      ]
    });

    // Parse the JSON response
    try {
      const analysis = JSON.parse(response.text);
      
      // Validate the response structure
      if (!analysis.genres || !analysis.mood || !analysis.tempo || !analysis.energy) {
        throw new Error('Invalid analysis response structure');
      }

      return {
        genres: Array.isArray(analysis.genres) ? analysis.genres : [analysis.genres],
        mood: Array.isArray(analysis.mood) ? analysis.mood : [analysis.mood],
        tempo: analysis.tempo || 'Unknown',
        energy: analysis.energy || 'medium',
        style: analysis.style || 'Unknown style',
        instruments: analysis.instruments || 'Various instruments',
        vibe: analysis.vibe || 'Unknown vibe'
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback: extract information from text response
      return parseTextualResponse(response.text);
    }

  } catch (error) {
    console.error('Error in audio analysis:', error);
    throw new Error('Failed to analyze audio. Please check your connection and try again.');
  }
}

function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'aac': 'audio/aac',
    'm4a': 'audio/mp4',
    'ogg': 'audio/ogg',
    'flac': 'audio/flac',
    'wma': 'audio/x-ms-wma'
  };
  
  return mimeTypes[extension] || 'audio/mpeg';
}

function parseTextualResponse(text: string): AudioAnalysisResult {
  // Fallback parser for when JSON parsing fails
  const defaultResult: AudioAnalysisResult = {
    genres: ['Electronic'],
    mood: ['energetic'],
    tempo: '128 BPM',
    energy: 'medium',
    style: 'Modern electronic production',
    instruments: 'Synthesizers, drums, bass',
    vibe: 'Uplifting and engaging'
  };

  try {
    // Try to extract information from the text
    const genreMatch = text.match(/genre[s]?[:\-\s]*([\w\s,&]+)/i);
    const moodMatch = text.match(/mood[s]?[:\-\s]*([\w\s,&]+)/i);
    const tempoMatch = text.match(/tempo[:\-\s]*(\d+\s*bpm|\w+)/i);
    const energyMatch = text.match(/energy[:\-\s]*(low|medium|high|evolving)/i);

    if (genreMatch) {
      defaultResult.genres = genreMatch[1].split(',').map(g => g.trim()).slice(0, 3);
    }
    if (moodMatch) {
      defaultResult.mood = moodMatch[1].split(',').map(m => m.trim()).slice(0, 3);
    }
    if (tempoMatch) {
      defaultResult.tempo = tempoMatch[1];
    }
    if (energyMatch) {
      defaultResult.energy = energyMatch[1].toLowerCase() as any;
    }

    return defaultResult;
  } catch (error) {
    console.error('Error parsing textual response:', error);
    return defaultResult;
  }
}