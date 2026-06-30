import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getServiceData, getAllServiceSlugs } from '@/lib/content/services';
import { getCaseStudies } from '@/lib/content/cases';
import { getServiceSchema, getFAQSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { GlowCard } from '@/components/ui/glow-card';
import { FAQ } from '@/components/sections/faq';
import { Process } from '@/components/sections/process';
import { LogosBar } from '@/components/sections/logos-bar';
import { CasesCarousel } from '@/components/sections/cases-carousel';
import { CTASection } from '@/components/sections/cta-section';
import { SITE_URL } from '@/lib/constants';
import type { Locale } from '@/lib/constants';

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  const locales = ['es', 'en', 'ca'];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const service = getServiceData(locale as Locale, slug);
  if (!service) return {};

  return generatePageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    locale: locale as Locale,
    path: `/servicios/${slug}`,
  });
}

function MiniCTA({ href, label, text }: { href: string; label: string; text: string }) {
  return (
    <div className="mt-14 flex flex-col items-center gap-5 text-center">
      <p className="max-w-xl text-muted">{text}</p>
      <Button href={href} size="lg">
        {label}
      </Button>
    </div>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const service = getServiceData(locale as Locale, slug);

  if (!service) notFound();

  const serviceParam = service.slug.includes('web') ? 'web' : 'software';
  const contactHref = `/${locale}/contacto?servicio=${serviceParam}`;

  const relatedCases = getCaseStudies(locale as Locale).filter((c) =>
    c.services.includes(service.title)
  );
  const relatedCards = relatedCases.map((c) => ({
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
      <JsonLd
        data={getServiceSchema({
          name: service.title,
          description: service.metaDescription,
          url: `${SITE_URL}/${locale}/servicios/${slug}`,
        })}
      />
      <JsonLd data={getFAQSchema(service.faqs)} />

      {/* Hero */}
      <section className="relative min-h-svh flex items-center overflow-hidden hero-gradient pb-24 pt-32">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="orb orb-violet-1 float-slow" />
          <div className="orb orb-cyan-1 float-delayed" />
          <div className="orb orb-violet-2 float-slow-reverse" />
          <div className="orb orb-cyan-2 float-delayed-2" />
          <div className="orb orb-violet-3 float-slow" />
          <div className="orb orb-cyan-3 float-delayed" />
        </div>
        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {service.heroTitle}
              {service.heroTitleHighlight && (
                <>
                  <br />
                  <span className="gradient-text">{service.heroTitleHighlight}</span>
                </>
              )}
            </h1>
            {service.heroSubtitle && (
              <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">{service.heroSubtitle}</p>
            )}
            <div className="mt-8">
              <Button href={contactHref} size="lg">
                {service.cta ?? dict.nav.cta}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <LogosBar dict={dict} />

      {/* Features */}
      <Section>
        <SectionHeader
          title={service.featuresTitle ?? (locale === 'en' ? 'What we offer' : locale === 'ca' ? 'Què oferim' : 'Qué ofrecemos')}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((f, i) => (
            <GlowCard key={i} color={i % 2 === 0 ? 'violet' : 'cyan'} delay={i * 0.1}>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted">{f.description}</p>
            </GlowCard>
          ))}
        </div>

        <MiniCTA
          href={contactHref}
          label={service.cta ?? dict.nav.cta}
          text={
            locale === 'en'
              ? 'Sounds like what you need? Tell us about your project.'
              : locale === 'ca'
                ? "T'encaixa? Explica'ns el teu projecte."
                : '¿Es justo lo que tu negocio necesita? Cuéntanos tu proyecto.'
          }
        />
      </Section>

      {/* How we work */}
      <Process dict={dict} />

      <Container className="-mt-8 pb-20 md:-mt-10 md:pb-28">
        <MiniCTA
          href={contactHref}
          label={locale === 'en' ? "Let's work together" : locale === 'ca' ? 'Treballem junts' : 'Trabajemos juntos'}
          text={
            locale === 'en'
              ? "Like how we work? Let's get started, no strings attached."
              : locale === 'ca'
                ? "T'agrada com treballem? Comencem, sense compromís."
                : '¿Te gusta cómo trabajamos? Empecemos, sin compromiso.'
          }
        />
      </Container>

      {/* Related case studies */}
      {relatedCards.length > 0 && (
        <CasesCarousel
          locale={locale as Locale}
          dict={dict}
          cases={relatedCards}
          layout={relatedCards.length <= 2 ? 'grid' : 'carousel'}
        />
      )}

      {/* FAQ */}
      <FAQ
        title={locale === 'en' ? 'Frequently asked questions' : locale === 'ca' ? 'Preguntes freqüents' : 'Preguntas frecuentes'}
        faqs={service.faqs}
      />

      <CTASection locale={locale as Locale} dict={dict} />
    </>
  );
}
