import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { SITE_NAME } from '@/lib/constants';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const companyLinks = [
    { href: `/${locale}/servicios/desarrollo-web`, label: dict.services.web.title },
    { href: `/${locale}/servicios/desarrollo-software`, label: dict.services.software.title },
    { href: `/${locale}#casos`, label: dict.nav.cases },
    { href: `/${locale}/contacto`, label: dict.nav.contact },
  ];

  return (
    <footer className="border-t border-border bg-section">
      <Container className="py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="md:max-w-xs">
            <Link href={`/${locale}`} className="text-xl font-bold">
              paforo
            </Link>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              {dict.footer.description}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 sm:gap-20 lg:gap-28">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {dict.footer.company}
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {dict.footer.legal}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href={`/${locale}/privacidad`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terminos`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {dict.footer.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {dict.footer.cookies}
                </Link>
              </li>
            </ul>
          </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}. {dict.footer.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
