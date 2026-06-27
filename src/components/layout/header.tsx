'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { MobileNav } from './mobile-nav';
import { SERVICES } from '@/lib/constants';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

const serviceKeys = ['web', 'software', 'automation'] as const;

export function Header({ locale, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: `/${locale}/casos`, label: dict.nav.cases },
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
              ? 'border-black/10 bg-white/70 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150'
              : 'border-white/60 bg-white/45 py-3 shadow-md shadow-black/5 backdrop-blur-md backdrop-saturate-150'
          )}
        >
          <Link href={`/${locale}`} className="text-xl font-bold tracking-tight">
            paforo
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {/* Services dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                onMouseEnter={() => setServicesOpen(true)}
                className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground',
                  pathname.startsWith(`/${locale}/servicios`) ? 'text-foreground' : 'text-muted'
                )}
              >
                {dict.nav.services}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={cn('transition-transform duration-200', servicesOpen && 'rotate-180')}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {servicesOpen && (
                <div
                  onMouseLeave={() => setServicesOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-xl border border-border bg-background shadow-lg p-2"
                >
                  <Link
                    href={`/${locale}/servicios`}
                    onClick={() => setServicesOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-foreground rounded-lg hover:bg-elevated transition-colors"
                  >
                    {dict.nav.services}
                  </Link>
                  <div className="my-1 border-t border-border" />
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setServicesOpen(false)}
                      className={cn(
                        'block px-3 py-2 text-sm rounded-lg transition-colors',
                        pathname === item.href
                          ? 'text-violet font-medium bg-violet/5'
                          : 'text-muted hover:text-foreground hover:bg-elevated'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => (
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
            <LanguageSwitcher />
            <Button href={`/${locale}/contacto`} size="sm">
              {dict.nav.cta}
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
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
