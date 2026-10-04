import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  Clock,
  FileText,
  MapPin,
  Package,
  Plus,
  Search,
  Send,
  Eye,
  MessageSquareText,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageHero } from '../components/layout/PageHero'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/cn'
import type { RFQ, RFQStatus } from '../types'

const statusLabel: Record<RFQStatus, string> = {
  NEW: 'Sent',
  VIEWED: 'Viewed',
  RESPONDED: 'Quotes received',
  CLOSED: 'Closed',
}

function statusTone(s: RFQStatus) {
  if (s === 'NEW') return 'warning' as const
  if (s === 'VIEWED') return 'primary' as const
  if (s === 'RESPONDED') return 'success' as const
  return 'muted' as const
}

const order: RFQStatus[] = ['NEW', 'VIEWED', 'RESPONDED', 'CLOSED']

function timeline(r: RFQ) {
  const reached = order.indexOf(r.status)
  const n = r.manufacturerNames.length
  return [
    { label: 'RFQ created', detail: r.createdAt, icon: FileText, done: true },
    { label: `Sent to ${plural(n, 'manufacturer')}`, detail: 'Instantly', icon: Send, done: true },
    { label: 'Viewed by manufacturers', detail: reached >= 1 ? `${Math.max(1, n - 1)} of ${n} viewed` : 'Waiting', icon: Eye, done: reached >= 1 },
    { label: 'Quotations received', detail: reached >= 2 ? plural(quotesFor(r).length, 'quote') : 'Expected in 24–48 hrs', icon: MessageSquareText, done: reached >= 2 },
    { label: 'Supplier selected', detail: reached >= 3 ? 'Closed' : 'Pending', icon: Check, done: reached >= 3 },
  ]
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

const quoteTerms = [
  { price: '₹4.20 / pc', lead: '21 days', note: 'Material certificates + export packaging included', best: true },
  { price: '₹4.45 / pc', lead: '18 days', note: 'Ex-works, freight extra', best: false },
]

function quotesFor(r: RFQ) {
  return r.manufacturerNames.slice(0, 2).map((name, i) => ({ name, ...quoteTerms[i] }))
}

const filters: { id: 'all' | RFQStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'NEW', label: 'Sent' },
  { id: 'VIEWED', label: 'Viewed' },
  { id: 'RESPONDED', label: 'Quotes received' },
  { id: 'CLOSED', label: 'Closed' },
]

export function MyRFQs() {
  const { rfqs, selectedRfqId, setSelectedRfqId, updateRFQStatus, openRFQ } = useApp()
  const [filter, setFilter] = useState<'all' | RFQStatus>('all')
  const [query, setQuery] = useState('')

  const list = useMemo(
    () =>
      rfqs.filter(
        (r) =>
          (filter === 'all' || r.status === filter) &&
          `${r.id} ${r.product}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [rfqs, filter, query],
  )
  const selected = rfqs.find((r) => r.id === selectedRfqId) ?? list[0] ?? null

  const stats = [
    { label: 'Active RFQs', value: rfqs.filter((r) => r.status !== 'CLOSED').length },
    { label: 'Manufacturers contacted', value: new Set(rfqs.flatMap((r) => r.manufacturerIds)).size },
    { label: 'Quotes received', value: rfqs.filter((r) => r.status === 'RESPONDED').reduce((n, r) => n + quotesFor(r).length, 0) },
    { label: 'Avg. response time', value: '9.5 hrs' },
  ]

  return (
    <div>
      <PageHero
        crumb="My RFQs"
        eyebrow="Procurement"
        title="My RFQs"
        subtitle="Track every requirement you have sent — who viewed it, who quoted, and what to do next."
        actions={
          <Button size="lg" onClick={() => openRFQ()}>
            <Plus className="h-4 w-4" /> New RFQ
          </Button>
        }
      >
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="text-xs font-medium text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </PageHero>

      <div className="container-page py-8">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm font-semibold transition',
                  filter === f.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-surface text-secondary hover:border-primary/40',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="relative block md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search RFQ ID or product"
              className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>

        {rfqs.length === 0 ? (
          <div className="card-surface flex flex-col items-center px-6 py-16 text-center">
            <FileText className="h-10 w-10 text-border-strong" />
            <h2 className="text-h3 mt-4">No RFQs yet</h2>
            <p className="text-small mt-1 max-w-sm">Send your first requirement and receive quotes from verified manufacturers.</p>
            <Button className="mt-5" onClick={() => openRFQ()}>Create RFQ</Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-3">
              {list.length === 0 && (
                <div className="card-surface p-8 text-center text-sm text-muted">No RFQs match this filter.</div>
              )}
              {list.map((r) => {
                const active = r.id === selected?.id
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRfqId(r.id)}
                    className={cn(
                      'card-surface block w-full p-5 text-left transition hover:border-primary/40',
                      active && 'border-primary ring-2 ring-primary/15',
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-primary">{r.id}</span>
                          <Badge tone={statusTone(r.status)}>{statusLabel[r.status]}</Badge>
                          {r.id === 'RFQ-2026-10482' && <Badge tone="primary">Latest</Badge>}
                        </div>
                        <h3 className="mt-1.5 text-base font-bold text-secondary">{r.product}</h3>
                      </div>
                      {r.matchScore != null && (
                        <div className="text-right">
                          <div className="text-lg font-extrabold text-primary">{r.matchScore}%</div>
                          <div className="text-[10px] font-bold uppercase tracking-wide text-muted">AI match</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-medium text-muted">
                      <span className="inline-flex items-center gap-1.5"><Package className="h-3.5 w-3.5" />{r.quantity}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{r.delivery}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Within {r.requiredWithin}</span>
                      <span className="inline-flex items-center gap-1.5"><Send className="h-3.5 w-3.5" />{plural(r.manufacturerNames.length, 'manufacturer')}</span>
                    </div>
                    <div className="mt-4 flex gap-1">
                      {order.map((s, i) => (
                        <span
                          key={s}
                          className={cn('h-1.5 flex-1 rounded-full', i <= order.indexOf(r.status) ? 'bg-primary' : 'bg-surface-warm')}
                        />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>

            {selected && (
              <aside className="card-surface h-fit p-6 lg:sticky lg:top-24">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-caption text-primary">{selected.id}</p>
                    <h2 className="text-h3 mt-1">{selected.product}</h2>
                  </div>
                  <Badge tone={statusTone(selected.status)}>{statusLabel[selected.status]}</Badge>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-surface-muted p-4 text-sm">
                  {[
                    ['Quantity', selected.quantity],
                    ['Grade', `${selected.material} · ${selected.grade}`],
                    ['Delivery', selected.delivery],
                    ['Required', selected.requiredWithin],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs font-semibold text-muted">{k}</dt>
                      <dd className="mt-0.5 font-semibold text-secondary">{v}</dd>
                    </div>
                  ))}
                </dl>

                <h3 className="mt-6 text-sm font-bold text-secondary">Progress</h3>
                <ol className="mt-3 space-y-0">
                  {timeline(selected).map((step, i, arr) => (
                    <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
                      {i < arr.length - 1 && (
                        <span className={cn('absolute left-[13px] top-7 h-[calc(100%-20px)] w-0.5', step.done ? 'bg-primary' : 'bg-border')} />
                      )}
                      <span
                        className={cn(
                          'relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                          step.done ? 'bg-primary text-white' : 'border border-border bg-surface text-muted',
                        )}
                      >
                        <step.icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="pt-0.5">
                        <p className={cn('text-sm font-semibold', step.done ? 'text-secondary' : 'text-muted')}>{step.label}</p>
                        <p className="text-xs text-muted">{step.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {selected.status === 'RESPONDED' ? (
                  <>
                    <h3 className="mt-6 text-sm font-bold text-secondary">Quotations</h3>
                    <div className="mt-3 space-y-2">
                      {quotesFor(selected).map((q) => (
                        <div key={q.name} className={cn('rounded-xl border p-3', q.best ? 'border-success/40 bg-success-light' : 'border-border')}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-secondary">{q.name}</span>
                            <span className="text-sm font-extrabold text-primary">{q.price}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted">{q.lead} · {q.note}</p>
                          {q.best && <p className="mt-1 text-[11px] font-bold text-success">Best value · recommended by AI</p>}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="mt-6 flex gap-3 rounded-xl border border-primary/15 bg-primary-light p-4">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    <p className="text-xs leading-relaxed text-secondary">
                      Manufacturers usually respond within 24–48 hours. ABC Fasteners typically replies in under 6 hours.
                    </p>
                  </div>
                )}

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <Link to="/compare">
                    <Button variant="outline" className="w-full">Compare suppliers</Button>
                  </Link>
                  {selected.status !== 'CLOSED' ? (
                    <Button variant="ghost" className="w-full" onClick={() => updateRFQStatus(selected.id, 'CLOSED')}>
                      Close RFQ
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full" onClick={() => openRFQ({ product: selected.product })}>
                      Repeat RFQ
                    </Button>
                  )}
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
