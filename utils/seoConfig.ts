export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

export const defaultSEOConfig: SEOConfig = {
  title: "AI Music Prompter - Create Professional Music Prompts for Suno, Udio & More",
  description: "AI Music Prompter generates professional AI music prompts instantly. Perfect for Suno AI, Udio, MusicGen, and other AI music tools. Create detailed prompts with genre, mood, instruments, and more. Free daily generations + premium unlimited access.",
  keywords: [
    "AI music prompter",
    "AI music prompts",
    "Suno AI prompts", 
    "Udio prompts",
    "MusicGen prompts",
    "AI music generator",
    "music prompt creator",
    "AI songwriting",
    "music production AI",
    "artificial intelligence music",
    "automated music prompts",
    "music AI tools",
    "song prompt generator",
    "AI music creation",
    "music generation prompts",
    "Suno AI generator",
    "Udio music AI",
    "AI music composition",
    "music prompt optimization"
  ]
};

export const pageConfigs = {
  home: {
    ...defaultSEOConfig,
    canonicalUrl: "https://aimusicpromptr.com/"
  },
  
  app: {
    title: "AI Music Prompter App - Create Music Prompts Now",
    description: "Use AI Music Prompter to create professional prompts for Suno AI, Udio, MusicGen and more. Generate detailed music descriptions with genre, mood, instruments, and advanced parameters.",
    keywords: [...defaultSEOConfig.keywords, "music prompt app", "online music generator", "free music prompts"],
    canonicalUrl: "https://aimusicpromptr.com/app"
  },
  
  subscription: {
    title: "Premium Plans - Unlimited AI Music Prompts | AI Music Prompter",
    description: "Upgrade AI Music Prompter to premium for unlimited AI music prompt generations. Perfect for professional musicians, content creators, and music producers. Only $5.99/month for unlimited access.",
    keywords: [...defaultSEOConfig.keywords, "premium music prompts", "unlimited music generation", "music prompt subscription"],
    canonicalUrl: "https://aimusicpromptr.com/subscription"
  }
};

// High-value long-tail keywords for content creation
export const contentKeywords = {
  howToGuides: [
    "how to use AI Music Prompter",
    "AI Music Prompter tutorial",
    "how to write prompts for Suno AI",
    "best Suno AI prompts examples",
    "Udio prompt writing guide",
    "MusicGen prompt optimization",
    "AI music prompt best practices",
    "creating effective music prompts",
    "Suno AI v4 prompt guide",
    "professional music prompt writing"
  ],
  
  comparisons: [
    "AI Music Prompter vs competitors",
    "Suno AI vs Udio prompts",
    "best AI music generators 2024",
    "MusicGen vs Suno AI comparison",
    "AI music tools comparison",
    "Udio vs Suno AI which is better"
  ],
  
  tutorials: [
    "AI Music Prompter beginner guide",
    "Suno AI tutorial for beginners",
    "how to use Udio effectively",
    "MusicGen prompt examples",
    "AI music creation workflow",
    "music production with AI tools"
  ]
};

// SEO-optimized content suggestions
export const contentSuggestions = {
  blogPosts: [
    {
      title: "The Complete Guide to AI Music Prompter: 50+ Examples That Work",
      slug: "complete-guide-ai-music-prompter-examples",
      keywords: ["AI Music Prompter", "AI music prompts", "Suno AI examples", "best music prompts"],
      description: "Master AI Music Prompter with our comprehensive guide featuring 50+ proven prompt examples, tips, and best practices for creating amazing AI music."
    },
    {
      title: "AI Music Prompter vs Competitors: Why We're the Best Choice in 2024",
      slug: "ai-music-prompter-vs-competitors-2024",
      keywords: ["AI Music Prompter", "best AI music prompt generator", "AI music comparison"],
      description: "Compare AI Music Prompter with other tools. Features, pricing, quality, and why AI Music Prompter is the best choice for your needs in 2024."
    },
    {
      title: "How to Write Perfect Music Prompts with AI Music Prompter",
      slug: "how-to-write-perfect-music-prompts-ai-music-prompter",
      keywords: ["AI Music Prompter tutorial", "music prompt writing", "AI music prompts"],
      description: "Learn the art of writing effective music prompts using AI Music Prompter. Tips, techniques, and examples for better AI music results."
    }
  ],
  
  landingPages: [
    {
      title: "AI Music Prompter for Suno AI - Create Perfect Suno Prompts",
      slug: "suno-ai-prompt-generator",
      keywords: ["AI Music Prompter Suno", "Suno AI prompt generator", "Suno prompts"],
      description: "Use AI Music Prompter to generate optimized prompts specifically for Suno AI. Create better music with our specialized Suno prompt generator."
    },
    {
      title: "AI Music Prompter for Udio - Professional Udio Music Prompts",
      slug: "udio-prompt-generator", 
      keywords: ["AI Music Prompter Udio", "Udio prompt generator", "Udio prompts"],
      description: "Create professional prompts for Udio AI music generator using AI Music Prompter. Optimized for Udio's unique capabilities and features."
    }
  ]
};
