export const generateMetaTitle = (
  baseTitle: string,
  category?: string,
  includeYear: boolean = true
): string => {
  const year = includeYear ? ` ${new Date().getFullYear()}` : '';
  const categoryPrefix = category ? `${category} - ` : '';
  return `${categoryPrefix}${baseTitle}${year} | AI Music Prompter`;
};

export const generateMetaDescription = (
  content: string,
  maxLength: number = 160
): string => {
  // Remove markdown and HTML
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength - 3).trim() + '...';
};

export const generateKeywords = (
  baseKeywords: string[],
  additionalTerms: string[] = []
): string[] => {
  const coreKeywords = [
    'AI music',
    'music prompts',
    'AI music generation',
    'Suno AI',
    'Udio',
    'music AI tool'
  ];
  
  return [...new Set([...coreKeywords, ...baseKeywords, ...additionalTerms])];
};

export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://aimusicpromptr.com';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const generateStructuredDataFAQ = (faqs: Array<{question: string, answer: string}>) => {
  return {
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
  };
};

export const generateStructuredDataHowTo = (
  name: string,
  description: string,
  steps: Array<{name: string, text: string}>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  };
};

export const generateStructuredDataSoftwareApp = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI Music Prompter",
    "description": "Professional AI music prompt generator for Suno AI, Udio, and other platforms",
    "url": "https://aimusicpromptr.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "AI Music Prompt Generation",
      "Genre-Specific Templates",
      "Mood and Energy Controls",
      "Professional Prompt Optimization",
      "Multi-Platform Support",
      "Prompt History Management",
      "Usage Analytics",
      "Pro Subscription Features"
    ]
  };
};