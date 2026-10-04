import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { initialRFQs, verificationQueue as seedVerification } from '../data/mockData'
import type { DemoPortal, RFQ, RFQStatus, VerificationItem } from '../types'

interface RFQDraft {
  product: string
  quantity: string
  material: string
  grade: string
  delivery: string
  requiredWithin: string
  notes: string
  manufacturerIds: string[]
}

interface AppContextValue {
  portal: DemoPortal
  setPortal: (portal: DemoPortal, options?: { silent?: boolean }) => void
  compareIds: string[]
  toggleCompare: (id: string) => void
  clearCompare: () => void
  savedIds: string[]
  toggleSave: (id: string) => void
  savedProductIds: string[]
  toggleSaveProduct: (id: string) => void
  rfqs: RFQ[]
  addRFQ: (rfq: Omit<RFQ, 'id' | 'createdAt' | 'status'> & { id?: string }) => RFQ
  updateRFQStatus: (id: string, status: RFQStatus) => void
  rfqOpen: boolean
  openRFQ: (draft?: Partial<RFQDraft>) => void
  closeRFQ: () => void
  rfqDraft: RFQDraft
  setRFQDraft: (draft: RFQDraft | ((prev: RFQDraft) => RFQDraft)) => void
  lastRFQId: string | null
  selectedRfqId: string | null
  setSelectedRfqId: (id: string | null) => void
  assistantOpen: boolean
  setAssistantOpen: (open: boolean) => void
  verificationItems: VerificationItem[]
  approveVerification: (id: string) => void
  rejectVerification: (id: string) => void
  requestVerificationInfo: (id: string) => void
}

const defaultDraft: RFQDraft = {
  product: 'SS 304 Industrial Bolts',
  quantity: '50,000',
  material: 'Stainless Steel',
  grade: 'SS304',
  delivery: 'Ahmedabad',
  requiredWithin: '30 days',
  notes: 'Prefer export-ready packaging and material certificates.',
  manufacturerIds: ['m1', 'm2', 'm3'],
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [portal, setPortalState] = useState<DemoPortal>('buyer')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<string[]>(['m1'])
  const [savedProductIds, setSavedProductIds] = useState<string[]>(['p1'])
  const [rfqs, setRfqs] = useState<RFQ[]>(initialRFQs)
  const [rfqOpen, setRfqOpen] = useState(false)
  const [rfqDraft, setRFQDraft] = useState<RFQDraft>(defaultDraft)
  const [lastRFQId, setLastRFQId] = useState<string | null>(null)
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [verificationItems, setVerificationItems] =
    useState<VerificationItem[]>(seedVerification)

  const setPortal = useCallback((next: DemoPortal, options?: { silent?: boolean }) => {
    setPortalState((prev) => {
      if (prev === next) return prev
      if (!options?.silent) {
        queueMicrotask(() => {
          toast.success(
            next === 'buyer'
              ? 'Switched to Buyer Website'
              : next === 'manufacturer'
                ? 'Switched to Manufacturer Portal'
                : 'Switched to Admin Portal',
          )
        })
      }
      return next
    })
  }, [])

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        toast.message('Removed from compare')
        return prev.filter((x) => x !== id)
      }
      if (prev.length >= 4) {
        toast.error('You can compare up to 4 manufacturers')
        return prev
      }
      toast.success('Added to compare')
      return [...prev, id]
    })
  }, [])

  const clearCompare = useCallback(() => setCompareIds([]), [])

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        toast.message('Removed from saved manufacturers')
        return prev.filter((x) => x !== id)
      }
      toast.success('Manufacturer saved')
      return [...prev, id]
    })
  }, [])

  const toggleSaveProduct = useCallback((id: string) => {
    setSavedProductIds((prev) => {
      if (prev.includes(id)) {
        toast.message('Removed from saved products')
        return prev.filter((x) => x !== id)
      }
      toast.success('Product saved')
      return [...prev, id]
    })
  }, [])

  const openRFQ = useCallback((draft?: Partial<RFQDraft>) => {
    setRFQDraft((prev) => ({ ...prev, ...draft }))
    setRfqOpen(true)
  }, [])

  const closeRFQ = useCallback(() => setRfqOpen(false), [])

  const addRFQ = useCallback(
    (payload: Omit<RFQ, 'id' | 'createdAt' | 'status'> & { id?: string }) => {
      const id = payload.id ?? 'RFQ-2026-10482'
      const rfq: RFQ = {
        ...payload,
        id,
        status: 'NEW',
        createdAt: new Date().toISOString().slice(0, 10),
        matchScore: 94,
      }
      setRfqs((prev) => [rfq, ...prev.filter((item) => item.id !== id)])
      setLastRFQId(id)
      setSelectedRfqId(id)
      return rfq
    },
    [],
  )

  const updateRFQStatus = useCallback((id: string, status: RFQStatus) => {
    setRfqs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }, [])

  const approveVerification = useCallback((id: string) => {
    setVerificationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item)),
    )
    toast.success('Manufacturer verified successfully.')
  }, [])

  const rejectVerification = useCallback((id: string) => {
    setVerificationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item)),
    )
    toast.message('Verification rejected')
  }, [])

  const requestVerificationInfo = useCallback((id: string) => {
    setVerificationItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Info Requested' } : item,
      ),
    )
    toast.message('Additional information requested')
  }, [])

  const value = useMemo(
    () => ({
      portal,
      setPortal,
      compareIds,
      toggleCompare,
      clearCompare,
      savedIds,
      toggleSave,
      savedProductIds,
      toggleSaveProduct,
      rfqs,
      addRFQ,
      updateRFQStatus,
      rfqOpen,
      openRFQ,
      closeRFQ,
      rfqDraft,
      setRFQDraft,
      lastRFQId,
      selectedRfqId,
      setSelectedRfqId,
      assistantOpen,
      setAssistantOpen,
      verificationItems,
      approveVerification,
      rejectVerification,
      requestVerificationInfo,
    }),
    [
      portal,
      setPortal,
      compareIds,
      toggleCompare,
      clearCompare,
      savedIds,
      toggleSave,
      savedProductIds,
      toggleSaveProduct,
      rfqs,
      addRFQ,
      updateRFQStatus,
      rfqOpen,
      openRFQ,
      closeRFQ,
      rfqDraft,
      lastRFQId,
      selectedRfqId,
      assistantOpen,
      verificationItems,
      approveVerification,
      rejectVerification,
      requestVerificationInfo,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
