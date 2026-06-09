import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { CTASection } from '@/components/sections/cta-section';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: locale === 'en' ? 'About Us' : locale === 'ca' ? 'Sobre nosaltres' : 'Sobre nosotros',
    description: locale === 'en'
      ? 'Meet Paforo, a digital agency in Tarragona helping businesses grow with web development, custom software, automation and SEO.'
      : 'Conoce Paforo, una agencia digital en Tarragona que ayuda a empresas a crecer con desarrollo web, software a medida, automatización y SEO.',
    locale: locale as Locale,
    path: '/nosotros',
  });
}

export default async function NosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.about, href: `/${locale}/nosotros` },
          ]}
        />
      </Container>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.about.title}
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">{dict.about.subtitle}</p>
        </div>
      </Section>

      <Section className="bg-section">
        <SectionHeader title={dict.about.mission} />
        <p className="mx-auto max-w-3xl text-center text-lg text-muted leading-relaxed">
          {dict.about.missionText}
        </p>
      </Section>

      <Section>
        <SectionHeader title={dict.about.iaTitle} subtitle={dict.about.iaSubtitle} />
        <div className="mx-auto max-w-3xl space-y-4">
          {dict.about.iaItems.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700"><span className="text-red-400 mr-2">Antes:</span>{item.before}</p>
              </div>
              <span className="text-xl font-bold gradient-text">→</span>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm text-emerald-800"><span className="text-emerald-500 mr-2">Hoy:</span>{item.after}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-2xl text-center text-muted mt-10 leading-relaxed">
          {dict.about.iaClosing}
        </p>
      </Section>

      <Section className="bg-section">
        <SectionHeader title={dict.about.values} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.about.valuesItems.map((v, i) => (
            <Card key={i}>
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-muted">{v.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <CTASection locale={locale as Locale} dict={dict} />
    </>
  );
}
