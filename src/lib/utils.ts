import { type Locale, DEFAULT_LOCALE } from './constants';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getLocalizedPath(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}

export function formatDate(date: string, locale: Locale): string {
  return new Date(date).toLocaleDateString(
    locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en-US' : 'es-ES',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
