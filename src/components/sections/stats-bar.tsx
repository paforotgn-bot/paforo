'use client';

import { Section } from '@/components/ui/section';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import type { Dictionary } from '@/types';

interface StatsBarProps {
  dict: Dictionary;
}

export function StatsBar({ dict }: StatsBarProps) {
  const stats = [
    { end: 50, suffix: '+', label: dict.stats.projects },
    { end: 98, suffix: '%', label: dict.stats.satisfaction },
    { end: 300, suffix: '%', label: dict.stats.traffic },
    { end: 8, suffix: '+', label: dict.stats.experience },
  ];

  return (
    <Section className="py-16 md:py-20">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-border">
        {stats.map((stat) => (
          <AnimatedCounter key={stat.label} {...stat} />
        ))}
      </div>
    </Section>
  );
}
