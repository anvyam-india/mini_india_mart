import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useApp } from '../../context/AppContext'
import type { RFQ, RFQStatus } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

function statusTone(status: RFQStatus) {
  switch (status) {
    case 'NEW':
      return 'warning' as const
    case 'VIEWED':
      return 'primary' as const
    case 'RESPONDED':
      return 'success' as const
    default:
      return 'muted' as const
  }
}

function displayProduct(rfq: RFQ) {
  if (rfq.id === 'RFQ-2026-10482' || rfq.product.toLowerCase().includes('bolt')) {
    return 'SS 304 Industrial Bolts'
  }
  return rfq.product
}

function displayBuyer(rfq: RFQ) {
  return rfq.id === 'RFQ-2026-10482' ? 'ABC Auto Components' : rfq.buyer
}

function displayLocation(rfq: RFQ) {
  return rfq.id === 'RFQ-2026-10482' ? 'Ahmedabad' : rfq.location
}

function displayQuantity(rfq: RFQ) {
  return rfq.id === 'RFQ-2026-10482' ? '50,000 units' : rfq.quantity
}

export function ManufacturerRFQs() {
  const { rfqs, selectedRfqId, setSelectedRfqId, updateRFQStatus } = useApp()

  const sorted = useMemo(
    () =>
      [...rfqs].sort((a, b) => {
        const order: Record<RFQStatus, number> = {
          NEW: 0,
          VIEWED: 1,
          RESPONDED: 2,
          CLOSED: 3,
        }
        return order[a.status] - order[b.status] || b.createdAt.localeCompare(a.createdAt)
      }),
    [rfqs],
  )

  useEffect(() => {
    if (!sorted.length) return
    const preferred = sorted.find((r) => r.id === 'RFQ-2026-10482') ?? sorted[0]
    if (!selectedRfqId || !sorted.some((r) => r.id === selectedRfqId)) {
      setSelectedRfqId(preferred.id)
    }
  }, [sorted, selectedRfqId, setSelectedRfqId])

  const selected = sorted.find((r) => r.id === selectedRfqId) ?? sorted[0]

  const handleView = (id: string) => {
    updateRFQStatus(id, 'VIEWED')
    toast.message('RFQ marked as viewed')
  }

  const handleRespond = (id: string) => {
    updateRFQStatus(id, 'RESPONDED')
    toast.success('Response recorded — buyer will be notified in this demo.')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Workspace</p>
        <h1 className="text-h1 mt-1">RFQ Inbox</h1>
        <p className="text-small mt-1">
          Manage buyer requirements sent to ABC Fasteners and partner listings.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <CardHeader title="All RFQs" subtitle={`${rfqs.length} total in workspace`} />
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="table-enterprise">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((rfq) => (
                  <tr
                    key={rfq.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedRfqId(rfq.id)}
                    data-active={selected?.id === rfq.id}
                    style={
                      selected?.id === rfq.id
                        ? { background: 'color-mix(in srgb, var(--color-primary-light) 70%, white)' }
                        : undefined
                    }
                  >
                    <td className="font-semibold">{rfq.id}</td>
                    <td>{displayProduct(rfq)}</td>
                    <td className="text-muted">{displayBuyer(rfq)}</td>
                    <td>
                      <Badge tone={statusTone(rfq.status)}>{rfq.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 p-4 md:hidden">
            {sorted.map((rfq) => (
              <button
                key={rfq.id}
                type="button"
                onClick={() => setSelectedRfqId(rfq.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selected?.id === rfq.id
                    ? 'border-primary bg-primary-light/40'
                    : 'border-border bg-surface'
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-caption normal-case tracking-normal">{rfq.id}</span>
                  <Badge tone={statusTone(rfq.status)}>{rfq.status}</Badge>
                </div>
                <p className="font-semibold text-secondary">{displayProduct(rfq)}</p>
                <p className="text-small mt-1">{displayBuyer(rfq)}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          {selected ? (
            <>
              <CardHeader
                title={displayProduct(selected)}
                subtitle={selected.id}
                action={<Badge tone={statusTone(selected.status)}>{selected.status}</Badge>}
              />
              {(selected.id === 'RFQ-2026-10482' || selected.matchScore != null) && (
                <div className="mb-4">
                  <Badge tone="primary">
                    {selected.id === 'RFQ-2026-10482' ? 94 : selected.matchScore}% buyer match
                  </Badge>
                </div>
              )}
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Quantity', displayQuantity(selected)],
                  ['Material', selected.material],
                  ['Grade', selected.grade],
                  ['Delivery', selected.delivery],
                  ['Required within', selected.requiredWithin],
                  ['Buyer', displayBuyer(selected)],
                  ['Location', displayLocation(selected)],
                  ['Received', selected.createdAt],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-surface-muted px-3 py-2.5">
                    <dt className="text-caption normal-case tracking-normal">{label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-secondary">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4">
                <p className="text-caption mb-1 normal-case tracking-normal">Buyer notes</p>
                <p className="text-sm text-secondary">{selected.notes}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleView(selected.id)}
                  disabled={selected.status !== 'NEW'}
                >
                  View RFQ
                </Button>
                <Button
                  onClick={() => handleRespond(selected.id)}
                  disabled={selected.status === 'RESPONDED' || selected.status === 'CLOSED'}
                >
                  Respond to buyer
                </Button>
              </div>
            </>
          ) : (
            <p className="text-small py-12 text-center">No RFQs available yet.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
