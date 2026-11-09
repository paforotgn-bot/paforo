import type { MetadataRoute } from 'next';
import { SITE_URL, LOCALES } from '@/lib/constants';
import { getProjects } from '@/lib/content/projects';

/*
  Sólo rutas que existen. El trabajo ya no vive en /casos ni /servicios:
  está en el índice de la home y enlaza a las webs reales.
*/
const PAGES = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/contacto', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/privacidad', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/cookies', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/terminos', priority: 0.2, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = LOCALES.flatMap((locale) =>
    PAGES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  );

  const projects = LOCALES.flatMap((locale) =>
    getProjects().map((project) => ({
      url: `${SITE_URL}/${locale}/trabajo/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }))
  );

  return [...pages, ...projects];
}
