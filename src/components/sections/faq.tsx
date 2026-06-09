'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { cn } from '@/lib/utils';

interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs: { question: string; answer: string }[];
}

export function FAQ({ title = 'Preguntas frecuentes', subtitle, faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section className="bg-section">
      <SectionHeader title={title} subtitle={subtitle} />

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={cn(
              'rounded-xl border bg-white overflow-hidden transition-all duration-300',
              openIndex === i
                ? 'border-violet/30 shadow-[0_4px_24px_rgba(124,58,237,0.08)]'
                : 'border-border hover:border-violet/20'
            )}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-5 text-left"
            >
              <span className="font-semibold pr-4">{faq.question}</span>
              <span
                className={cn(
                  'flex items-center justify-center h-7 w-7 rounded-full text-sm shrink-0 transition-all duration-200',
                  openIndex === i
                    ? 'bg-violet text-white rotate-45'
                    : 'bg-elevated text-muted'
                )}
              >
                +
              </span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="px-5 pb-5 text-foreground/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  );
}
