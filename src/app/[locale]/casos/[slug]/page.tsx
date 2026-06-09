import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getCaseStudy, getCaseStudies } from '@/lib/content/cases';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/lib/constants';

export async function generateStaticParams() {
  const locales = ['es', 'en', 'ca'] as const;
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const cases = getCaseStudies(locale);
    for (const c of cases) {
      params.push({ locale, slug: c.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const c = getCaseStudy(locale as Locale, slug);
  if (!c) return {};

  return generatePageMetadata({
    title: c.title,
    description: c.description,
    locale: locale as Locale,
    path: `/casos/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const c = getCaseStudy(locale as Locale, slug);

  if (!c) notFound();

  return (
    <>
      <Container className="pt-8 pb-20">
        <Breadcrumbs
          items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.cases, href: `/${locale}/casos` },
            { label: c.client, href: `/${locale}/casos/${slug}` },
          ]}
        />

        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {c.services.map((s) => (
              <Badge key={s} variant="violet">{s}</Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {c.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{c.description}</p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {c.results.map((r) => (
              <div key={r.label} className="rounded-xl border border-border bg-section p-4 text-center">
                <p className="font-mono text-3xl font-bold gradient-text">{r.value}</p>
                <p className="text-xs text-muted mt-2">{r.label}</p>
              </div>
            ))}
          </div>
        </header>

        {c.image && (
          <div className="mb-12 overflow-hidden rounded-2xl border border-border">
            <Image
              src={c.image}
              alt={`Dashboard - ${c.title}`}
              width={1400}
              height={700}
              className="w-full h-auto"
            />
          </div>
        )}

        {c.images && c.images.length > 0 ? (() => {
          const marker = /^## (Los resultados|The results|Els resultats)/m;
          const match = c.content.match(marker);
          const splitIndex = match?.index ?? c.content.length;
          const before = c.content.slice(0, splitIndex);
          const after = c.content.slice(splitIndex);
          return (
            <>
              <div className="prose prose-lg max-w-3xl prose-headings:text-foreground prose-p:text-muted prose-a:text-violet prose-strong:text-foreground">
                <MDXRemote source={before} />
              </div>

              <div className="my-12 flex justify-center items-stretch gap-6">
                {c.images.map((img, i) => (
                  <div key={i} className="w-48 sm:w-56 rounded-2xl border border-border bg-white p-1.5 shadow-lg flex flex-col">
                    <img
                      src={img}
                      alt={`${c.title} - captura ${i + 1}`}
                      className="w-full rounded-xl"
                    />
                    <div className="flex-1 bg-white rounded-b-xl" />
                  </div>
                ))}
              </div>

              {after && (
                <div className="prose prose-lg max-w-3xl prose-headings:text-foreground prose-p:text-muted prose-a:text-violet prose-strong:text-foreground">
                  <MDXRemote source={after} />
                </div>
              )}
            </>
          );
        })() : (
          <div className="prose prose-lg max-w-3xl prose-headings:text-foreground prose-p:text-muted prose-a:text-violet prose-strong:text-foreground">
            <MDXRemote source={c.content} />
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-2xl font-bold mb-2">
            {locale === 'en' ? 'Need something like this?' : locale === 'ca' ? 'Necessites alguna cosa semblant?' : '¿Necesitas algo parecido?'}
          </p>
          <p className="text-muted mb-6">
            {locale === 'en' ? 'Tell us about your project and we\'ll find the best solution for you.' : locale === 'ca' ? 'Explica\'ns el teu projecte i trobarem la millor solució.' : 'Cuéntanos tu caso y buscamos la mejor solución para ti.'}
          </p>
          <Button href={`/${locale}/contacto`} size="lg">
            {dict.cta.button}
          </Button>
        </div>
      </Container>
    </>
  );
}
