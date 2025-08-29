import React from 'react';
import { View } from 'react-native';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
  noIndex?: boolean;
}

export default function SEOHead({
  title = 'AI Music Prompter - Professional Music Prompts for Suno AI, Udio & More',
  description = 'Generate professional AI music prompts for Suno AI, Udio, and other platforms. Create perfect prompts with our advanced tool featuring genre templates, mood controls, and expert optimization.',
  keywords = [
    'AI music prompts',
    'Suno AI prompts',
    'Udio prompts',
    'AI music generation',
    'music prompt generator',
    'AI music tool',
    'music production AI',
    'prompt engineering music',
    'AI music creator',
    'music AI prompts'
  ],
  canonicalUrl = 'https://aimusicpromptr.com',
  ogImage = 'https://aimusicpromptr.com/images/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false
}: SEOHeadProps) {
  const fullTitle = title.includes('AI Music Prompter') ? title : `${title} | AI Music Prompter`;

  // For React Native, we'll handle SEO through the web build process
  // This component serves as a placeholder and data container
  React.useEffect(() => {
    // Set document title for web
    if (typeof document !== 'undefined') {
      const defaultStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AI Music Prompter",
        "description": description,
        "url": canonicalUrl,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "creator": {
          "@type": "Organization",
          "name": "AI Music Prompter Team",
          "url": "https://aimusicpromptr.com"
        },
        "featureList": [
          "AI Music Prompt Generation",
          "Genre-Specific Templates",
          "Mood and Energy Controls",
          "Professional Prompt Optimization",
          "Multi-Platform Support",
          "Prompt History Management"
        ]
      };
      
      const finalStructuredData = structuredData || defaultStructuredData;
      
      document.title = fullTitle;
      
      // Set robots meta tag
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');
      
      // Set meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
      
      // Set meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
      
      // Set canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
      
      // Set Open Graph tags
      const ogTags = [
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: ogType },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImage },
        { property: 'og:site_name', content: 'AI Music Prompter' }
      ];
      
      ogTags.forEach(tag => {
        let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', tag.property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', tag.content);
      });
      
      // Set Twitter Card tags
      const twitterTags = [
        { name: 'twitter:card', content: twitterCard },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage }
      ];
      
      twitterTags.forEach(tag => {
        let twitterTag = document.querySelector(`meta[name="${tag.name}"]`);
        if (!twitterTag) {
          twitterTag = document.createElement('meta');
          twitterTag.setAttribute('name', tag.name);
          document.head.appendChild(twitterTag);
        }
        twitterTag.setAttribute('content', tag.content);
      });
      
      // Set structured data
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(finalStructuredData);
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogImage, ogType, twitterCard, structuredData, noIndex]);

  // Return empty view for React Native
  return <View style={{ display: 'none' }} />;
}