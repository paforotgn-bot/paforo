import { notFound } from 'next/navigation';
import { isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';
import { IntroTunnel } from '@/components/ui/intro-tunnel';
import { JsonLd } from '@/components/seo/json-ld';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo/structured-data';
import type { Locale } from '@/lib/constants';

export async function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }, { locale: 'ca' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={getWebSiteSchema()} />
      <IntroTunnel />
      <Header locale={locale as Locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} dict={dict} />
      <WhatsAppFloat />
    </>
  );
}
