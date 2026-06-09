'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Dictionary } from '@/types';

interface ProcessProps {
  dict: Dictionary;
}

const stepColors = [
  'from-violet/15 to-violet/5 border-violet/25',
  'from-cyan/15 to-cyan/5 border-cyan/25',
  'from-violet/15 to-violet/5 border-violet/25',
  'from-cyan/15 to-cyan/5 border-cyan/25',
];

const stepAccents = ['text-violet', 'text-cyan', 'text-violet', 'text-cyan'];

export function Process({ dict }: ProcessProps) {
  return (
    <Section>
      <SectionHeader title={dict.process.title} subtitle={dict.process.subtitle} />

      <div className="relative mx-auto max-w-4xl">
        {/* Vertical gradient line */}
        <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet via-cyan to-transparent hidden md:block" />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-6"
        >
          {dict.process.steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="relative flex gap-6 items-start"
            >
              {/* Step number */}
              <div
                className={`shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stepColors[i]} border font-mono text-lg font-bold ${stepAccents[i]} shadow-sm`}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:border-violet/25 hover:shadow-[0_4px_24px_rgba(124,58,237,0.06)]">
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
