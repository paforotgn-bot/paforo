export const SITE_URL = 'https://paforo.com';
export const SITE_NAME = 'Paforo';
export const SITE_TAGLINE = {
  es: 'Soluciones digitales que impulsan tu negocio',
  en: 'Digital solutions that drive your business',
  ca: 'Solucions digitals que impulsen el teu negoci',
};

export const LOCALES = ['es', 'en', 'ca'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const NAP = {
  name: 'Paforo',
  address: {
    streetAddress: 'Tarragona',
    addressLocality: 'Tarragona',
    addressRegion: 'Cataluña',
    postalCode: '43001',
    addressCountry: 'ES',
  },
  phone: '+34 639 748 955',
  email: 'paforotgn@gmail.com',
};

export const SOCIAL = {
  linkedin: 'https://linkedin.com/company/paforo',
  twitter: 'https://twitter.com/paforo',
  instagram: 'https://instagram.com/paforo',
  github: 'https://github.com/paforo',
};

export const SERVICES = [
  {
    slug: { es: 'desarrollo-web', en: 'web-development', ca: 'desenvolupament-web' },
    icon: '🌐',
    image: '/images/services/desarrollo-web.png',
    color: 'violet' as const,
  },
  {
    slug: { es: 'desarrollo-software', en: 'software-development', ca: 'desenvolupament-software' },
    icon: '⚙️',
    image: '/images/services/desarrollo-software.png',
    color: 'cyan' as const,
  },
] as const;
