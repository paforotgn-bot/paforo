import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-background p-6',
        hover && 'card-glow transition-all duration-300 hover:border-violet/25',
        className
      )}
    >
      {children}
    </div>
  );
}
