import type { Locale } from './config';

const dictionaries = {
  es: () => import('@/content/dictionaries/es.json').then((m) => m.default),
  en: () => import('@/content/dictionaries/en.json').then((m) => m.default),
  ca: () => import('@/content/dictionaries/ca.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
