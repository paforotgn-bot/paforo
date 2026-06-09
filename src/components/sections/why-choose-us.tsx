'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Dictionary } from '@/types';

interface WhyChooseUsProps {
  dict: Dictionary;
}

export function WhyChooseUs({ dict }: WhyChooseUsProps) {
  return (
    <Section className="bg-section">
      <SectionHeader
        title={dict.about.iaTitle}
        subtitle={dict.about.iaSubtitle}
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="mx-auto max-w-3xl space-y-4"
      >
        {dict.about.iaItems.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-4"
          >
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                <span className="text-red-400 mr-2">Antes:</span>
                {item.before}
              </p>
            </div>
            <span className="text-xl font-bold gradient-text">→</span>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-800">
                <span className="text-emerald-500 mr-2">Hoy:</span>
                {item.after}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={fadeInUp.initial}
        whileInView={fadeInUp.animate}
        viewport={{ once: true }}
        transition={fadeInUp.transition}
        className="mx-auto max-w-2xl text-center text-muted mt-10 leading-relaxed"
      >
        {dict.about.iaClosing}
      </motion.p>
    </Section>
  );
}
