import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { CaseStudy } from '@/types';
import type { Locale } from '@/lib/constants';

const CASES_DIR = path.join(process.cwd(), 'src/content/cases');

export function getCaseStudies(locale: Locale): CaseStudy[] {
  const dir = path.join(CASES_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

  return files
    .map((file) => {
      const slug = file.replace('.mdx', '');
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data, content } = matter(raw);

      return {
        slug,
        title: data.title || '',
        client: data.client || '',
        description: data.description || '',
        date: data.date || '',
        image: data.image || null,
        images: data.images || null,
        services: data.services || [],
        results: data.results || [],
        content,
      } as CaseStudy;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCaseStudy(locale: Locale, slug: string): CaseStudy | null {
  const filePath = path.join(CASES_DIR, locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || '',
    client: data.client || '',
    description: data.description || '',
    date: data.date || '',
    image: data.image || null,
    images: data.images || null,
    services: data.services || [],
    results: data.results || [],
    content,
  } as CaseStudy;
}
