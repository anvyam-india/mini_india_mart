import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  crumb: string
  actions?: ReactNode
  children?: ReactNode
}

export function PageHero({ eyebrow, title, subtitle, crumb, actions, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-secondary text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary to-secondary" />
      <div className="hero-grid-dark absolute inset-0" />
      <div className="container-page relative py-10 md:py-12">
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-200">{crumb}</span>
        </nav>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-200">{eyebrow}</p>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-[2.25rem]">{title}</h1>
            {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-slate-300">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </section>
  )
}
