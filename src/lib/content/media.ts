import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'public/images/work');

export type Shot = {
  /** Ruta pública, lista para <Image src> o <video src>. */
  src: string;
  w: number;
  h: number;
  kind: 'image' | 'video';
  /** Sólo en vídeos: primer fotograma, para no ver negro mientras carga. */
  poster?: string;
};

/** Apaisada: manda en cómo se maqueta la galería. */
export const isLandscape = (shot: Shot) => shot.w >= shot.h;

type Entry = {
  src: string;
  w: number;
  h: number;
  kind?: 'image' | 'video';
  poster?: string;
};

/**
 * Lee las piezas de un proyecto y sus dimensiones del manifest que escribe
 * scripts/import-media.mjs. Sin las dimensiones no se puede maquetar sin
 * recortar: las capturas de móvil son verticales y las de escritorio no.
 * Sólo servidor.
 */
export function getShots(slug: string): Shot[] {
  const file = path.join(ROOT, slug, 'manifest.json');
  if (!fs.existsSync(file)) return [];

  try {
    const entries = JSON.parse(fs.readFileSync(file, 'utf-8')) as Entry[];
    const base = `/images/work/${slug}`;

    return entries.map((entry) => ({
      w: entry.w,
      h: entry.h,
      kind: entry.kind ?? 'image',
      src: `${base}/${entry.src}`,
      ...(entry.poster ? { poster: `${base}/${entry.poster}` } : {}),
    }));
  } catch {
    return [];
  }
}

export function getAllShots(slugs: string[]): Record<string, Shot[]> {
  return Object.fromEntries(slugs.map((slug) => [slug, getShots(slug)]));
}

/**
 * Reparte las piezas en columnas equilibradas por altura.
 *
 * Las columnas CSS (`columns-3`) dejan huecos enormes cuando las piezas son
 * muy distintas de alto. Como aquí se conocen las proporciones, cada pieza va
 * a la columna que en ese momento está más corta.
 */
export function columnCountFor(total: number): number {
  // Con cuatro piezas y tres columnas siempre sobra una columna a medias.
  // El reparto sólo queda limpio si hay al menos dos piezas por columna.
  if (total >= 6) return 3;
  if (total >= 3) return 2;
  return 1;
}

export function balanceColumns(shots: Shot[], count: number): Shot[][] {
  const columns: Shot[][] = Array.from({ length: count }, () => []);
  const heights = new Array<number>(count).fill(0);

  for (const shot of shots) {
    // Altura relativa suponiendo todas las columnas del mismo ancho.
    const ratio = shot.h / shot.w;
    let shortest = 0;
    for (let i = 1; i < count; i += 1) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    columns[shortest].push(shot);
    heights[shortest] += ratio;
  }

  return columns.filter((column) => column.length > 0);
}
