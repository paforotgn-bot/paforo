'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { fadeInUp, slideInLeft, slideInRight } from '@/lib/animations';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface AboutPreviewProps {
  locale: Locale;
  dict: Dictionary;
}

const cardAccents = [
  'border-t-violet',
  'border-t-cyan',
  'border-t-cyan',
  'border-t-violet',
];

export function AboutPreview({ locale, dict }: AboutPreviewProps) {
  return (
    <Section>
      <div className="grid gap-12 lg:gap-16 md:grid-cols-2 items-center">
        <motion.div
          initial={slideInLeft.initial}
          whileInView={slideInLeft.animate}
          viewport={{ once: true }}
          transition={slideInLeft.transition}
        >
          <div className="section-gradient-line mb-6" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.about.previewTitle}
          </h2>
          <p className="mt-4 text-lg text-foreground/70 leading-relaxed">
            {dict.about.previewText}
          </p>
          <div className="mt-8">
            <Button href={`/${locale}/nosotros`} variant="primary">
              {dict.about.previewCta} →
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={slideInRight.initial}
          whileInView={slideInRight.animate}
          viewport={{ once: true }}
          transition={slideInRight.transition}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            {dict.about.valuesItems.map((value, i) => (
              <div
                key={value.title}
                className={`rounded-xl border border-border border-t-2 ${cardAccents[i]} bg-card p-5 card-glow transition-all duration-300 hover:border-violet/25`}
              >
                <div className="mb-3 font-mono text-3xl font-bold gradient-text">
                  {['01', '02', '03', '04'][i]}
                </div>
                <h3 className="font-bold mb-1">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
