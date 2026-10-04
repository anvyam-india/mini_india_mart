import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface BadgeProps {
  children: ReactNode
  tone?: 'default' | 'success' | 'primary' | 'warning' | 'danger' | 'muted'
  className?: string
}

const tones = {
  default: 'bg-surface-warm text-secondary border-border',
  success: 'bg-success-light text-success border-green-200',
  primary: 'bg-primary-light text-primary border-indigo-200',
  warning: 'bg-warning-light text-warning border-amber-200',
  danger: 'bg-danger-light text-danger border-red-200',
  muted: 'bg-slate-100 text-muted border-slate-200',
}

export function Badge({ children, tone = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
