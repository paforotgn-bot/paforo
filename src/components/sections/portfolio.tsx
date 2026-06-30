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
    tag: 'Carta digital premium, reservas online y gestión de eventos.',
    url: 'https://www.limboobeachclub.com/',
    image: '/images/portfolio/limboo.png',
    objectPosition: 'object-[center_65%]',
  },
  {
    name: 'Fontanet Medicina i Fisioterapia',
    tag: 'Web extensa con muchas de sus páginas posicionadas en las primeras posiciones de Google.',
    url: 'https://fontanettgn.es/',
    image: '/images/portfolio/fontanet.avif',
  },
  {
    name: 'Zona Esportiva Albatarrec',
    tag: 'Pasarela de pago integrada que simplifica la gestión administrativa y aumenta las inscripciones.',
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
            className="group block"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 group-hover:border-violet/30 group-hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className={`object-cover ${project.objectPosition ?? 'object-top'} transition-transform duration-500 group-hover:scale-105`}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <div className="mt-4">
              <h3 className="font-bold leading-tight">{project.name}</h3>
              <p className="mt-1 text-sm text-muted">{project.tag}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </Section>
  );
}
