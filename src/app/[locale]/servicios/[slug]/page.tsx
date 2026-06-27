import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getServiceData, getAllServiceSlugs } from '@/lib/content/services';
import { getCaseStudies } from '@/lib/content/cases';
import { getServiceSchema, getFAQSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlowCard } from '@/components/ui/glow-card';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { FAQ } from '@/components/sections/faq';
import { CTASection } from '@/components/sections/cta-section';
import { SITE_URL, SERVICES } from '@/lib/constants';
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

function getServiceImage(slug: string): string | undefined {
  return SERVICES.find((s) =>
    (Object.values(s.slug) as string[]).includes(slug)
  )?.image;
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const service = getServiceData(locale as Locale, slug);

  if (!service) notFound();

  const serviceImage = getServiceImage(slug);
  const relatedCases = getCaseStudies(locale as Locale).filter((c) =>
    c.services.includes(service.title)
  );

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
      <AuroraBackground className="aurora-soft py-20 md:py-28">
        <Container>
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: `/${locale}` },
              { label: dict.nav.services, href: `/${locale}/servicios` },
              { label: service.title, href: `/${locale}/servicios/${slug}` },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {service.heroTitle}
              </h1>
              <p className="mt-4 text-lg text-muted max-w-2xl">{service.heroSubtitle}</p>
              <div className="mt-8">
                <Button href={`/${locale}/contacto`} size="lg">
                  {dict.nav.cta}
                </Button>
              </div>
            </div>
            {serviceImage && (
              <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
                <Image
                  src={serviceImage}
                  alt={service.heroTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>
        </Container>
      </AuroraBackground>

      {/* Features */}
      <Section>
        <SectionHeader
          title={locale === 'en' ? 'What we offer' : locale === 'ca' ? 'Què oferim' : 'Qué ofrecemos'}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((f, i) => (
            <GlowCard key={i} color={i % 2 === 0 ? 'violet' : 'cyan'} delay={i * 0.1}>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted">{f.description}</p>
            </GlowCard>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section className="bg-section">
        <SectionHeader
          title={locale === 'en' ? 'Why us and not another agency' : locale === 'ca' ? 'Per què nosaltres i no una altra agència' : 'Por qué nosotros y no otra agencia'}
        />
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p className="text-center text-sm font-semibold text-red-500 uppercase tracking-wide">
              {locale === 'en' ? 'Others' : locale === 'ca' ? 'Altres' : 'Otros'}
            </p>
            <p className="text-center text-sm font-semibold text-emerald-600 uppercase tracking-wide">Paforo</p>
          </div>
          {service.benefits.map((b, i) => (
            <div key={i} className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
                <span className="text-red-500 shrink-0">✗</span>
                <span className="text-sm text-red-700">{b.bad}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <span className="text-emerald-600 shrink-0">✓</span>
                <span className="text-sm text-emerald-800">{b.good}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Related case studies */}
      {relatedCases.length > 0 && (
        <Section>
          <SectionHeader title={dict.cases.title} subtitle={dict.cases.subtitle} />
          <div className="grid gap-8 md:grid-cols-2">
            {relatedCases.map((c) => (
              <Link key={c.slug} href={`/${locale}/casos/${c.slug}`}>
                <Card className="h-full">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.services.map((s) => (
                      <Badge key={s} variant="violet">{s}</Badge>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted mb-6">{c.description}</p>
                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mb-6">
                    {c.results.slice(0, 2).map((r) => (
                      <div key={r.label}>
                        <p className="font-mono text-2xl font-bold gradient-text">{r.value}</p>
                        <p className="text-xs text-muted mt-1">{r.label}</p>
                      </div>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet hover:underline">
                    {dict.cases.cta} →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
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
