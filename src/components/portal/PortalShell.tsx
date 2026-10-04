import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/cn'
import { ForgeAiAvatar } from '../ai/ForgeAiAvatar'
import { RFQModal } from '../rfq/RFQModal'
import { CommandPalette } from './CommandPalette'
import { PortalAIPanel } from './PortalAIPanel'
import { PortalHeader, PortalBreadcrumbs } from './PortalHeader'
import { PortalSidebar } from './PortalSidebar'
import { preloadVoiceSession } from '../../lib/voiceSession'
import { portalConfigs, type PortalKind } from './portalConfig'
import { PortalUIContext, SIDEBAR_WIDTH, type PortalUIValue } from './PortalUIContext'

export function PortalShell({ kind }: { kind: PortalKind }) {
  const config = portalConfigs[kind]
  const { portal, setPortal } = useApp()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiMinimized, setAiMinimized] = useState(false)
  const [voiceLaunch, setVoiceLaunch] = useState(false)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)

  useEffect(() => {
    if (portal !== kind) setPortal(kind, { silent: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  useEffect(() => {
    preloadVoiceSession()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openAi = useCallback((options?: { voice?: boolean; prompt?: string }) => {
    setAiOpen(true)
    setAiMinimized(false)
    if (options?.voice) setVoiceLaunch(true)
    if (options?.prompt) setPendingPrompt(options.prompt)
  }, [])

  const value = useMemo<PortalUIValue>(
    () => ({
      config,
      collapsed,
      setCollapsed,
      mobileOpen,
      setMobileOpen,
      searchOpen,
      setSearchOpen,
      aiOpen,
      aiMinimized,
      openAi,
      minimizeAi: () => {
        setAiOpen(false)
        setAiMinimized(true)
      },
      closeAi: () => {
        setAiOpen(false)
        setAiMinimized(false)
      },
      voiceLaunch,
      clearVoiceLaunch: () => setVoiceLaunch(false),
      pendingPrompt,
      clearPendingPrompt: () => setPendingPrompt(null),
    }),
    [config, collapsed, mobileOpen, searchOpen, aiOpen, aiMinimized, openAi, voiceLaunch, pendingPrompt],
  )

  return (
    <PortalUIContext.Provider value={value}>
      <div className="min-h-screen bg-surface-muted">
        <PortalSidebar />
        <div
          className={cn(
            'flex min-h-screen min-w-0 flex-col transition-[margin] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] max-lg:!ml-0',
          )}
          style={{ marginLeft: collapsed ? 0 : SIDEBAR_WIDTH }}
        >
          <div className="sticky top-0 z-30 border-b border-border bg-surface">
            <PortalHeader />
            <PortalBreadcrumbs />
          </div>
          <main className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-6 md:px-6 xl:px-8">
            <Outlet />
          </main>
        </div>

        <CommandPalette />
        <PortalAIPanel />
        {kind === 'manufacturer' && <RFQModal />}

        {aiMinimized && !aiOpen && (
          <button
            onClick={() => openAi()}
            className="fixed bottom-5 right-5 z-[65] flex items-center gap-2.5 rounded-full border border-border bg-surface py-2 pl-2 pr-4 shadow-[0_10px_30px_rgba(15,23,42,0.15)] transition hover:border-primary"
            aria-label="Open ForgeLink AI"
          >
            <ForgeAiAvatar size="sm" pulse />
            <span className="text-sm font-semibold text-secondary">ForgeLink AI</span>
          </button>
        )}
      </div>
    </PortalUIContext.Provider>
  )
}
