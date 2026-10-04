import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import type { RFQ, RFQStatus } from '../../types'

function adminRequirement(r: RFQ) {
  if (r.id === 'RFQ-2026-10482') return '50,000 SS 304 Bolts'
  const qty = r.quantity.replace(/\s*units?/i, '')
  return `${qty} · ${r.product}`
}

function statusTone(status: RFQStatus) {
  if (status === 'NEW') return 'warning' as const
  if (status === 'VIEWED') return 'primary' as const
  if (status === 'RESPONDED') return 'success' as const
  return 'muted' as const
}

export function AdminRFQs() {
  const { rfqs, selectedRfqId, setSelectedRfqId } = useApp()
  const [filter, setFilter] = useState<'ALL' | RFQStatus>('ALL')

  const filtered = useMemo(
    () => (filter === 'ALL' ? rfqs : rfqs.filter((r) => r.status === filter)),
    [rfqs, filter],
  )

  const selected = useMemo(
    () => rfqs.find((r) => r.id === selectedRfqId) ?? filtered[0] ?? null,
    [rfqs, selectedRfqId, filtered],
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Operations</p>
        <h1 className="text-h1 mt-1">RFQs</h1>
        <p className="text-small mt-1">Monitor buyer requirements routed to manufacturers across the platform.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'NEW', 'VIEWED', 'RESPONDED', 'CLOSED'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
              filter === s ? 'bg-primary text-white' : 'border border-border bg-surface text-muted'
            }`}
          >
            {s === 'ALL' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card padding={false} className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-enterprise">
              <thead>
                <tr>
                  <th>RFQ ID</th>
                  <th>Buyer</th>
                  <th>Requirement</th>
                  <th>Manufacturers</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRfqId(r.id)}
                    className={`cursor-pointer ${r.id === 'RFQ-2026-10482' ? 'bg-primary-light/50' : ''}`}
                  >
                    <td className="font-bold text-primary">{r.id}</td>
                    <td>{r.buyer}</td>
                    <td>{adminRequirement(r)}</td>
                    <td>
                      {r.id === 'RFQ-2026-10482'
                        ? '3 Manufacturers'
                        : `${r.manufacturerNames.length} Manufacturers`}
                    </td>
                    <td className="text-muted">{r.createdAt}</td>
                    <td>
                      <Badge tone={statusTone(r.status)}>
                        {r.status === 'NEW' ? 'New' : r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="h-fit xl:sticky xl:top-24">
          {selected ? (
            <>
              <CardHeader title="RFQ details" subtitle={selected.id} />
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-caption normal-case tracking-normal">Buyer</dt>
                  <dd className="font-semibold">
                    {selected.buyer} · {selected.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption normal-case tracking-normal">Requirement</dt>
                  <dd>{adminRequirement(selected)}</dd>
                </div>
                <div>
                  <dt className="text-caption normal-case tracking-normal">Material / Grade</dt>
                  <dd>
                    {selected.material} · {selected.grade}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption normal-case tracking-normal">Delivery</dt>
                  <dd>
                    {selected.delivery} · {selected.requiredWithin}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption normal-case tracking-normal">Notes</dt>
                  <dd className="text-muted">{selected.notes}</dd>
                </div>
                <div>
                  <dt className="text-caption normal-case tracking-normal mb-2">Routed manufacturers</dt>
                  <dd className="space-y-1">
                    {selected.manufacturerNames.map((n) => (
                      <div key={n} className="rounded-lg bg-surface-muted px-2 py-1 font-medium">
                        {n}
                      </div>
                    ))}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="text-small">No RFQs match this filter.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
