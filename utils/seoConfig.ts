export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

export const defaultSEOConfig: SEOConfig = {
  title: "AI Music Prompt Generator - Create Professional Music Prompts for Suno, Udio & More",
  description: "Generate professional AI music prompts instantly. Perfect for Suno AI, Udio, MusicGen, and other AI music tools. Create detailed prompts with genre, mood, instruments, and more. Free daily generations + premium unlimited access.",
  keywords: [
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
    canonicalUrl: "https://your-domain.com/"
  },
  
  app: {
    title: "AI Music Prompt Generator App - Create Music Prompts Now",
    description: "Use our free AI music prompt generator to create professional prompts for Suno AI, Udio, MusicGen and more. Generate detailed music descriptions with genre, mood, instruments, and advanced parameters.",
    keywords: [...defaultSEOConfig.keywords, "music prompt app", "online music generator", "free music prompts"],
    canonicalUrl: "https://your-domain.com/app"
  },
  
  subscription: {
    title: "Premium Plans - Unlimited AI Music Prompts | AI Music Prompt Generator",
    description: "Upgrade to premium for unlimited AI music prompt generations. Perfect for professional musicians, content creators, and music producers. Only $5.99/month for unlimited access.",
    keywords: [...defaultSEOConfig.keywords, "premium music prompts", "unlimited music generation", "music prompt subscription"],
    canonicalUrl: "https://your-domain.com/subscription"
  }
};

// High-value long-tail keywords for content creation
export const contentKeywords = {
  howToGuides: [
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
    "Suno AI vs Udio prompts",
    "best AI music generators 2024",
    "MusicGen vs Suno AI comparison",
    "AI music tools comparison",
    "Udio vs Suno AI which is better"
  ],
  
  tutorials: [
    "Suno AI tutorial for beginners",
    "how to use Udio effectively",
    "MusicGen prompt examples",
    "AI music creation workflow",
    "music production with AI tools"
  ]
};

// Structured data templates
export const structuredDataTemplates = {
  faqPage: (faqs: Array<{question: string, answer: string}>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),
  
  howTo: (title: string, steps: Array<{name: string, text: string}>) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": `Learn ${title.toLowerCase()} with our step-by-step guide`,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  }),
  
  article: (title: string, description: string, datePublished: string) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": datePublished,
    "author": {
      "@type": "Organization",
      "name": "AI Music Prompt Generator"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Music Prompt Generator"
    }
  })
};

// SEO-optimized content suggestions
export const contentSuggestions = {
  blogPosts: [
    {
      title: "The Complete Guide to Suno AI Prompts: 50+ Examples That Work",
      slug: "complete-guide-suno-ai-prompts-examples",
      keywords: ["Suno AI prompts", "Suno AI examples", "best Suno prompts"],
      description: "Master Suno AI with our comprehensive guide featuring 50+ proven prompt examples, tips, and best practices for creating amazing AI music."
    },
    {
      title: "Udio vs Suno AI: Which AI Music Generator is Better in 2024?",
      slug: "udio-vs-suno-ai-comparison-2024",
      keywords: ["Udio vs Suno AI", "best AI music generator", "AI music comparison"],
      description: "Compare Udio and Suno AI side-by-side. Features, pricing, quality, and which AI music generator is best for your needs in 2024."
    },
    {
      title: "How to Write Perfect Music Prompts for AI Generators",
      slug: "how-to-write-perfect-music-prompts-ai",
      keywords: ["music prompt writing", "AI music prompts", "music generation tips"],
      description: "Learn the art of writing effective music prompts for AI generators. Tips, techniques, and examples for better AI music results."
    }
  ],
  
  landingPages: [
    {
      title: "Suno AI Prompt Generator - Create Perfect Suno Prompts",
      slug: "suno-ai-prompt-generator",
      keywords: ["Suno AI prompt generator", "Suno prompts", "Suno AI tool"],
      description: "Generate optimized prompts specifically for Suno AI. Create better music with our specialized Suno prompt generator."
    },
    {
      title: "Udio Prompt Generator - Professional Udio Music Prompts",
      slug: "udio-prompt-generator", 
      keywords: ["Udio prompt generator", "Udio prompts", "Udio music AI"],
      description: "Create professional prompts for Udio AI music generator. Optimized for Udio's unique capabilities and features."
    }
  ]
};