'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { GlowCard } from '@/components/ui/glow-card';
import { staggerContainer } from '@/lib/animations';
import { SERVICES } from '@/lib/constants';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

interface ServicesOverviewProps {
  locale: Locale;
  dict: Dictionary;
}

const serviceKeys = ['web', 'software'] as const;

export function ServicesOverview({ locale, dict }: ServicesOverviewProps) {
  return (
    <Section id="servicios">
      <SectionHeader title={dict.services.title} subtitle={dict.services.subtitle} />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-8 sm:grid-cols-2"
      >
        {SERVICES.map((service, i) => {
          const key = serviceKeys[i];
          const content = dict.services[key];
          return (
            <Link key={key} href={`/${locale}/servicios/${service.slug[locale]}`} className="block">
              <GlowCard color={service.color} delay={i * 0.1} className="h-full">
                <div className="relative w-full h-56 -mt-2 mb-5 rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={content.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{content.description}</p>
              </GlowCard>
            </Link>
          );
        })}
      </motion.div>
    </Section>
  );
}
