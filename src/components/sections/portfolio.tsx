'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/section';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { Dictionary } from '@/types';

interface PortfolioProps {
  dict: Dictionary;
}

const projects = [
  {
    name: 'Limboo Beach Club',
    tag: 'Restaurante & eventos',
    url: 'https://www.limboobeachclub.com/',
    image: '/images/portfolio/limboo.png',
    objectPosition: 'object-[center_75%]',
  },
  {
    name: 'Fontanet Medicina i Fisioterapia',
    tag: 'Clínica',
    url: 'https://fontanettgn.es/',
    image: '/images/portfolio/fontanettgn.avif',
  },
  {
    name: 'ZEA L\'Batarrec',
    tag: 'Zona esportiva',
    url: 'https://zealbatarrec.com/',
    image: '/images/portfolio/zealbatarrec.jpg',
  },
];

export function Portfolio({ dict }: PortfolioProps) {
  return (
    <Section className="bg-section">
      <SectionHeader title={dict.portfolio.title} subtitle={dict.portfolio.subtitle} />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <motion.a
            key={project.name}
            variants={fadeInUp}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6 }}
            className="group block overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:border-violet/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className={`object-cover ${project.objectPosition ?? 'object-top'} transition-transform duration-500 group-hover:scale-105`}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <div className="flex items-center justify-between gap-4 p-6">
              <div>
                <h3 className="font-bold leading-tight">{project.name}</h3>
                <p className="mt-1 text-sm text-muted">{project.tag}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-violet">
                {dict.portfolio.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </Section>
  );
}
