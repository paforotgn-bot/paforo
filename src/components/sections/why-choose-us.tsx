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
    <Section className="overflow-hidden">
      <SectionHeader
        title={dict.about.iaTitle}
        subtitle={dict.about.iaSubtitle}
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="mx-auto max-w-4xl space-y-5"
      >
        {dict.about.iaItems.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-4 md:gap-6"
          >
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 flex items-center">
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                <span className="block text-xs uppercase tracking-wider text-red-500 dark:text-red-400/60 mb-1 font-semibold">Antes</span>
                {item.before}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold gradient-text">→</span>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 flex items-center">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                <span className="block text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400/60 mb-1 font-semibold">Hoy</span>
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
        className="mx-auto max-w-2xl text-center text-muted mt-12 leading-relaxed"
      >
        {dict.about.iaClosing}
      </motion.p>
    </Section>
  );
}
