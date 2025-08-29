import React from 'react';
import SEOHead from './SEOHead';
import { BlogPost } from '../data/blogPosts';

interface BlogSEOProps {
  post: BlogPost;
  isListPage?: boolean;
}

export default function BlogSEO({ post, isListPage = false }: BlogSEOProps) {
  const title = isListPage 
    ? `${post.title} | AI Music Prompter Blog`
    : post.title;
    
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image || 'https://aimusicpromptr.com/images/blog-default.jpg',
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Music Prompter",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aimusicpromptr.com/images/logo.png"
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.url
    },
    "keywords": post.keywords.join(', '),
    "articleSection": post.category,
    "wordCount": post.content.split(' ').length,
    "timeRequired": `PT${post.readTime}M`,
    "inLanguage": "en-US"
  };

  return (
    <SEOHead
      title={title}
      description={post.metaDescription}
      keywords={post.keywords}
      canonicalUrl={post.url}
      ogImage={post.image}
      ogType="article"
      structuredData={structuredData}
    />
  );
}