import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { ServicesOverview } from '@/components/sections/services-overview';
import { CTASection } from '@/components/sections/cta-section';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Container } from '@/components/ui/container';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    es: 'Servicios Digitales | Web, Software, SEO',
    en: 'Digital Services | Web, Software, SEO',
    ca: 'Serveis Digitals | Web, Software, SEO',
  };
  const descriptions: Record<string, string> = {
    es: 'Desarrollo web, software a medida, automatización de procesos, SEO y GEO para IA. Soluciones digitales para empresas.',
    en: 'Web development, custom software, process automation, SEO and GEO for AI. Digital solutions for businesses.',
    ca: 'Desenvolupament web, software a mida, automatització de processos, SEO i GEO per a IA. Solucions digitals per a empreses.',
  };
  return generatePageMetadata({
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    locale: locale as Locale,
    path: '/servicios',
  });
}

export default async function ServiciosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.services, href: `/${locale}/servicios` },
          ]}
        />
      </Container>
      <ServicesOverview locale={locale as Locale} dict={dict} />
      <CTASection locale={locale as Locale} dict={dict} />
    </>
  );
}
