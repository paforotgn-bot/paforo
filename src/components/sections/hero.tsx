'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

export function Hero({ locale, dict }: HeroProps) {
  return (
    <section className="relative min-h-svh flex items-center overflow-hidden hero-gradient">
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
          <motion.h1
            variants={fadeInUp}
            className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {dict.hero.title}
            <br />
            <span className="gradient-text">{dict.hero.titleHighlight}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg text-foreground/70 max-w-2xl mx-auto md:text-xl leading-relaxed"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button href={`/${locale}/contacto`} size="lg" className="cta-glow">
              {dict.hero.cta1}
            </Button>
            <Button href={`/${locale}#casos`} variant="secondary" size="lg">
              {dict.hero.cta2}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
