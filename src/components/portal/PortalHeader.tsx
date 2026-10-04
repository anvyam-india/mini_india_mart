import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, Menu, Plus, Search, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/cn'
import { DemoModeSwitcher } from '../demo/DemoModeSwitcher'
import { usePortalUI } from './PortalUIContext'

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onOutside])
  return ref
}

export function PortalHeader() {
  const { config, collapsed, setCollapsed, setMobileOpen, setSearchOpen, openAi } = usePortalUI()
  const { rfqs, verificationItems } = useApp()
  const navigate = useNavigate()
  const [quickOpen, setQuickOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [readIds, setReadIds] = useState<string[]>([])
  const quickRef = useClickOutside(() => setQuickOpen(false))
  const notesRef = useClickOutside(() => setNotesOpen(false))

  const notifications =
    config.kind === 'manufacturer'
      ? [
          ...rfqs
            .filter((r) => r.manufacturerIds.includes('m1') && r.status === 'NEW')
            .map((r) => ({
              id: r.id,
              title: `New RFQ ${r.id}`,
              description: `${r.quantity} · ${r.product} from ${r.buyer}`,
              time: 'Just now',
              to: '/manufacturer/rfqs',
            })),
          { id: 'n-views', title: 'Profile views up 18%', description: '1,284 buyers viewed ABC Fasteners this month', time: '2h ago', to: '/manufacturer/analytics' },
          { id: 'n-inq', title: 'New inquiry from Sundaram Auto', description: 'Hex head screws M10 — 20,000 pcs', time: '5h ago', to: '/manufacturer/inquiries' },
        ]
      : [
          ...verificationItems
            .filter((v) => v.status === 'Pending')
            .map((v) => ({
              id: v.id,
              title: 'Verification pending',
              description: `${v.company} · ${v.location}`,
              time: v.submittedAt,
              to: '/admin/verification',
            })),
          ...rfqs
            .filter((r) => r.status === 'NEW')
            .map((r) => ({
              id: r.id,
              title: `New RFQ ${r.id}`,
              description: `${r.buyer} → ${r.manufacturerNames.length} manufacturers`,
              time: 'Just now',
              to: '/admin/rfqs',
            })),
        ]

  const unread = notifications.filter((n) => !readIds.includes(n.id)).length

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-4 px-4 md:px-5">
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <button
          type="button"
          className="rounded-lg p-2 text-secondary/70 transition hover:bg-surface-warm lg:hidden"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="hidden rounded-lg p-2 text-secondary/70 transition hover:bg-surface-warm lg:inline-flex"
          aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden min-w-0 2xl:block">
          <p className="truncate text-sm font-semibold text-secondary">{config.orgName}</p>
          <p className="truncate text-xs text-muted">{config.orgCaption}</p>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 justify-center md:flex">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex h-11 w-full max-w-[540px] items-center gap-3 rounded-full border border-border bg-surface-muted px-4 text-left text-sm text-muted shadow-soft transition hover:border-border-strong hover:bg-surface"
        >
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <span className="min-w-0 flex-1 truncate">{config.searchPlaceholder}</span>
          <kbd className="shrink-0 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
            {isMac ? '⌘K' : 'Ctrl K'}
          </kbd>
        </button>
      </div>

      <div className="ml-auto flex shrink-0 items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-lg p-2 text-secondary/70 hover:bg-surface-warm md:hidden"
          aria-label="Search"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => openAi()}
          className="hidden h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-border bg-surface px-3 text-sm font-medium text-secondary hover:bg-surface-muted xl:inline-flex"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Ask AI
        </button>

        <div ref={quickRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setQuickOpen((v) => !v)
              setNotesOpen(false)
            }}
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-3 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>
          {quickOpen && (
            <div className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              {config.quickActions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-secondary hover:bg-surface-muted"
                  onClick={() => {
                    setQuickOpen(false)
                    if (item.to) navigate(item.to)
                  }}
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={notesRef} className="relative">
          <button
            type="button"
            className="relative rounded-lg p-2 text-secondary/70 hover:bg-surface-warm"
            aria-label="Notifications"
            onClick={() => {
              setNotesOpen((v) => !v)
              setQuickOpen(false)
            }}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {notesOpen && (
            <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-secondary">Notifications</p>
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => setReadIds(notifications.map((n) => n.id))}
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-muted">You’re all caught up.</p>
                )}
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={cn(
                      'block w-full border-b border-border px-4 py-3 text-left hover:bg-surface-muted',
                      readIds.includes(n.id) && 'opacity-60',
                    )}
                    onClick={() => {
                      setReadIds((p) => [...p, n.id])
                      setNotesOpen(false)
                      navigate(n.to)
                    }}
                  >
                    <p className="flex items-center gap-2 text-sm font-medium text-secondary">
                      {!readIds.includes(n.id) && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{n.description}</p>
                    <p className="mt-1 text-[10px] text-muted">{n.time}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <DemoModeSwitcher compact />
        </div>

        <button
          type="button"
          onClick={() => navigate(`${config.homePath}/settings`)}
          className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white sm:inline-flex"
          title={config.user.name}
        >
          {config.user.initials}
        </button>
      </div>
    </header>
  )
}

export function PortalBreadcrumbs() {
  const { config } = usePortalUI()
  const { pathname } = useLocation()
  const items = config.groups.flatMap((g) => g.items)
  const matched = items
    .filter((i) => !i.end && (pathname === i.to || pathname.startsWith(`${i.to}/`)))
    .sort((a, b) => b.to.length - a.to.length)[0]

  const crumbs: { label: string; to: string }[] = [{ label: 'Dashboard', to: config.homePath }]
  if (matched) crumbs.push({ label: matched.label, to: matched.to })

  return (
    <div className="flex items-center justify-between gap-4 px-4 pb-3 md:px-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[15px]">
        <span className="font-medium text-muted">{config.name}</span>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <span key={c.to} className="flex items-center gap-1.5">
              <ChevronRight className="mx-0.5 h-3.5 w-3.5 shrink-0 text-border-strong" />
              {last ? (
                <span className="font-semibold text-secondary">{c.label}</span>
              ) : (
                <Link to={c.to} className="font-medium text-muted transition hover:text-primary">
                  {c.label}
                </Link>
              )}
            </span>
          )
        })}
      </nav>
      <span className="hidden items-center gap-1.5 text-xs font-medium text-muted sm:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-success" /> Live demo data · synced
      </span>
    </div>
  )
}
