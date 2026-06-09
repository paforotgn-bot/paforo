'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { fadeInUp } from '@/lib/animations';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface CTASectionProps {
  locale: Locale;
  dict: Dictionary;
}

export function CTASection({ locale, dict }: CTASectionProps) {
  return (
    <AuroraBackground className="aurora-soft py-20 md:py-28">
      <Section className="py-0 md:py-0">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          viewport={{ once: true }}
          transition={fadeInUp.transition}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.cta.title}
          </h2>
          <p className="mt-4 text-lg text-muted">{dict.cta.subtitle}</p>
          <div className="mt-10">
            <Button href={`/${locale}/contacto`} size="lg">
              {dict.cta.button}
            </Button>
          </div>
        </motion.div>
      </Section>
    </AuroraBackground>
  );
}
