'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { SERVICES } from '@/lib/constants';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { href: string; label: string }[];
  locale: Locale;
  dict: Dictionary;
}

const serviceKeys = ['web', 'software', 'automation'] as const;

export function MobileNav({ isOpen, onClose, navItems, locale, dict }: MobileNavProps) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  const serviceItems = SERVICES.map((service, i) => ({
    href: `/${locale}/servicios/${service.slug[locale]}`,
    label: dict.services[serviceKeys[i]].title,
  }));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setServicesOpen(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white/98 backdrop-blur-sm md:hidden"
        >
          <div className="flex items-center justify-between px-4 py-5">
            <Link href={`/${locale}`} className="text-xl font-bold" onClick={onClose}>
              paforo
            </Link>
            <button onClick={onClose} className="p-2" aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-4 pt-8">
            {/* Services accordion */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0 }}
            >
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={cn(
                  'flex w-full items-center justify-between py-3 text-lg font-medium transition-colors',
                  pathname.startsWith(`/${locale}/servicios`) ? 'text-foreground' : 'text-muted'
                )}
              >
                {dict.nav.services}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={cn('transition-transform duration-200', servicesOpen && 'rotate-180')}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {serviceItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'block py-2 pl-4 text-sm transition-colors',
                          pathname === item.href ? 'text-violet font-medium' : 'text-muted'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Other nav items (excluding services since we handle it above) */}
            {navItems.filter(item => !item.href.includes('/servicios')).map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (i + 1) * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'block py-3 text-lg font-medium transition-colors',
                    pathname === item.href ? 'text-foreground' : 'text-muted'
                  )}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <div className="mt-8 flex flex-col gap-4">
              <LanguageSwitcher />
              <Button href={`/${locale}/contacto`} size="lg" className="w-full">
                {dict.nav.cta}
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
