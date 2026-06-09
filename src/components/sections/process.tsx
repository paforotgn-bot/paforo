'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Dictionary } from '@/types';

interface ProcessProps {
  dict: Dictionary;
}

const stepColors = [
  'from-violet/10 to-violet/5 border-violet/20',
  'from-cyan/10 to-cyan/5 border-cyan/20',
  'from-violet/10 to-violet/5 border-violet/20',
  'from-cyan/10 to-cyan/5 border-cyan/20',
];

const stepAccents = ['text-violet', 'text-cyan', 'text-violet', 'text-cyan'];

export function Process({ dict }: ProcessProps) {
  return (
    <Section>
      <SectionHeader title={dict.process.title} subtitle={dict.process.subtitle} />

      <div className="relative mx-auto max-w-4xl">
        {/* Vertical line connector */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet/20 via-cyan/20 to-transparent hidden md:block" />

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
                className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stepColors[i]} border font-mono text-sm font-bold ${stepAccents[i]}`}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:border-violet/20 hover:shadow-sm">
                <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
