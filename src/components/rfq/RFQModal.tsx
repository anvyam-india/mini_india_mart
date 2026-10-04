import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, X, ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useApp } from '../../context/AppContext'
import { manufacturers } from '../../data/mockData'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/cn'

const scores: Record<string, number> = {
  m1: 94,
  m2: 89,
  m3: 84,
  m4: 81,
  m5: 72,
  m6: 68,
  m7: 65,
  m8: 58,
}

export function RFQModal() {
  const navigate = useNavigate()
  const { rfqOpen, closeRFQ, rfqDraft, setRFQDraft, addRFQ, lastRFQId, setPortal } = useApp()
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [sending, setSending] = useState(false)

  const selected = useMemo(
    () => manufacturers.filter((m) => rfqDraft.manufacturerIds.includes(m.id)),
    [rfqDraft.manufacturerIds],
  )

  const resetAndClose = () => {
    closeRFQ()
    setTimeout(() => {
      setStep(1)
      setSuccess(false)
      setSending(false)
    }, 200)
  }

  const toggleManufacturer = (id: string) => {
    setRFQDraft((prev) => {
      const exists = prev.manufacturerIds.includes(id)
      return {
        ...prev,
        manufacturerIds: exists
          ? prev.manufacturerIds.filter((x) => x !== id)
          : [...prev.manufacturerIds, id],
      }
    })
  }

  const sendRFQ = async () => {
    if (selected.length === 0) {
      toast.error('Select at least one manufacturer')
      return
    }
    setSending(true)
    await new Promise((r) => setTimeout(r, 900))
    const rfq = addRFQ({
      id: 'RFQ-2026-10482',
      product: rfqDraft.product,
      quantity: `${rfqDraft.quantity.replace(/ units?/i, '')} units`,
      material: rfqDraft.material,
      grade: rfqDraft.grade,
      delivery: rfqDraft.delivery,
      requiredWithin: rfqDraft.requiredWithin,
      notes: rfqDraft.notes,
      manufacturerIds: selected.map((m) => m.id),
      manufacturerNames: selected.map((m) => m.name),
      buyer: 'ABC Auto Components',
      location: rfqDraft.delivery,
    })
    setSending(false)
    setSuccess(true)
    toast.success(`RFQ ${rfq.id} sent successfully`)
  }

  if (!rfqOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/50 p-4 backdrop-blur-[1px]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-card"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-secondary">
              {success ? 'RFQ Sent Successfully' : 'Request for Quote'}
            </h2>
            {!success && (
              <div className="mt-2 flex gap-2">
                {['01 Requirement', '02 Manufacturers', '03 Review'].map((label, i) => (
                  <span
                    key={label}
                    className={cn(
                      'rounded-lg px-2 py-1 text-[11px] font-bold',
                      step === i + 1
                        ? 'bg-primary-light text-primary'
                        : 'bg-surface-muted text-muted',
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button onClick={resetAndClose} className="rounded-xl p-1.5 hover:bg-surface-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-success">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-secondary">Your RFQ Has Been Sent</h3>
                <p className="mb-1 text-sm text-muted">RFQ ID</p>
                <p className="mb-2 text-lg font-bold text-primary">{lastRFQId ?? 'RFQ-2026-10482'}</p>
                <p className="mb-2 text-sm text-secondary">
                  Your requirement has been shared with {selected.length} matching manufacturers.
                </p>
                <p className="mb-8 text-xs font-semibold text-muted">
                  Expected responses: Within 24–48 hours
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetAndClose()
                      setPortal('buyer')
                      navigate('/my-rfqs')
                    }}
                  >
                    Track RFQ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetAndClose()
                      setPortal('buyer')
                      navigate('/my-rfqs')
                    }}
                  >
                    View My RFQs
                  </Button>
                  <Button
                    onClick={() => {
                      resetAndClose()
                      navigate('/manufacturers')
                    }}
                  >
                    Back to Discovery
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
              >
                {step === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(
                      [
                        ['product', 'Product', true],
                        ['quantity', 'Quantity', false],
                        ['material', 'Material', false],
                        ['grade', 'Grade', false],
                        ['delivery', 'Delivery Location', false],
                        ['requiredWithin', 'Required Date', false],
                      ] as const
                    ).map(([key, label, wide]) => (
                      <label key={key} className={cn('block text-sm', wide && 'sm:col-span-2')}>
                        <span className="mb-1.5 block font-semibold text-secondary">{label}</span>
                        <input
                          value={rfqDraft[key]}
                          onChange={(e) =>
                            setRFQDraft((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          className="h-11 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-primary"
                        />
                      </label>
                    ))}
                    <label className="block text-sm sm:col-span-2">
                      <span className="mb-1.5 block font-semibold text-secondary">
                        Additional Requirements
                      </span>
                      <textarea
                        value={rfqDraft.notes}
                        onChange={(e) =>
                          setRFQDraft((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        rows={3}
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted">Recommended manufacturers for this RFQ.</p>
                    {manufacturers.slice(0, 6).map((m) => {
                      const checked = rfqDraft.manufacturerIds.includes(m.id)
                      return (
                        <label
                          key={m.id}
                          className={cn(
                            'flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition',
                            checked
                              ? 'border-primary bg-primary-light'
                              : 'border-border hover:border-primary/40',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleManufacturer(m.id)}
                              className="h-4 w-4 accent-primary"
                            />
                            <div>
                              <div className="font-bold text-secondary">{m.name}</div>
                              <div className="text-xs text-muted">
                                {m.city}, {m.state}
                              </div>
                            </div>
                          </div>
                          <Badge tone="warning">{scores[m.id] ?? 70}% Match</Badge>
                        </label>
                      )
                    })}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-surface-muted p-4">
                      <h4 className="mb-3 text-caption">RFQ Summary</h4>
                      <dl className="grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-muted">Product</dt>
                          <dd className="font-semibold">{rfqDraft.product}</dd>
                        </div>
                        <div>
                          <dt className="text-muted">Quantity</dt>
                          <dd className="font-semibold">{rfqDraft.quantity} units</dd>
                        </div>
                        <div>
                          <dt className="text-muted">Material / Grade</dt>
                          <dd className="font-semibold">
                            {rfqDraft.material} · {rfqDraft.grade}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted">Delivery</dt>
                          <dd className="font-semibold">{rfqDraft.delivery}</dd>
                        </div>
                        <div>
                          <dt className="text-muted">Required within</dt>
                          <dd className="font-semibold">{rfqDraft.requiredWithin}</dd>
                        </div>
                        <div>
                          <dt className="text-muted">Buyer</dt>
                          <dd className="font-semibold">ABC Auto Components</dd>
                        </div>
                      </dl>
                      {rfqDraft.notes && (
                        <p className="mt-3 text-sm text-muted">{rfqDraft.notes}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-bold text-secondary">
                        Selected manufacturers ({selected.length})
                      </h4>
                      <ul className="space-y-2">
                        {selected.map((m) => (
                          <li
                            key={m.id}
                            className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
                          >
                            <span className="font-semibold">{m.name}</span>
                            <Badge tone="warning">{scores[m.id] ?? 70}% Match</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!success && (
          <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-surface px-6 py-4">
            <Button
              variant="ghost"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < 3 ? (
              <Button
                onClick={() => {
                  if (step === 2 && selected.length === 0) {
                    toast.error('Select at least one manufacturer')
                    return
                  }
                  setStep((s) => s + 1)
                }}
              >
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={sendRFQ} disabled={sending}>
                {sending ? 'Sending…' : `Send RFQ to ${selected.length} Manufacturers`}
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
