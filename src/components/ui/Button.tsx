import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark focus-visible:ring-primary/35 disabled:bg-primary/40',
  secondary:
    'bg-secondary text-white hover:bg-secondary-soft active:bg-secondary-soft focus-visible:ring-secondary/30 disabled:bg-secondary/40',
  outline:
    'border border-border-strong bg-surface text-secondary hover:border-primary hover:text-primary active:bg-primary-light focus-visible:ring-primary/25',
  ghost:
    'text-secondary hover:bg-surface-warm hover:text-primary active:bg-primary-light focus-visible:ring-primary/20',
  danger:
    'bg-danger text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-danger/30 disabled:bg-danger/40',
  success:
    'bg-success text-white hover:bg-green-800 active:bg-green-900 focus-visible:ring-success/30 disabled:bg-success/40',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-[15px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
