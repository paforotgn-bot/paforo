'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'violet' | 'cyan';
  delay?: number;
}

export function GlowCard({ children, className, color = 'violet', delay = 0 }: GlowCardProps) {
  return (
    <motion.div
      {...fadeInUp}
      transition={{ ...fadeInUp.transition, delay }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative rounded-2xl border border-border bg-background p-6 transition-all duration-300',
        color === 'violet' && 'hover:border-violet/30 hover:shadow-[0_4px_24px_rgba(124,58,237,0.08)]',
        color === 'cyan' && 'hover:border-cyan/30 hover:shadow-[0_4px_24px_rgba(8,145,178,0.08)]',
        className
      )}
    >
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
