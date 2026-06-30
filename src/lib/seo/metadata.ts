import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, LOCALES, type Locale } from '@/lib/constants';

interface GenerateMetadataOptions {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  image,
  noIndex,
}: GenerateMetadataOptions): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const fullTitle = path === '' ? `${SITE_NAME} - ${title}` : `${title} | ${SITE_NAME}`;
  const ogImage = image ?? `${SITE_URL}/og-image.png`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}/${l}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/es${path}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'ca' ? 'ca_ES' : locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
