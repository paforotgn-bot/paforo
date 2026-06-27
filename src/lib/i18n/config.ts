import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/constants';

export { LOCALES, DEFAULT_LOCALE, type Locale };

export function isValidLocale(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale);
}

// Localized route mappings
export const routeMap: Record<string, Record<Locale, string>> = {
  servicios: { es: 'servicios', en: 'services', ca: 'serveis' },
  casos: { es: 'casos', en: 'cases', ca: 'casos' },
  contacto: { es: 'contacto', en: 'contact', ca: 'contacte' },
};
