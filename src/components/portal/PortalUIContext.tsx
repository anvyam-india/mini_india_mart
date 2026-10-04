import { createContext, useContext } from 'react'
import type { PortalConfig } from './portalConfig'

export interface PortalUIValue {
  config: PortalConfig
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  aiOpen: boolean
  aiMinimized: boolean
  openAi: (options?: { voice?: boolean; prompt?: string }) => void
  minimizeAi: () => void
  closeAi: () => void
  voiceLaunch: boolean
  clearVoiceLaunch: () => void
  pendingPrompt: string | null
  clearPendingPrompt: () => void
}

export const PortalUIContext = createContext<PortalUIValue | null>(null)

export function usePortalUI() {
  const ctx = useContext(PortalUIContext)
  if (!ctx) throw new Error('usePortalUI must be used within PortalShell')
  return ctx
}

export function useOptionalPortalUI() {
  return useContext(PortalUIContext)
}

export const SIDEBAR_WIDTH = 300
