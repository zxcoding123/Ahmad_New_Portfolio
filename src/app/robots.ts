import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/site';

/** Served at /robots.txt. The API routes are chat/GitHub proxies, not pages. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
