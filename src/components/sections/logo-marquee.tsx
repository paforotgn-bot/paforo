import fs from 'fs';
import path from 'path';
import Image from 'next/image';

type Logo = { slug: string; src: string; w: number; h: number };

const DIR = path.join(process.cwd(), 'public/images/logos/marquee');

/** Normalizados por scripts/import-logos.mjs: todos a la misma altura. */
function getLogos(): Logo[] {
  const file = path.join(DIR, 'manifest.json');
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as Logo[];
  } catch {
    return [];
  }
}

export function LogoMarquee() {
  const logos = getLogos();
  if (logos.length < 3) return null;

  // La pista va duplicada: al desplazarse un 50% exacto, el segundo juego
  // queda donde empezaba el primero y el bucle no tiene costura.
  const track = [...logos, ...logos];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {track.map((logo, i) => (
          <Image
            key={`${logo.slug}-${i}`}
            src={`/images/logos/marquee/${logo.src}`}
            alt=""
            width={logo.w}
            height={logo.h}
            // brightness-0 + invert: todos a blanco, venga el original como venga.
            className="h-7 w-auto brightness-0 invert opacity-40 md:h-9"
          />
        ))}
      </div>
    </div>
  );
}
