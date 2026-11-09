import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const variants = {
  primary: 'bg-paper text-ink hover:bg-white',
  secondary: 'border border-line text-paper hover:border-dim',
};

export function Button({
  children,
  href,
  variant = 'primary',
  className,
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const classes = cn(
    'label inline-flex items-center justify-center px-6 py-4 !text-inherit transition-colors duration-200',
    variants[variant],
    disabled && 'cursor-not-allowed opacity-40',
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
