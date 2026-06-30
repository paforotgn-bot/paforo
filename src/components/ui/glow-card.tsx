'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'violet' | 'cyan';
  delay?: number;
}

export function GlowCard({ children, className, color = 'violet', delay = 0 }: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -6 }}
      className={cn(
        'group relative rounded-2xl border border-border bg-background p-6 transition-all duration-300',
        color === 'violet' && 'hover:border-violet/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]',
        color === 'cyan' && 'hover:border-cyan/30 hover:shadow-[0_8px_32px_rgba(8,145,178,0.12)]',
        className
      )}
    >
      {/* Top accent line */}
      <div
        className={cn(
          'absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          color === 'violet' && 'bg-gradient-to-r from-violet to-violet/50',
          color === 'cyan' && 'bg-gradient-to-r from-cyan to-cyan/50'
        )}
      />
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          color === 'violet' && 'bg-gradient-to-br from-violet/5 to-transparent',
          color === 'cyan' && 'bg-gradient-to-br from-cyan/5 to-transparent'
        )}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
