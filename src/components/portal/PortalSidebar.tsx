import { useMemo, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Mic, Search, Sparkles, X, Globe } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/cn'
import { beginVoiceFromGesture, buildVoiceGreeting } from '../../lib/voiceSession'
import { ForgeAiAvatar } from '../ai/ForgeAiAvatar'
import type { PortalNavGroup, PortalNavItem } from './portalConfig'
import { SIDEBAR_WIDTH, usePortalUI } from './PortalUIContext'

function isActive(pathname: string, item: PortalNavItem) {
  if (item.end) return pathname === item.to || pathname === `${item.to}/`
  return pathname === item.to || pathname.startsWith(`${item.to}/`)
}

export function PortalSidebar() {
  const { config, collapsed, setCollapsed, mobileOpen, setMobileOpen, openAi } = usePortalUI()
  const { rfqs, verificationItems } = useApp()
  const { pathname } = useLocation()
  const [query, setQuery] = useState('')
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const badges = {
    newRfqs: rfqs.filter((r) => r.status === 'NEW').length,
    pendingVerification: verificationItems.filter((v) => v.status === 'Pending').length,
  }

  const groups = useMemo<PortalNavGroup[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return config.groups
    return config.groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0)
  }, [config.groups, query])

  const visible = !collapsed || mobileOpen

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-[60] flex h-svh flex-col overflow-hidden bg-sidebar text-white shadow-xl transition-[width,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{ width: visible ? SIDEBAR_WIDTH : 0 }}
      >
        <div className="flex h-full flex-col" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}>
          {/* Brand */}
          <div className="flex h-20 shrink-0 items-center justify-between gap-2 px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-extrabold tracking-tight text-white">
                FL
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[15px] font-semibold text-white">ForgeLink</span>
                <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  {config.name}
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                setCollapsed(true)
              }}
              className="rounded-lg p-2 text-white/50 hover:bg-sidebar-soft hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* AI avatar card */}
          <div className="shrink-0 px-3 pb-2">
            <button
              type="button"
              onClick={() => {
                // Must speak + unlock mic inside this click (Chrome)
                const firstName = config.user.name.split(' ')[0] || 'ji'
                beginVoiceFromGesture(buildVoiceGreeting(config.kind, firstName))
                openAi({ voice: true })
                setMobileOpen(false)
              }}
              className="group flex w-full flex-col items-center gap-2 rounded-2xl border border-white/10 bg-sidebar-card p-4 transition hover:border-primary/60 hover:bg-[#121212]"
              aria-label="Open ForgeLink AI"
            >
              <div className="relative">
                <ForgeAiAvatar size="lg" className="transition group-hover:scale-105" />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-primary text-white">
                  <Sparkles className="h-3 w-3" />
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">ForgeLink AI</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-white/45">
                  <Mic className="h-3 w-3" /> Tap to chat · voice
                </p>
              </div>
            </button>
          </div>

          {/* Menu search */}
          <div className="shrink-0 px-4 pb-2 pt-1">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu items..."
                className="h-10 w-full rounded-xl border-0 bg-sidebar-soft pl-9 pr-3 text-[13px] text-white outline-none placeholder:text-white/35 focus:ring-1 focus:ring-white/15"
              />
            </label>
          </div>

          {/* Nav */}
          <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            {groups.map((group) => {
              const open = openGroups[group.id] ?? true
              return (
                <div key={group.id} className="mb-1">
                  <button
                    type="button"
                    onClick={() => setOpenGroups((p) => ({ ...p, [group.id]: !open }))}
                    className="mb-0.5 flex w-full items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40"
                  >
                    {group.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', !open && '-rotate-90')} />
                  </button>
                  {open &&
                    group.items.map((item) => {
                      const active = isActive(pathname, item)
                      const count = item.badgeKey ? badges[item.badgeKey] : 0
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.end}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors',
                            active ? 'bg-sidebar-active text-white' : 'text-white hover:bg-sidebar-soft',
                          )}
                        >
                          <item.icon className="h-[18px] w-[18px] shrink-0" />
                          <span className="flex-1 truncate">{item.label}</span>
                          {count > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                              {count}
                            </span>
                          )}
                        </NavLink>
                      )
                    })}
                </div>
              )
            })}
            {groups.length === 0 && (
              <p className="px-3 py-6 text-center text-[11px] text-white/35">No items found</p>
            )}
          </nav>

          <p className="px-5 pb-2 text-[10px] tracking-wide text-white/30">Powered by Anvyam · Demo build</p>
          <SidebarUser />
        </div>
      </aside>
    </>
  )
}

function SidebarUser() {
  const { config } = usePortalUI()
  const { setPortal } = useApp()
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="relative shrink-0 px-3 py-2.5">
      <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-sidebar-card px-2.5 py-2">
        <button
          type="button"
          onClick={() => navigate(`${config.homePath}/settings`)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
            {config.user.initials}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[12px] font-semibold text-white">{config.user.name}</span>
            <span className="mt-0.5 block truncate text-[10px] text-white/50">{config.user.title}</span>
          </span>
        </button>
        <button
          type="button"
          aria-label="Open website"
          title="Open buyer website"
          onClick={() => {
            setPortal('buyer')
            navigate('/')
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Globe className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Logout"
          title="Logout"
          onClick={() => setConfirm(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-900/40 bg-red-950/60 text-red-400 hover:bg-red-950"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>

      {confirm && (
        <div className="absolute inset-x-3 bottom-[calc(100%+4px)] rounded-xl border border-white/10 bg-sidebar-soft p-3 shadow-xl">
          <p className="text-sm font-semibold text-white">Log out of {config.name}?</p>
          <p className="mt-1 text-xs text-white/50">You will return to the ForgeLink website.</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setConfirm(false)}
              className="h-8 flex-1 rounded-lg border border-white/15 text-xs font-semibold text-white/80 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setConfirm(false)
                setPortal('buyer', { silent: true })
                navigate('/')
              }}
              className="h-8 flex-1 rounded-lg bg-danger text-xs font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
