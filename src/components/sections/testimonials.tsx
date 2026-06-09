'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import type { Dictionary, Testimonial } from '@/types';

interface TestimonialsProps {
  dict: Dictionary;
}

const testimonials: Testimonial[] = [
  {
    name: 'María García',
    role: 'CEO',
    company: 'ModaStyle',
    quote: 'Paforo transformó nuestra presencia online. En 6 meses triplicamos nuestro tráfico orgánico y las ventas crecieron un 180%.',
  },
  {
    name: 'Carlos Ruiz',
    role: 'CTO',
    company: 'GestPro',
    quote: 'El software que desarrollaron automatizó el 65% de nuestros procesos manuales. La inversión se recuperó en 3 meses.',
  },
  {
    name: 'Ana Martínez',
    role: 'Propietaria',
    company: 'La Boquería Digital',
    quote: 'Gracias al GEO de Paforo, nuestro restaurante aparece cuando la gente pregunta a ChatGPT o Google AI por dónde comer en Tarragona. Los clientes llegan por canales que antes ni existían.',
  },
];

export function Testimonials({ dict }: TestimonialsProps) {
  return (
    <Section className="bg-section">
      <SectionHeader title={dict.testimonials.title} subtitle={dict.testimonials.subtitle} />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-8 md:grid-cols-3"
      >
        {testimonials.map((t, i) => (
          <motion.div key={t.name} variants={fadeInUp}>
            <Card className="h-full flex flex-col">
              <div className="flex-1">
                <div className="text-violet text-3xl mb-4">&ldquo;</div>
                <p className="text-sm leading-relaxed text-muted">{t.quote}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted">
                  {t.role}, {t.company}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
