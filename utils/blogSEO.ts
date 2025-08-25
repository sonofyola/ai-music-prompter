import { BlogPost } from '../data/blogPosts';

export interface BlogSEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData: any;
}

export const generateBlogPostSEO = (post: BlogPost): BlogSEOData => {
  const baseUrl = 'https://aimusicpromptr.com';
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  
  return {
    title: `${post.title} | AI Music Prompter Blog`,
    description: post.metaDescription,
    keywords: post.keywords,
    canonicalUrl: postUrl,
    ogTitle: post.title,
    ogDescription: post.metaDescription,
    ogImage: post.image ? `${baseUrl}${post.image}` : `${baseUrl}/og-image-blog.png`,
    ogUrl: postUrl,
    twitterTitle: post.title,
    twitterDescription: post.metaDescription,
    twitterImage: post.image ? `${baseUrl}${post.image}` : `${baseUrl}/twitter-image-blog.png`,
    structuredData: generateBlogPostStructuredData(post, postUrl)
  };
};

export const generateBlogIndexSEO = (): BlogSEOData => {
  const baseUrl = 'https://aimusicpromptr.com';
  const blogUrl = `${baseUrl}/blog`;
  
  return {
    title: 'AI Music Blog - Tips, Tutorials & Guides | AI Music Prompter',
    description: 'Expert tips, tutorials, and guides for AI music generation. Learn to create better prompts for Suno AI, Udio, MusicGen, and more AI music tools.',
    keywords: [
      'AI music blog',
      'AI music tutorials',
      'Suno AI tips',
      'Udio guides',
      'music prompt tutorials',
      'AI music generation tips',
      'music production AI',
      'AI songwriting guides'
    ],
    canonicalUrl: blogUrl,
    ogTitle: 'AI Music Blog - Expert Tips & Tutorials',
    ogDescription: 'Expert tips, tutorials, and guides for AI music generation. Learn to create better prompts for Suno AI, Udio, MusicGen, and more.',
    ogImage: `${baseUrl}/og-image-blog.png`,
    ogUrl: blogUrl,
    twitterTitle: 'AI Music Blog - Expert Tips & Tutorials',
    twitterDescription: 'Expert tips, tutorials, and guides for AI music generation. Learn to create better prompts for AI music tools.',
    twitterImage: `${baseUrl}/twitter-image-blog.png`,
    structuredData: generateBlogIndexStructuredData(blogUrl)
  };
};

const generateBlogPostStructuredData = (post: BlogPost, postUrl: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: post.image ? `https://aimusicpromptr.com${post.image}` : 'https://aimusicpromptr.com/og-image-blog.png',
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://aimusicpromptr.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Music Prompter',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aimusicpromptr.com/logo.png'
      }
    },
    datePublished: post.publishDate,
    dateModified: post.lastModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    wordCount: Math.floor(post.content.length / 5), // Rough word count estimate
    timeRequired: `PT${post.readTime}M`,
    about: {
      '@type': 'Thing',
      name: 'AI Music Generation',
      description: 'Artificial intelligence tools and techniques for creating music'
    },
    mentions: post.tags.map(tag => ({
      '@type': 'Thing',
      name: tag
    })),
    isPartOf: {
      '@type': 'Blog',
      name: 'AI Music Prompter Blog',
      url: 'https://aimusicpromptr.com/blog'
    }
  };
};

const generateBlogIndexStructuredData = (blogUrl: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'AI Music Prompter Blog',
    description: 'Expert tips, tutorials, and guides for AI music generation and prompt engineering',
    url: blogUrl,
    publisher: {
      '@type': 'Organization',
      name: 'AI Music Prompter',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aimusicpromptr.com/logo.png'
      }
    },
    about: {
      '@type': 'Thing',
      name: 'AI Music Generation',
      description: 'Artificial intelligence tools and techniques for creating music'
    },
    keywords: 'AI music, music generation, Suno AI, Udio, MusicGen, prompt engineering, music production',
    inLanguage: 'en-US',
    copyrightYear: 2024,
    copyrightHolder: {
      '@type': 'Organization',
      name: 'AI Music Prompter'
    }
  };
};

// Helper function to generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (post?: BlogPost) => {
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://aimusicpromptr.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://aimusicpromptr.com/blog'
    }
  ];

  if (post) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: `https://aimusicpromptr.com/blog/${post.slug}`
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
  };
};

// Helper function to generate FAQ structured data for blog posts
export const generateBlogFAQStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I create better AI music prompts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To create better AI music prompts, be specific about genre, mood, instruments, tempo, and structure. Include technical details like BPM and key, and use descriptive language for the atmosphere you want to create.'
        }
      },
      {
        '@type': 'Question',
        name: 'What\'s the difference between Suno AI and Udio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Suno AI focuses on ease of use and consistent results, while Udio emphasizes higher audio quality and professional features. Suno AI is better for beginners and rapid prototyping, while Udio excels in professional music production.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I control track length in AI music generation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Control track length by specifying duration in your prompts (e.g., "30 seconds," "3 minutes"), describing structure complexity, and using platform-specific optimization techniques for different use cases like social media or streaming.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the weirdness parameter in AI music?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The weirdness parameter controls how experimental or conventional your AI-generated music will be. Lower values create familiar, mainstream music, while higher values produce more experimental, avant-garde compositions.'
        }
      }
    ]
  };
};

// Content optimization helpers
export const generateMetaKeywords = (post: BlogPost): string => {
  return [...post.keywords, ...post.tags, post.category].join(', ');
};

export const generateSocialShareText = (post: BlogPost): string => {
  return `${post.title} - ${post.excerpt} Read more at AI Music Prompter Blog.`;
};

export const estimateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};