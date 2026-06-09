'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { GlowCard } from '@/components/ui/glow-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { staggerContainer } from '@/lib/animations';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface CasesShowcaseProps {
  locale: Locale;
  dict: Dictionary;
}

const featuredCases = [
  {
    slug: 'buzon-voz-ia',
    title: 'Buzón de voz con IA',
    client: 'Clínica de fisioterapia',
    services: ['Automatizaciones', 'IA'],
    results: [
      { label: 'Llamadas recuperadas', value: '+20/día' },
      { label: 'Horas ahorradas', value: '2h/día' },
    ],
  },
  {
    slug: 'formulario-inscripciones',
    title: 'Formulario de inscripciones online',
    client: 'Asociación deportiva',
    services: ['Desarrollo Web', 'Automatizaciones'],
    results: [
      { label: 'Papeleo eliminado', value: '100%' },
      { label: 'Tiempo de gestión', value: '-80%' },
    ],
  },
];

export function CasesShowcase({ locale, dict }: CasesShowcaseProps) {
  return (
    <Section className="bg-section">
      <SectionHeader title={dict.cases.title} subtitle={dict.cases.subtitle} />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {featuredCases.map((c, i) => (
          <Link key={c.client} href={`/${locale}/casos/${c.slug}`}>
            <GlowCard color={i % 2 === 0 ? 'violet' : 'cyan'} delay={i * 0.15}>
              <div className="flex flex-wrap gap-2 mb-4">
                {c.services.map((s) => (
                  <Badge key={s} variant="violet">{s}</Badge>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-1">{c.title}</h3>
              <p className="text-sm text-muted mb-6">{c.client}</p>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mb-6">
                {c.results.map((r) => (
                  <div key={r.label}>
                    <p className="font-mono text-2xl font-bold gradient-text">{r.value}</p>
                    <p className="text-xs text-muted mt-1">{r.label}</p>
                  </div>
                ))}
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet hover:underline transition-colors">
                {dict.cases.cta} →
              </span>
            </GlowCard>
          </Link>
        ))}
      </motion.div>

      <div className="mt-12 text-center">
        <Button href={`/${locale}/casos`} variant="secondary">
          {dict.cases.viewAll} →
        </Button>
      </div>
    </Section>
  );
}
