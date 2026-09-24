import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/site';

/** Served at /sitemap.xml. The terminal is a single page, so one entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
