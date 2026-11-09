import Link from 'next/link';
import { COPY } from '@/content/copy';
import { NAP } from '@/lib/constants';
import type { Locale } from '@/lib/constants';

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="rule px-5 py-10 md:px-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-baseline md:justify-between">
        <span className="label">
          © {new Date().getFullYear()} Paforo · {COPY.footer.rights[locale]}
        </span>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={`/${locale}/contacto`} className="label hover:!text-paper">
            {COPY.nav.contact[locale]}
          </Link>
          <Link href={`/${locale}/terminos`} className="label hover:!text-paper">
            {COPY.footer.legal[locale]}
          </Link>
          <Link href={`/${locale}/privacidad`} className="label hover:!text-paper">
            {COPY.footer.privacy[locale]}
          </Link>
          <Link href={`/${locale}/cookies`} className="label hover:!text-paper">
            {COPY.footer.cookies[locale]}
          </Link>
          <a href={`mailto:${NAP.email}`} className="label hover:!text-paper">
            {NAP.email}
          </a>
        </nav>
      </div>
    </footer>
  );
}
