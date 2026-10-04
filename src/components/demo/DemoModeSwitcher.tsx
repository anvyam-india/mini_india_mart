import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Presentation } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { DemoPortal } from '../../types'
import { cn } from '../../lib/cn'

const options: { value: DemoPortal; label: string; path: string }[] = [
  { value: 'buyer', label: 'Buyer Website', path: '/' },
  { value: 'manufacturer', label: 'Manufacturer Portal', path: '/manufacturer' },
  { value: 'admin', label: 'Admin Portal', path: '/admin' },
]

interface Props {
  compact?: boolean
  tone?: 'light' | 'dark'
}

export function DemoModeSwitcher({ compact = false, tone = 'light' }: Props) {
  const { portal, setPortal } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = options.find((o) => o.value === portal) ?? options[0]

  const select = (next: (typeof options)[number]) => {
    setPortal(next.value)
    setOpen(false)
    navigate(next.path)
  }

  return (
    <div ref={ref} className="relative">
      {tone === 'dark' ? (
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md border border-white/15 bg-white/5 px-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          <Presentation className="h-3.5 w-3.5 text-blue-300" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
            Demo Mode
          </span>
          <span className="text-slate-300">·</span>
          <span>{current.label}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 text-slate-400 transition', open && 'rotate-180')} />
        </button>
      ) : (
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-border bg-surface-muted px-3 text-left transition hover:border-primary/30 hover:bg-primary-light/60',
            compact ? 'h-9' : 'h-10',
          )}
        >
          <Presentation className="h-4 w-4 text-primary" />
          <div className="min-w-0 leading-tight">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Demo Mode
            </div>
            {!compact && (
              <div className="truncate text-xs font-semibold text-secondary">{current.label}</div>
            )}
          </div>
          <ChevronDown className={cn('h-4 w-4 text-muted transition', open && 'rotate-180')} />
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-border bg-surface text-secondary shadow-card">
          <div className="border-b border-border bg-surface-muted px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Switch experience
          </div>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => select(option)}
              className={cn(
                'block w-full px-3 py-2.5 text-left text-sm font-medium transition hover:bg-primary-light',
                portal === option.value && 'bg-primary-light text-primary',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
