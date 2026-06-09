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
    <Section>
      <SectionHeader title={title} subtitle={subtitle} />

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-white overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-5 text-left"
            >
              <span className="font-medium pr-4">{faq.question}</span>
              <span
                className={cn(
                  'text-muted transition-transform duration-200 shrink-0',
                  openIndex === i && 'rotate-45'
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
                  <p className="px-5 pb-5 text-sm text-muted leading-relaxed">
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
