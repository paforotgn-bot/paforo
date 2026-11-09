import { generatePageMetadata } from '@/lib/seo/metadata';
import { WorkIndex } from '@/components/work/work-index';
import { LogoMarquee } from '@/components/sections/logo-marquee';
import { getProjects } from '@/lib/content/projects';
import { getShots } from '@/lib/content/media';
import { COPY } from '@/content/copy';
import { type Locale } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  return generatePageMetadata({
    title: `Paforo — ${COPY.hero.line1[l]} ${COPY.hero.line2[l]}`,
    description: COPY.hero.lede[l],
    locale: l,
    path: '',
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const projects = getProjects();

  // Al pasar el ratón sólo se ve la portada: la primera pieza de cada
  // proyecto. El resto vive dentro de su ficha.
  const covers = Object.fromEntries(
    projects.map((p) => [p.slug, getShots(p.slug)[0]])
  );

  return (
    <>
      {/* Hero: una frase, grande, y nada más. Sin botones ni badge. */}
      <section className="flex min-h-svh flex-col justify-end px-5 pb-14 pt-32 md:px-10 md:pb-20">
        <h1 className="display max-w-[18ch]">
          <span className="rise block" style={{ animationDelay: '0.05s' }}>
            {COPY.hero.line1[l]}
          </span>
          <span
            className="rise block text-dim"
            style={{ animationDelay: '0.18s' }}
          >
            {COPY.hero.line2[l]}
          </span>
        </h1>

        {/* Banda de clientes: la prueba de que esto existe fuera de la web. */}
        <div className="rise -mx-5 mt-16 md:-mx-10 md:mt-20" style={{ animationDelay: '0.32s' }}>
          <LogoMarquee />
        </div>
      </section>

      {/* Índice de trabajo: el plato fuerte. */}
      <section id="trabajo" className="px-5 pb-24 md:px-10 md:pb-32">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="label">{COPY.work.title[l]}</h2>
          <p className="label hidden md:block">{COPY.work.note[l]}</p>
        </div>

        <WorkIndex projects={projects} locale={l} covers={covers} />
      </section>

    </>
  );
}
