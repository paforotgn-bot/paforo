'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { fadeInUp } from '@/lib/animations';
import type { Dictionary } from '@/types';

interface LogosBarProps {
  dict: Dictionary;
}

const logos = [
  { name: 'Limboo Beach Club', src: '/images/logos/limboo.png' },
  { name: 'SansSens', src: '/images/logos/sanssens.png' },
  { name: 'Oravia Travel Group', src: '/images/logos/oravia.png' },
  { name: 'ZEA L\'Batarrec', src: '/images/logos/zealbatarrec.svg' },
  { name: 'Fontanet TGN', src: '/images/logos/fontanettgn.png' },
  { name: 'Neureduca', src: '/images/logos/neureduca.png' },
  { name: 'Rochnvibe', src: '/images/logos/rochnvibe.webp' },
];

export function LogosBar({ dict }: LogosBarProps) {
  return (
    <Section className="py-12 md:py-16 border-b border-border">
      <motion.div
        initial={fadeInUp.initial}
        whileInView={fadeInUp.animate}
        viewport={{ once: true }}
        transition={fadeInUp.transition}
        className="text-center"
      >
        <p className="text-sm font-medium text-muted uppercase tracking-wider mb-10">
          {dict.logos.title}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="relative h-8 w-28 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
