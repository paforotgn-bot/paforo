'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MobileNav } from './mobile-nav';
import { SERVICES } from '@/lib/constants';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

const serviceKeys = ['web', 'software'] as const;

export function Header({ locale, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: `/${locale}#casos`, label: dict.nav.cases },
  ];

  const serviceItems = SERVICES.map((service, i) => ({
    href: `/${locale}/servicios/${service.slug[locale]}`,
    label: dict.services[serviceKeys[i]].title,
  }));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:pt-4">
        <div
          className={cn(
            'mx-auto flex max-w-5xl items-center justify-between rounded-full border px-5 md:px-7 transition-all duration-300',
            scrolled
              ? 'border-black/10 bg-white/70 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-[#14141f]/70'
              : 'border-white/60 bg-white/45 py-3 shadow-md shadow-black/5 backdrop-blur-md backdrop-saturate-150 dark:border-white/10 dark:bg-[#14141f]/50'
          )}
        >
          <Link href={`/${locale}`} className="text-xl font-bold tracking-tight">
            paforo
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[...serviceItems, ...navItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  pathname === item.href ? 'text-foreground' : 'text-muted'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button href={`/${locale}/contacto`} size="sm">
              {dict.nav.cta}
            </Button>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-foreground"
              aria-label="Open menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        locale={locale}
        dict={dict}
      />
    </>
  );
}
