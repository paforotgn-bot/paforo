import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Hero } from '@/components/sections/hero';
import { LogosBar } from '@/components/sections/logos-bar';
import { CasesCarousel } from '@/components/sections/cases-carousel';
import { ServicesOverview } from '@/components/sections/services-overview';
import { Process } from '@/components/sections/process';
import { CTASection } from '@/components/sections/cta-section';
import { ContactBlock } from '@/components/sections/contact-block';
import { Section, SectionHeader } from '@/components/ui/section';
import { getCaseStudies } from '@/lib/content/cases';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    es: 'Agencia Digital | Desarrollo Web y Software',
    en: 'Digital Agency | Web & Software Development',
    ca: 'Agència Digital | Desenvolupament Web i Software',
  };
  const descriptions: Record<string, string> = {
    es: 'Paforo es una agencia digital especializada en desarrollo web y software a medida. Resultados medibles para empresas.',
    en: 'Paforo is a digital agency specialized in web development and custom software. Measurable results for businesses.',
    ca: 'Paforo és una agència digital especialitzada en desenvolupament web i software a mida. Resultats mesurables per a empreses.',
  };

  return generatePageMetadata({
    title: titles[locale] || titles.es,
    description: descriptions[locale] || descriptions.es,
    locale: locale as Locale,
    path: '',
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const cases = getCaseStudies(locale as Locale).map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    services: c.services,
    image: c.cardImage ?? c.image ?? (c.images && c.images[0]) ?? null,
    video: c.cardVideo ?? null,
    imagePosition: c.imagePosition ?? null,
    imageFit: c.imageFit ?? null,
  }));

  return (
    <>
      <Hero locale={locale as Locale} dict={dict} />
      <LogosBar dict={dict} />
      <ServicesOverview locale={locale as Locale} dict={dict} />
      <Process dict={dict} />
      <CasesCarousel locale={locale as Locale} dict={dict} cases={cases} />
      <CTASection locale={locale as Locale} dict={dict} />
      <Section id="contacto">
        <SectionHeader title={dict.contact.title} subtitle={dict.contact.subtitle} />
        <div className="mx-auto max-w-5xl">
          <ContactBlock locale={locale as Locale} dict={dict} />
        </div>
      </Section>
    </>
  );
}
