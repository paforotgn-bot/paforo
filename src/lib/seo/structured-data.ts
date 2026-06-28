import { SITE_URL, SITE_NAME, NAP, SOCIAL, SERVICES } from '@/lib/constants';
import type { Locale } from '@/lib/constants';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: Object.values(SOCIAL),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: NAP.phone,
      email: NAP.email,
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English', 'Catalan'],
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: NAP.phone,
    email: NAP.email,
    address: {
      '@type': 'PostalAddress',
      ...NAP.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.1189,
      longitude: 1.2445,
    },
    image: `${SITE_URL}/logo.png`,
    priceRange: '€€',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: Object.values(SOCIAL),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: 'Worldwide',
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: ['es', 'en', 'ca'],
  };
}

export function getServiceListSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SERVICES.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/${locale}/servicios/${service.slug[locale]}`,
    })),
  };
}
