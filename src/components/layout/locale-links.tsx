'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, type Locale } from '@/lib/constants';

/**
 * Cambia de idioma sin salir de la página. Enlazar a `/${code}` a secas
 * devolvía a la home desde cualquier ficha de proyecto.
 */
export function LocaleLinks({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;

  const swap = (code: Locale) => {
    const segments = pathname.split('/');
    // ['', 'es', 'trabajo', 'arqvs'] → sólo cambia el segmento de idioma.
    if (LOCALES.includes(segments[1] as Locale)) {
      segments[1] = code;
      return segments.join('/');
    }
    return `/${code}`;
  };

  return (
    <span className="label flex gap-2 !text-dim">
      {LOCALES.map((code) => (
        <Link
          key={code}
          href={swap(code)}
          hrefLang={code}
          className={code === locale ? '!text-paper' : 'hover:!text-paper'}
        >
          {code}
        </Link>
      ))}
    </span>
  );
}
