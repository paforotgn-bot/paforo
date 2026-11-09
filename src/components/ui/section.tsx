import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('px-5 pb-24 pt-36 md:px-10 md:pb-32 md:pt-44', className)}
    >
      {children}
    </section>
  );
}
