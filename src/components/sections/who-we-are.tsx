'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { fadeInUp } from '@/lib/animations';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface WhoWeAreProps {
  locale: Locale;
  dict: Dictionary;
}

export function WhoWeAre({ locale, dict }: WhoWeAreProps) {
  return (
    <Section>
      <motion.div
        initial={fadeInUp.initial}
        whileInView={fadeInUp.animate}
        viewport={{ once: true }}
        transition={fadeInUp.transition}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {dict.whoWeAre.title}
        </h2>
        <p className="mt-6 text-lg text-muted leading-relaxed">
          {dict.whoWeAre.text}
        </p>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          {dict.whoWeAre.text2}
        </p>
        <div className="mt-8">
          <Button href={`/${locale}/nosotros`} variant="secondary">
            {dict.whoWeAre.cta} →
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
