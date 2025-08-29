import { blogPosts } from '../data/blogPosts';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (): string => {
  const baseUrl = 'https://aimusicpromptr.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    // Main pages
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/subscription`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/privacy-policy`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/terms-of-service`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.3
    },
    
    // Blog posts
    ...blogPosts.map(post => ({
      loc: post.url,
      lastmod: post.lastModified,
      changefreq: 'weekly' as const,
      priority: post.featured ? 0.9 : 0.7
    })),
    
    // Blog categories
    ...Array.from(new Set(blogPosts.map(post => post.category))).map(category => ({
      loc: `${baseUrl}/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
      lastmod: currentDate,
      changefreq: 'weekly' as const,
      priority: 0.6
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://aimusicpromptr.com';
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /debug/

# Allow important pages
Allow: /blog/
Allow: /subscription/
Allow: /privacy-policy/
Allow: /terms-of-service/`;
};