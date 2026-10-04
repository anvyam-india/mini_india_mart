import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Bookmark,
  GitCompareArrows,
  FileText,
  Sparkles,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { DemoModeSwitcher } from '../demo/DemoModeSwitcher'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/cn'
import { toast } from 'sonner'

const nav = [
  { to: '/manufacturers', label: 'Manufacturers' },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/services', label: 'Services' },
]

function IconAction({
  to,
  label,
  count,
  children,
}: {
  to: string
  label: string
  count?: number
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      title={label}
      aria-label={label}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary/70 transition hover:bg-surface-muted hover:text-primary"
    >
      {children}
      {!!count && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  )
}

export function PublicHeader() {
  const { setPortal, compareIds, savedIds, rfqs } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeRfqs = rfqs.filter((r) => r.status === 'NEW' || r.status === 'VIEWED').length

  const joinAsManufacturer = () => {
    setPortal('manufacturer')
    navigate('/manufacturer')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-surface/95 backdrop-blur transition-shadow',
        scrolled ? 'border-border shadow-soft' : 'border-border/60',
      )}
    >
      <div
        className={cn(
          'container-page flex items-center justify-between gap-4 transition-all',
          scrolled ? 'h-14' : 'h-16',
        )}
      >
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-white">
              FL
            </div>
            <span className="text-base font-extrabold tracking-tight text-secondary">ForgeLink</span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-secondary/70 hover:bg-surface-muted hover:text-primary',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <NavLink
            to="/ai-search"
            className={({ isActive }) =>
              cn(
                'mr-1 hidden h-9 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-semibold transition sm:inline-flex',
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-primary-light text-primary hover:bg-primary hover:text-white',
              )
            }
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Search
          </NavLink>

          <div className="hidden items-center sm:flex">
            <IconAction to="/compare" label="Compare" count={compareIds.length}>
              <GitCompareArrows className="h-[17px] w-[17px]" />
            </IconAction>
            <IconAction to="/saved" label="Saved" count={savedIds.length}>
              <Bookmark className="h-[17px] w-[17px]" />
            </IconAction>
            <IconAction to="/my-rfqs" label="My RFQs" count={activeRfqs}>
              <FileText className="h-[17px] w-[17px]" />
            </IconAction>
          </div>

          <span className="mx-1.5 hidden h-5 w-px bg-border sm:block" />

          <button
            onClick={() => toast.message('Demo mode — sign-in is simulated')}
            className="hidden whitespace-nowrap px-2 text-sm font-semibold text-secondary/70 hover:text-primary md:inline"
          >
            Sign In
          </button>

          <Button size="sm" className="hidden whitespace-nowrap md:inline-flex" onClick={joinAsManufacturer}>
            Join as Manufacturer
          </Button>

          <div className="ml-1 hidden lg:block">
            <DemoModeSwitcher compact />
          </div>

          <button
            className="ml-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-secondary hover:bg-surface-muted lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface lg:hidden">
          <div className="container-page grid gap-1 py-3">
            {[
              ...nav,
              { to: '/ai-search', label: 'AI Search' },
              { to: '/resources', label: 'Resources' },
              { to: '/compare', label: 'Compare' },
              { to: '/saved', label: 'Saved' },
              { to: '/my-rfqs', label: 'My RFQs' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-sm font-semibold',
                    isActive ? 'bg-primary-light text-primary' : 'text-secondary hover:bg-surface-muted',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={joinAsManufacturer}>
                Join as Manufacturer
              </Button>
              <DemoModeSwitcher compact />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
