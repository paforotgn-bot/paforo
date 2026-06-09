import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'violet' | 'cyan';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium',
        variant === 'default' && 'bg-elevated text-foreground border border-border',
        variant === 'violet' && 'bg-violet/5 text-violet border border-violet/15',
        variant === 'cyan' && 'bg-cyan/5 text-cyan-dark border border-cyan/15',
        className
      )}
    >
      {children}
    </span>
  );
}
