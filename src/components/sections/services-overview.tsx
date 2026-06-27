'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { GlowCard } from '@/components/ui/glow-card';
import { Button } from '@/components/ui/button';
import { staggerContainer } from '@/lib/animations';
import { SERVICES } from '@/lib/constants';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface ServicesOverviewProps {
  locale: Locale;
  dict: Dictionary;
}

const serviceKeys = ['web', 'software', 'automation'] as const;

export function ServicesOverview({ locale, dict }: ServicesOverviewProps) {
  return (
    <Section id="servicios">
      <SectionHeader title={dict.services.title} subtitle={dict.services.subtitle} />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SERVICES.map((service, i) => {
          const key = serviceKeys[i];
          const content = dict.services[key];
          return (
            <GlowCard key={key} color={service.color} delay={i * 0.1}>
              <div className="relative w-full h-36 -mt-2 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={service.image}
                  alt={content.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{content.title}</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">{content.description}</p>
              <Button
                href={`/${locale}/servicios/${service.slug[locale]}`}
                variant="ghost"
                size="sm"
              >
                {dict.services.cta} →
              </Button>
            </GlowCard>
          );
        })}
      </motion.div>
    </Section>
  );
}
