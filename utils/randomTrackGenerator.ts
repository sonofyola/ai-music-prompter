// Random track idea generator for creative inspiration
export interface TrackIdea {
  subject: string;
  description: string;
}

// Curated lists for generating unique track ideas
const EMOTIONS = [
  'nostalgia', 'euphoria', 'melancholy', 'rage', 'serenity', 'anxiety', 'bliss', 'longing',
  'triumph', 'despair', 'wonder', 'rebellion', 'peace', 'chaos', 'hope', 'fear',
  'love', 'loss', 'freedom', 'confinement', 'awakening', 'confusion', 'clarity', 'mystery'
];

const SETTINGS = [
  'abandoned warehouse', 'neon-lit city', 'underwater cave', 'space station', 'forest at dawn',
  'rooftop at midnight', 'desert highway', 'cyberpunk alley', 'mountain peak', 'underground club',
  'floating island', 'time machine', 'crystal cavern', 'ghost town', 'digital realm',
  'ancient temple', 'futuristic laboratory', 'dreamscape', 'parallel dimension', 'memory palace'
];

const CONCEPTS = [
  'digital detox', 'time loops', 'synthetic memories', 'quantum entanglement', 'neural networks',
  'holographic reality', 'consciousness transfer', 'genetic algorithms', 'virtual addiction',
  'artificial emotions', 'data streams', 'system glitches', 'code poetry', 'pixel dreams',
  'algorithmic love', 'binary sunset', 'encrypted feelings', 'server farm meditation',
  'cloud computing', 'blockchain revolution'
];

const CHARACTERS = [
  'rogue AI', 'time traveler', 'digital ghost', 'cyber detective', 'space nomad',
  'memory thief', 'code breaker', 'dream hacker', 'quantum physicist', 'android musician',
  'data archaeologist', 'virtual reality architect', 'consciousness explorer', 'nano engineer',
  'hologram artist', 'genetic sculptor', 'neural interface designer', 'cosmic DJ',
  'interdimensional messenger', 'synthetic life form'
];

const OBJECTS = [
  'broken synthesizer', 'glowing crystal', 'ancient artifact', 'quantum computer',
  'time capsule', 'holographic projector', 'neural implant', 'cosmic radio',
  'digital compass', 'memory chip', 'sonic weapon', 'gravity generator',
  'dimensional portal', 'consciousness recorder', 'emotion detector', 'dream catcher',
  'reality distorter', 'frequency modulator', 'temporal anchor', 'quantum key'
];

const ACTIONS = [
  'awakening', 'transformation', 'journey', 'discovery', 'rebellion', 'escape',
  'connection', 'evolution', 'collision', 'fusion', 'breakdown', 'breakthrough',
  'ascension', 'descent', 'convergence', 'divergence', 'synchronization', 'chaos',
  'creation', 'destruction', 'resurrection', 'transcendence', 'metamorphosis', 'revelation'
];

const TIMES = [
  '3 AM', 'dawn', 'midnight', 'golden hour', 'eclipse', 'solstice',
  'the year 2087', 'before time', 'between seconds', 'eternal moment',
  'last day on Earth', 'first contact', 'the singularity', 'quantum leap',
  'temporal anomaly', 'time freeze', 'parallel timeline', 'future echo'
];

// Template patterns for generating diverse track ideas
const IDEA_TEMPLATES = [
  // Emotion + Setting
  (emotion: string, setting: string) => ({
    subject: `${emotion} in ${setting}`,
    description: `Explore the feeling of ${emotion} within the atmosphere of ${setting}`
  }),
  
  // Character + Action
  (character: string, action: string) => ({
    subject: `${character}'s ${action}`,
    description: `Follow a ${character} through their journey of ${action}`
  }),
  
  // Concept + Time
  (concept: string, time: string) => ({
    subject: `${concept} at ${time}`,
    description: `Experience ${concept} during ${time}`
  }),
  
  // Object + Emotion
  (object: string, emotion: string) => ({
    subject: `the ${object} of ${emotion}`,
    description: `A mysterious ${object} that embodies the essence of ${emotion}`
  }),
  
  // Setting + Action
  (setting: string, action: string) => ({
    subject: `${action} in ${setting}`,
    description: `The story of ${action} taking place in ${setting}`
  }),
  
  // Character + Object
  (character: string, object: string) => ({
    subject: `${character} finds the ${object}`,
    description: `A ${character} discovers a powerful ${object} that changes everything`
  }),
  
  // Concept + Character
  (concept: string, character: string) => ({
    subject: `${character} and ${concept}`,
    description: `How a ${character} encounters and deals with ${concept}`
  }),
  
  // Time + Emotion
  (time: string, emotion: string) => ({
    subject: `${emotion} at ${time}`,
    description: `The profound feeling of ${emotion} experienced at ${time}`
  }),
  
  // Action + Concept
  (action: string, concept: string) => ({
    subject: `${action} through ${concept}`,
    description: `A journey of ${action} guided by the principles of ${concept}`
  }),
  
  // Complex combinations
  (setting: string, character: string, action: string) => ({
    subject: `${character}'s ${action} in ${setting}`,
    description: `A ${character} undergoes ${action} within the unique environment of ${setting}`
  })
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomTrackIdea(): TrackIdea {
  // Choose a random template
  const template = getRandomElement(IDEA_TEMPLATES);
  
  // Generate parameters based on template requirements
  const emotion = getRandomElement(EMOTIONS);
  const setting = getRandomElement(SETTINGS);
  const concept = getRandomElement(CONCEPTS);
  const character = getRandomElement(CHARACTERS);
  const object = getRandomElement(OBJECTS);
  const action = getRandomElement(ACTIONS);
  const time = getRandomElement(TIMES);
  
  // Apply template with random parameters
  if (template.length === 2) {
    // Two parameter templates
    const params = [emotion, setting, concept, character, object, action, time];
    const param1 = getRandomElement(params);
    const param2 = getRandomElement(params.filter(p => p !== param1));
    return template(param1, param2);
  } else if (template.length === 3) {
    // Three parameter template
    return template(setting, character, action);
  } else {
    // Fallback to simple emotion + setting
    return {
      subject: `${emotion} in ${setting}`,
      description: `Explore the feeling of ${emotion} within the atmosphere of ${setting}`
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