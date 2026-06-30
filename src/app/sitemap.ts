import type { MetadataRoute } from 'next';
import { SITE_URL, LOCALES } from '@/lib/constants';
import { getAllServiceSlugs } from '@/lib/content/services';
import { getCaseStudies } from '@/lib/content/cases';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = ['', '/contacto'];

  for (const page of staticPages) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8,
      });
    }
  }

  // Service pages
  const serviceSlugs = getAllServiceSlugs();
  for (const slug of serviceSlugs) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/servicios/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      });
    }
  }

  // Case studies
  for (const locale of LOCALES) {
    const cases = getCaseStudies(locale);
    for (const c of cases) {
      entries.push({
        url: `${SITE_URL}/${locale}/casos/${c.slug}`,
        lastModified: new Date(c.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
