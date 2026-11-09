'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/content/projects';
import type { Shot } from '@/lib/content/media';
import type { Locale } from '@/lib/constants';
import { COPY } from '@/content/copy';

const PANEL_H = 280;
const PANEL_MIN_W = 150;
const PANEL_MAX_W = 460;

/** Ancho del panel para una portada, a partir de su proporción. */
const widthFor = (shot?: Shot) =>
  shot
    ? Math.round(Math.min(Math.max((PANEL_H * shot.w) / shot.h, PANEL_MIN_W), PANEL_MAX_W))
    : PANEL_MAX_W;

interface WorkIndexProps {
  projects: Project[];
  locale: Locale;
  /** La portada de cada proyecto, por slug. Es lo único que se ve al pasar. */
  covers: Record<string, Shot | undefined>;
}

export function WorkIndex({ projects, locale, covers }: WorkIndexProps) {
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  // En táctil no hay hover: al tocar una fila se abre la portada en un
  // pop-up con su enlace, en vez de meter una imagen bajo cada título.
  const [modal, setModal] = useState<number | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const videos = useRef(new Map<string, HTMLVideoElement>());
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  // El panel flotante sólo tiene sentido con ratón y sin reducción de
  // movimiento; en táctil cada fila enseña su portada dentro de la fila.
  useEffect(() => {
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setCanHover(pointer.matches && !motion.matches);
    update();
    pointer.addEventListener('change', update);
    motion.addEventListener('change', update);
    return () => {
      pointer.removeEventListener('change', update);
      motion.removeEventListener('change', update);
    };
  }, []);

  const activeProject = active !== null ? projects[active] : null;
  const activeSlug = activeProject?.slug;
  const activeCover = activeSlug ? covers[activeSlug] : undefined;

  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    if (modal === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [modal]);

  // Una portada puede ser un vídeo. Sólo se reproduce la de la fila activa;
  // las demás se paran y se rebobinan para que empiecen desde el principio.
  useEffect(() => {
    for (const [slug, video] of videos.current) {
      if (slug === activeSlug) {
        video.play().catch(() => {
          /* el navegador puede rechazar el autoplay; queda el póster */
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [activeSlug]);

  // Interpolación por frame: el panel persigue al cursor con un poco de
  // retardo. Con `transition` puro el movimiento se siente elástico y barato.
  useEffect(() => {
    if (!canHover || active === null) return;

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.14;
      current.current.y += (target.current.y - current.current.y) * 0.14;
      if (panelRef.current) {
        panelRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [canHover, active]);

  // Clamp para que el panel no se salga por los bordes de la ventana.
  const clamp = (event: React.MouseEvent) => ({
    x: Math.min(Math.max(event.clientX + 28, 12), window.innerWidth - PANEL_MAX_W - 12),
    y: Math.min(Math.max(event.clientY - PANEL_H / 2, 12), window.innerHeight - PANEL_H - 12),
  });

  const onMove = useCallback(
    (event: React.MouseEvent) => {
      if (!canHover) return;
      target.current = clamp(event);
    },
    [canHover]
  );

  const onEnterRow = (index: number, event: React.MouseEvent) => {
    if (!canHover) return;
    // Primera entrada: coloca el panel sin animar, si no llega volando
    // desde la esquina superior izquierda.
    if (active === null) {
      const at = clamp(event);
      current.current = at;
      target.current = at;
      if (panelRef.current) {
        panelRef.current.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
      }
    }
    setActive(index);
  };

  return (
    <div onMouseLeave={() => setActive(null)} onMouseMove={onMove}>
      <ul className="rule">
        {projects.map((project, index) => {
          const dimmed = active !== null && active !== index;

          return (
            <li key={project.slug} className="rule first:border-t-0">
              <Link
                href={`/${locale}/trabajo/${project.slug}`}
                onMouseEnter={(event) => onEnterRow(index, event)}
                onClick={(event) => {
                  if (canHover) return;
                  event.preventDefault();
                  setModal(index);
                }}
                className="group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 py-5 transition-opacity duration-300 md:grid-cols-[3rem_minmax(0,17rem)_minmax(0,12rem)_minmax(0,1fr)_auto] md:gap-x-8 md:py-7"
                style={{ opacity: dimmed ? 0.32 : 1 }}
              >
                <span className="label">{String(index + 1).padStart(2, '0')}</span>

                <span className="index-name col-start-2">{project.client}</span>

                {/* Qué es el cliente y qué le construí: dos datos distintos. */}
                <span className="label col-start-2 row-start-2 pt-2 !text-dim md:col-start-3 md:row-start-1 md:pt-0">
                  {project.sector[locale]}
                </span>

                <span className="label col-start-2 row-start-3 md:col-start-4 md:row-start-1">
                  {project.kind[locale]}
                </span>

                <span className="label col-start-3 row-start-1 justify-self-end whitespace-nowrap md:col-start-5">
                  <span className="tabular-nums">{project.year}</span>
                  {project.private ? (
                    <span className="ml-3 inline-block">{COPY.work.privateTag[locale]}</span>
                  ) : (
                    <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </span>

              </Link>
            </li>
          );
        })}
      </ul>

      {canHover && (
        <div
          ref={panelRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 overflow-hidden rounded-sm bg-ink-soft will-change-transform"
          style={{
            width: widthFor(activeCover),
            height: PANEL_H,
            opacity: activeCover ? 1 : 0,
            transition: 'opacity 300ms, width 280ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Todas las portadas montadas: el cambio de fila es instantáneo
              y no hay que esperar a que descargue nada. */}
          {projects.map((project) => {
            const cover = covers[project.slug];
            if (!cover) return null;
            const visible = project.slug === activeSlug;

            if (cover.kind === 'video') {
              return (
                <video
                  key={project.slug}
                  ref={(el) => {
                    if (el) videos.current.set(project.slug, el);
                    else videos.current.delete(project.slug);
                  }}
                  src={cover.src}
                  poster={cover.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  style={{ opacity: visible ? 1 : 0 }}
                />
              );
            }

            return (
              <Image
                key={project.slug}
                src={cover.src}
                alt=""
                fill
                sizes="460px"
                className="object-cover object-center"
                style={{ opacity: visible ? 1 : 0 }}
              />
            );
          })}
        </div>
      )}

      {modal !== null && (
        <ProjectSheet
          project={projects[modal]}
          cover={covers[projects[modal].slug]}
          locale={locale}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

/** Pop-up de móvil: la portada, el nombre y el enlace a la ficha. */
function ProjectSheet({
  project,
  cover,
  locale,
  onClose,
}: {
  project: Project;
  cover?: Shot;
  locale: Locale;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.client}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-ink px-5 py-8 md:hidden"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-sm flex-col gap-5"
      >
        <button type="button" onClick={onClose} className="label self-end">
          {COPY.work.close[locale]} ✕
        </button>

        {cover && (
          // Tope de altura: una portada casi 1:2 empujaba el botón fuera de
          // la pantalla y había que hacer scroll para verlo.
          <div className="flex justify-center overflow-hidden rounded-sm bg-ink-soft">
            {cover.kind === 'video' ? (
              <video
                src={cover.src}
                poster={cover.poster}
                autoPlay
                muted
                loop
                playsInline
                className="max-h-[52vh] w-auto"
              />
            ) : (
              <Image
                src={cover.src}
                alt=""
                width={cover.w}
                height={cover.h}
                sizes="90vw"
                className="max-h-[52vh] w-auto"
              />
            )}
          </div>
        )}

        <div>
          <p className="index-name">{project.client}</p>
          <p className="label mt-1 !text-dim">{project.sector[locale]}</p>
          <p className="label mt-0.5">{project.kind[locale]}</p>
        </div>

        <Link
          href={`/${locale}/trabajo/${project.slug}`}
          className="label flex items-center justify-between gap-4 bg-paper px-5 py-4 !text-ink"
        >
          {COPY.work.discover[locale]}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
