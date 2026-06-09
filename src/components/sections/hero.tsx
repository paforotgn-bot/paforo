'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

const badgePrefix: Record<string, string> = {
  es: 'Agencia digital',
  en: 'Digital agency',
  ca: 'Agència digital',
};

const badgeLocations = ['en Tarragona', 'Worldwide'];

export function Hero({ locale, dict }: HeroProps) {
  const [index, setIndex] = useState(0);
  const prefix = badgePrefix[locale] || badgePrefix.es;

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count >= 4) {
        clearInterval(interval);
        return;
      }
      setIndex((prev) => (prev + 1) % badgeLocations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Dot grid background */}
      <div className="absolute inset-0 bg-grid" />

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="orb orb-violet-1 float-slow" />
        <div className="orb orb-cyan-1 float-delayed" />
        <div className="orb orb-violet-2 float-slow-reverse" />
        <div className="orb orb-cyan-2 float-delayed-2" />
        <div className="orb orb-violet-3 float-slow" />
        <div className="orb orb-cyan-3 float-delayed" />
      </div>


      {/* Content */}
      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="violet" className="gap-1.5 text-base">
              <span>{prefix}</span>
              <span className="relative inline-flex items-center overflow-hidden" style={{ width: '6.5em', height: '1.2em' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={badgeLocations[index]}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 font-bold whitespace-nowrap"
                  >
                    {badgeLocations[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {dict.hero.title}{' '}
            <span className="gradient-text">{dict.hero.titleHighlight}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg text-muted max-w-2xl mx-auto md:text-xl"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button href={`/${locale}/servicios`} size="lg" className="cta-glow">
              {dict.hero.cta1}
            </Button>
            <Button href={`/${locale}/contacto`} variant="secondary" size="lg">
              {dict.hero.cta2}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
