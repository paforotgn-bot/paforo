import Link from 'next/link';
import { COPY } from '@/content/copy';
import { type Locale } from '@/lib/constants';
import { LocaleLinks } from './locale-links';

export function Header({ locale }: { locale: Locale }) {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-5 py-5 md:px-10">
        <Link href={`/${locale}`} className="label !text-paper">
          Paforo
        </Link>

        <nav className="flex items-center gap-5 md:gap-7">
          <Link href={`/${locale}#trabajo`} className="label !text-paper">
            {COPY.nav.work[locale]}
          </Link>
          <Link href={`/${locale}/contacto`} className="label !text-paper">
            {COPY.nav.contact[locale]}
          </Link>

          <LocaleLinks locale={locale} />
        </nav>
      </div>
    </header>
  );
}
