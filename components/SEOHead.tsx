import React from 'react';
import { Helmet } from 'react-helmet-async';

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

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="AI Music Prompter" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@aimusicpromptr" />
      <meta name="twitter:creator" content="@aimusicpromptr" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="AI Music Prompter Team" />
      <meta name="publisher" content="AI Music Prompter" />
      <meta name="copyright" content="© 2024 AI Music Prompter" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
}