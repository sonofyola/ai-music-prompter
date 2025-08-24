export const SEO_CONFIG = {
  // Primary SEO Data
  title: 'AI Music Prompter - Professional Prompts for Suno AI, Udio, Riffusion & MusicGen',
  description: 'Generate professional AI music prompts instantly for Suno AI, Udio, Riffusion, MusicGen & more. Advanced genre selection, mood control, tempo settings. 3 free daily generations + unlimited premium access.',
  keywords: [
    'AI music prompter',
    'AI music prompts',
    'Suno AI prompts',
    'Udio prompts', 
    'Riffusion prompts',
    'MusicGen prompts',
    'AI music generator',
    'music prompt creator',
    'AI songwriting',
    'music production AI',
    'artificial intelligence music',
    'automated music prompts',
    'music AI tools',
    'song prompt generator',
    'AI music creation',
    'text to music',
    'music AI assistant'
  ],
  
  // URLs and Social
  siteUrl: 'https://aimusicpromptr.com',
  siteName: 'AI Music Prompter',
  twitterHandle: '@aimusicpromptr',
  
  // Images
  ogImage: 'https://aimusicpromptr.com/og-image.png',
  twitterImage: 'https://aimusicpromptr.com/twitter-image.png',
  logo: 'https://aimusicpromptr.com/logo.png',
  
  // App Info
  appName: 'AI Music Prompter',
  appShortName: 'AI Prompter',
  themeColor: '#6366f1',
  backgroundColor: '#ffffff',
  
  // Features for structured data
  features: [
    'AI Music Prompt Generation',
    'Multiple Genre Support (Electronic, Rock, Pop, Hip-Hop, etc.)',
    'Advanced Mood and Energy Controls',
    'Instrument and Vocal Specifications',
    'Tempo and Key Selection',
    'Custom Creative Direction',
    'Prompt History and Templates',
    'Export and Copy Functionality',
    'Mobile and Desktop Responsive'
  ],
  
  // Supported AI Tools
  supportedTools: [
    'Suno AI',
    'Udio',
    'Riffusion', 
    'MusicGen',
    'AIVA',
    'Amper Music',
    'Soundful',
    'Boomy'
  ],
  
  // FAQ Data
  faq: [
    {
      question: 'What is AI Music Prompter?',
      answer: 'AI Music Prompter is a professional tool that creates detailed text descriptions to guide AI music generators like Suno AI, Udio, Riffusion, and MusicGen. It combines genre, mood, instruments, tempo, vocal styles, and other parameters into optimized prompts that produce better AI-generated music.'
    },
    {
      question: 'Which AI music tools work with AI Music Prompter?',
      answer: 'AI Music Prompter works with all major AI music generators including Suno AI, Udio, Riffusion, MusicGen, AIVA, Amper Music, Soundful, Boomy, and any other text-to-music AI platform that accepts descriptive prompts.'
    },
    {
      question: 'Is AI Music Prompter free to use?',
      answer: 'Yes! AI Music Prompter offers 3 free professional prompt generations per day. For unlimited access with advanced features, premium plans start at just $5.99/month.'
    },
    {
      question: 'How does AI Music Prompter improve my AI music results?',
      answer: 'AI Music Prompter uses advanced prompt engineering techniques to create detailed, structured descriptions that AI music tools understand better. This results in more accurate genre matching, better mood control, proper instrumentation, and overall higher quality AI-generated music.'
    },
    {
      question: 'Can I save and reuse my prompts?',
      answer: 'Absolutely! AI Music Prompter includes prompt history, templates, and export functionality. You can save your best prompts, create custom templates, and build a library of go-to prompts for different music styles.'
    }
  ],
  
  // Blog topics for future content
  blogTopics: [
    'Best AI Music Prompts for Electronic Music',
    'How to Write Perfect Prompts for Suno AI',
    'Udio vs Suno AI: Complete Comparison Guide',
    'Advanced Prompt Engineering for AI Music',
    'Genre-Specific Prompt Templates',
    'Mood and Energy Control in AI Music',
    'The Future of AI Music Generation',
    'Tips for Better AI Music Results'
  ],
  
  // Disclaimer
  disclaimer: 'AI Music Prompter is an independent tool and is not affiliated with, endorsed by, or connected to Suno AI, Udio, Riffusion, MusicGen, or any other AI music generation platforms. All trademarks and product names are the property of their respective owners.'
};

// Helper function to generate meta tags
export const generateMetaTags = (pageTitle?: string, pageDescription?: string) => {
  const title = pageTitle || SEO_CONFIG.title;
  const description = pageDescription || SEO_CONFIG.description;
  
  return {
    title,
    description,
    keywords: SEO_CONFIG.keywords.join(', '),
    ogTitle: title,
    ogDescription: description,
    ogImage: SEO_CONFIG.ogImage,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: SEO_CONFIG.twitterImage,
    canonical: SEO_CONFIG.siteUrl
  };
};

// Helper function for structured data
export const generateStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SEO_CONFIG.appName,
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.siteUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    featureList: SEO_CONFIG.features,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free with premium options available'
    }
  };
};