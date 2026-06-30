import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getCaseStudy, getCaseStudies } from '@/lib/content/cases';
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

  const coverMax =
    ({
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
    } as Record<string, string>)[c.coverWidth ?? '3xl'] ?? 'max-w-3xl';

  return (
    <>
      <Container className="pt-28 pb-20">
        <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            {c.services.filter((s) => !/automat/i.test(s)).map((s) => (
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

        {c.image && (() => {
          const cover = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={c.title} className="block w-full h-auto" />
              {c.url && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/70">
                  <span className="inline-flex translate-y-1 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {locale === 'en' ? 'Visit the website' : locale === 'ca' ? 'Visitar el web' : 'Visitar la web'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
                  </span>
                </div>
              )}
            </>
          );
          return c.url ? (
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative mx-auto mb-12 block ${coverMax} overflow-hidden rounded-2xl border border-border`}
            >
              {cover}
            </a>
          ) : (
            <div className={`relative mx-auto mb-12 ${coverMax} overflow-hidden rounded-2xl border border-border`}>
              {cover}
            </div>
          );
        })()}

        {(c.video || (c.images && c.images.length > 0)) ? (() => {
          const marker = /^## (Los resultados|The results|Els resultats|El resultado|El resultat)/m;
          const match = c.content.match(marker);
          const splitIndex = match?.index ?? c.content.length;
          const before = c.content.slice(0, splitIndex);
          const after = c.content.slice(splitIndex);
          return (
            <>
              <div className="prose prose-lg max-w-3xl prose-headings:text-foreground prose-p:text-muted prose-a:text-violet prose-strong:text-foreground">
                <MDXRemote source={before} />
              </div>

              {c.gallery === 'full' ? (
                <div className="my-12 mx-auto flex max-w-2xl flex-col items-center gap-8">
                  {c.images?.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img}
                      alt={`${c.title} - captura ${i + 1}`}
                      className="max-h-[420px] w-auto max-w-full rounded-2xl border border-border shadow-sm"
                    />
                  ))}
                </div>
              ) : (
                <div className="my-12 flex flex-wrap justify-center items-stretch gap-6">
                  {c.video && (
                    <div className="w-48 sm:w-56 rounded-2xl border border-border bg-white p-1.5 shadow-lg flex flex-col">
                      <video
                        src={c.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full rounded-xl"
                      />
                      <div className="flex-1 bg-white rounded-b-xl" />
                    </div>
                  )}
                  {c.images?.map((img, i) => (
                    <div key={i} className="w-48 sm:w-56 rounded-2xl border border-border bg-white p-1.5 shadow-lg flex flex-col">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${c.title} - captura ${i + 1}`}
                        className="w-full rounded-xl"
                      />
                      <div className="flex-1 bg-white rounded-b-xl" />
                    </div>
                  ))}
                </div>
              )}

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
        </div>
      </Container>
    </>
  );
}
