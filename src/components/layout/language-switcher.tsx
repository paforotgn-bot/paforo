'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LOCALES, type Locale } from '@/lib/constants';
import { cn } from '@/lib/utils';

const localeLabels: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  ca: 'CA',
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = LOCALES.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  ) || 'es';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function getLocalizedPath(targetLocale: Locale) {
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    return segments.join('/');
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
        aria-label="Change language"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {localeLabels[currentLocale]}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-24 rounded-lg border border-border bg-white shadow-lg p-1">
          {LOCALES.map((locale) => (
            <Link
              key={locale}
              href={getLocalizedPath(locale)}
              onClick={() => setOpen(false)}
              className={cn(
                'block px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                locale === currentLocale
                  ? 'bg-violet text-white'
                  : 'text-muted hover:text-foreground hover:bg-elevated'
              )}
            >
              {localeLabels[locale]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
