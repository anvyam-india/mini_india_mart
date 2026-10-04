import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { PublicHeader } from './PublicHeader'
import { PublicFooter } from './PublicFooter'
import { CompareBar } from '../compare/CompareBar'
import { RFQModal } from '../rfq/RFQModal'
import { AIAssistant } from '../ai/AIAssistant'
import { useApp } from '../../context/AppContext'

export function PublicLayout() {
  const { portal, setPortal } = useApp()
  useEffect(() => {
    if (portal !== 'buyer') setPortal('buyer', { silent: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <PublicHeader />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <PublicFooter />
      <CompareBar />
      <RFQModal />
      <AIAssistant />
    </div>
  )
}
