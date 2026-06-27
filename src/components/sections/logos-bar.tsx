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
  { name: 'ZEA L\'Batarrec', src: '/images/logos/zea-white.svg' },
  { name: 'Fontanet TGN', src: '/images/logos/fontanettgn.png' },
  { name: 'Neureduca', src: '/images/logos/neureduca.png' },
  { name: 'Rochnvibe', src: '/images/logos/rochnvibe.webp' },
];

export function LogosBar({ dict }: LogosBarProps) {
  return (
    <Section className="py-12 md:py-16 bg-foreground overflow-hidden">
      <motion.div
        initial={fadeInUp.initial}
        whileInView={fadeInUp.animate}
        viewport={{ once: true }}
        transition={fadeInUp.transition}
        className="text-center"
      >
        <p className="text-sm font-medium text-white/50 uppercase tracking-wider mb-10">
          {dict.logos.title}
        </p>
      </motion.div>

      <div className="relative">
        <div className="flex w-max animate-marquee items-center">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="relative mx-10 h-10 w-36 shrink-0 opacity-60 hover:opacity-100 brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300"
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
      </div>
    </Section>
  );
}
