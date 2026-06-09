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

export function AboutPreview({ locale, dict }: AboutPreviewProps) {
  return (
    <Section className="bg-section">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <motion.div
          initial={slideInLeft.initial}
          whileInView={slideInLeft.animate}
          viewport={{ once: true }}
          transition={slideInLeft.transition}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.about.previewTitle}
          </h2>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            {dict.about.previewText}
          </p>
          <div className="mt-8">
            <Button href={`/${locale}/nosotros`} variant="secondary">
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
                className="rounded-xl border border-border bg-white p-5"
              >
                <div className="mb-2 text-2xl font-bold gradient-text">
                  {['01', '02', '03', '04'][i]}
                </div>
                <h3 className="font-semibold mb-1">{value.title}</h3>
                <p className="text-sm text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
