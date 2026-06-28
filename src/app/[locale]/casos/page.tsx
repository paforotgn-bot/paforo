import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getCaseStudies } from '@/lib/content/cases';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: locale === 'en' ? 'Case Studies' : locale === 'ca' ? "Casos d'èxit" : 'Casos de éxito',
    description: locale === 'en'
      ? 'Real results from real clients. Discover how we have helped businesses grow.'
      : 'Resultados reales de clientes reales. Descubre cómo hemos ayudado a empresas a crecer.',
    locale: locale as Locale,
    path: '/casos',
  });
}

export default async function CasosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const cases = getCaseStudies(locale as Locale);

  return (
    <>
      <Section>
        <SectionHeader title={dict.cases.title} subtitle={dict.cases.subtitle} />

        {cases.length === 0 ? (
          <p className="text-center text-muted">
            {locale === 'en' ? 'No case studies yet.' : 'Aún no hay casos de éxito.'}
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {cases.map((c) => (
              <Link key={c.slug} href={`/${locale}/casos/${c.slug}`}>
                <Card className="h-full">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.services.map((s) => (
                      <Badge key={s} variant="violet">{s}</Badge>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{c.title}</h2>
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
                    {locale === 'en' ? 'Discover how we did it →' : 'Descubre cómo lo hicimos →'}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
