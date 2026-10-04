import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Card({
  children,
  className,
  padding = true,
}: {
  children: ReactNode
  className?: string
  padding?: boolean
}) {
  return (
    <div className={cn('card-surface', padding && 'p-5', className)}>{children}</div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-h3">{title}</h3>
        {subtitle && <p className="mt-1 text-small">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
