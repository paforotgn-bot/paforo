'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { fadeInUp } from '@/lib/animations';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface CTASectionProps {
  locale: Locale;
  dict: Dictionary;
}

export function CTASection({ locale, dict }: CTASectionProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-foreground">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan/15 rounded-full blur-[100px]" />
      </div>

      <Section className="py-0 md:py-0 relative z-10">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          viewport={{ once: true }}
          transition={fadeInUp.transition}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
            {dict.cta.title}
          </h2>
          <p className="mt-4 text-lg text-white/60">{dict.cta.subtitle}</p>
          <div className="mt-10">
            <Button href={`/${locale}/contacto`} size="lg" className="cta-glow">
              {dict.cta.button}
            </Button>
          </div>
        </motion.div>
      </Section>
    </section>
  );
}
