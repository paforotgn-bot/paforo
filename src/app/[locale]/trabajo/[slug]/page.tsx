import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getProject, getProjects } from '@/lib/content/projects';
import { getShots, balanceColumns, columnCountFor, type Shot } from '@/lib/content/media';
import { COPY } from '@/content/copy';
import { LOCALES, type Locale } from '@/lib/constants';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getProjects().map((project) => ({ locale, slug: project.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const l = locale as Locale;
  return generatePageMetadata({
    title: `${project.client} — ${project.kind[l]}`,
    description: project.summary[l],
    locale: l,
    path: `/trabajo/${slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const l = locale as Locale;
  // La portada (la primera pieza) es sólo para el panel del índice: aquí
  // dentro no se repite.
  const [, ...rest] = getShots(slug);
  // Dos repartos: en móvil a dos columnas y en escritorio a tres. Se calculan
  // los dos porque el equilibrado depende de cuántas columnas haya; el que no
  // toca queda oculto y, al ser lazy, sus imágenes no llegan a descargarse.
  const columnsMobile = balanceColumns(rest, Math.min(2, columnCountFor(rest.length)));
  const columnsDesktop = balanceColumns(rest, columnCountFor(rest.length));

  return (
    <article>
      {/* Cabecera: el nombre grande y los metadatos en una fila mono. */}
      <header className="px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-44">
        <Link href={`/${l}#trabajo`} className="label hover:!text-paper">
          ← {COPY.work.title[l]}
        </Link>

        <h1 className="display mt-10 max-w-[14ch]">{project.client}</h1>

        <div className="rule mt-12 grid gap-y-6 pt-6 md:grid-cols-4 md:gap-8">
          <Meta term={COPY.project.sector[l]} value={project.sector[l]} />
          <Meta term={COPY.project.what[l]} value={project.kind[l]} />
          <Meta term={COPY.project.year[l]} value={project.year} />

          <div>
            <p className="label">{COPY.project.live[l]}</p>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="group mt-2 inline-flex items-baseline gap-2 text-paper transition-colors hover:text-accent"
              >
                {project.url.replace(/^https?:\/\//, '')}
                <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            ) : (
              <p className="mt-2 text-dim">{COPY.project.privateNote[l]}</p>
            )}
          </div>
        </div>
      </header>

      {/* El relato: reto y solución, sin tarjetas ni iconos. */}
      <section className="grid gap-10 px-5 py-20 md:grid-cols-[12rem_minmax(0,64ch)] md:gap-16 md:px-10 md:py-28">
        <h2 className="label md:pt-3">{COPY.project.challenge[l]}</h2>
        <div className="space-y-10">
          <p className="display-sm !text-[clamp(1.375rem,2.4vw,2rem)]">
            {project.challenge[l]}
          </p>

          <div>
            <p className="label mb-4">{COPY.project.solution[l]}</p>
            <p className="lede">{project.solution[l]}</p>
          </div>

          <ul className="rule">
            {project.highlights.map((item) => (
              <li key={item.es} className="rule flex gap-5 py-5 first:border-t-0">
                <span className="label shrink-0 pt-1">—</span>
                <span className="text-paper">{item[l]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* El resto: cada imagen en su proporción, sin recortes. */}
      {rest.length > 0 && (
        <section className="rule px-5 py-16 md:px-10 md:py-20">
          <h2 className="label mb-8">{COPY.project.screens[l]}</h2>

          {/* Columnas repartidas por altura en servidor, y ancho acotado:
              a sangre las capturas salían enormes. */}
          <div className="mx-auto max-w-5xl">
            <Mosaic
              columns={columnsMobile}
              client={project.client}
              sizes="45vw"
              className="flex gap-3 md:hidden"
            />
            <Mosaic
              columns={columnsDesktop}
              client={project.client}
              sizes="(min-width: 768px) 22rem, 45vw"
              className="hidden gap-4 md:flex"
            />
          </div>
        </section>
      )}

    </article>
  );
}

/** Las columnas ya equilibradas, una al lado de otra. */
function Mosaic({
  columns,
  client,
  sizes,
  className,
}: {
  columns: Shot[][];
  client: string;
  sizes: string;
  className: string;
}) {
  return (
    <div className={`items-start ${className}`}>
      {columns.map((column, c) => (
        <div key={c} className="flex flex-1 flex-col gap-3 md:gap-4">
          {column.map((shot, i) => (
            <Piece
              key={shot.src}
              shot={shot}
              alt={`${client} — ${c * columns.length + i + 2}`}
              sizes={sizes}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Una pieza de la galería: imagen o vídeo, siempre en su proporción real.
 * El vídeo va en bucle y sin sonido, como una imagen que se mueve: no lleva
 * controles porque no hay nada que controlar.
 */
function Piece({ shot, alt, sizes }: { shot: Shot; alt: string; sizes: string }) {
  if (shot.kind === 'video') {
    return (
      <video
        src={shot.src}
        poster={shot.poster}
        width={shot.w}
        height={shot.h}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className="h-auto w-full rounded-sm"
      />
    );
  }

  return (
    <Image
      src={shot.src}
      alt={alt}
      width={shot.w}
      height={shot.h}
      loading="lazy"
      sizes={sizes}
      className="h-auto w-full rounded-sm"
    />
  );
}

function Meta({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <p className="label">{term}</p>
      <p className="mt-2 text-paper">{value}</p>
    </div>
  );
}
