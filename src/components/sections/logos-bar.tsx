'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { fadeInUp } from '@/lib/animations';
import type { Dictionary } from '@/types';

interface LogosBarProps {
  dict: Dictionary;
}

// scale fine-tunes optical size: stacked logos (mark + small text) read smaller
// at the same height, so they are nudged up to balance the row visually.
const logos = [
  { name: 'Limboo Beach Club', src: '/images/logos/limboo.png', scale: 1.7 },
  { name: 'Oravia Travel Group', src: '/images/logos/oravia.png', scale: 1.55 },
  { name: 'ZEA L\'Batarrec', src: '/images/logos/zea.png', scale: 1.0 },
  { name: 'DILEI', src: '/images/logos/dilei.png', scale: 1.0 },
  { name: 'Fontanet TGN', src: '/images/logos/fontanettgn.png', scale: 1.05 },
  { name: 'Neureduca', src: '/images/logos/neureduca.png', scale: 0.9 },
  { name: 'Rochnvibe', src: '/images/logos/rochnvibe.webp', scale: 0.9 },
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
        {/* Edge fade so logos slide in/out smoothly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-foreground to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-foreground to-transparent" />

        <div className="flex w-max animate-marquee items-center">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex h-20 shrink-0 items-center justify-center px-10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                style={{ height: `${logo.scale * 2.2}rem` }}
                className="w-auto max-w-[210px] object-contain opacity-70 brightness-0 invert transition-all duration-300 hover:opacity-100 hover:brightness-100 hover:invert-0"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
