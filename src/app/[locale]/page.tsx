import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Hero } from '@/components/sections/hero';
import { WhoWeAre } from '@/components/sections/who-we-are';
import { LogosBar } from '@/components/sections/logos-bar';
import { ServicesOverview } from '@/components/sections/services-overview';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { CasesShowcase } from '@/components/sections/cases-showcase';
import { Portfolio } from '@/components/sections/portfolio';
import { Process } from '@/components/sections/process';
import { FAQ } from '@/components/sections/faq';
import { CTASection } from '@/components/sections/cta-section';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titles: Record<string, string> = {
    es: 'Agencia Digital | Desarrollo Web y Software',
    en: 'Digital Agency | Web & Software Development',
    ca: 'Agència Digital | Desenvolupament Web i Software',
  };
  const descriptions: Record<string, string> = {
    es: 'Paforo es una agencia digital especializada en desarrollo web, software a medida, automatización y posicionamiento SEO/GEO. Resultados medibles para empresas.',
    en: 'Paforo is a digital agency specialized in web development, custom software, automation and SEO/GEO positioning. Measurable results for businesses.',
    ca: 'Paforo és una agència digital especialitzada en desenvolupament web, software a mida, automatització i posicionament SEO/GEO. Resultats mesurables per a empreses.',
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

  return (
    <>
      <Hero locale={locale as Locale} dict={dict} />
      <ServicesOverview locale={locale as Locale} dict={dict} />
      <WhoWeAre dict={dict} />
      <LogosBar dict={dict} />
      <WhyChooseUs dict={dict} />
      <CasesShowcase locale={locale as Locale} dict={dict} />
      <Portfolio dict={dict} />
      <Process dict={dict} />
      <FAQ
        title={dict.faq.title}
        subtitle={dict.faq.subtitle}
        faqs={dict.faq.items}
      />
      <CTASection locale={locale as Locale} dict={dict} />
    </>
  );
}
