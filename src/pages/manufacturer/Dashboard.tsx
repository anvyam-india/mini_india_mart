import { Link } from 'react-router-dom'
import {
  Eye,
  FileText,
  MessageSquare,
  Package,
  CheckCircle2,
  Circle,
  ArrowRight,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { manufacturers } from '../../data/mockData'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { AIBriefingCard } from '../../components/portal/AIBriefingCard'

const mfg = manufacturers.find((m) => m.id === 'm1')!

const checklist = [
  { label: 'Company overview & logo', done: true },
  { label: 'Product catalog (2+ listings)', done: true },
  { label: 'Capabilities & certifications', done: true },
  { label: 'GST registration', done: false },
  { label: 'Factory photos & media', done: false },
  { label: 'Export markets & documentation', done: false },
]

function rfqDisplayTitle(id: string, product: string) {
  if (id === 'RFQ-2026-10482' || product.toLowerCase().includes('bolt')) {
    return 'SS 304 Industrial Bolts'
  }
  return product
}

function rfqDisplayMeta(rfq: { id: string; quantity: string; buyer: string; location: string }) {
  if (rfq.id === 'RFQ-2026-10482') {
    return {
      quantity: '50,000 units',
      buyer: 'ABC Auto Components',
      location: 'Ahmedabad',
      match: 94,
    }
  }
  return {
    quantity: rfq.quantity,
    buyer: rfq.buyer,
    location: rfq.location,
    match: undefined as number | undefined,
  }
}

export function ManufacturerOverview() {
  const { rfqs } = useApp()
  const newRFQs = rfqs.filter((r) => r.status === 'NEW')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const stats = [
    { label: 'Profile Views', value: mfg.profileViews.toLocaleString(), icon: Eye, delta: '▲ 18% vs last month' },
    { label: 'RFQs Received', value: String(rfqs.length), icon: FileText, delta: '▲ 2 this week' },
    { label: 'New Inquiries', value: '18', icon: MessageSquare, delta: '▲ 6% vs last month' },
    { label: 'Product Views', value: mfg.productViews.toLocaleString(), icon: Package, delta: '▲ 11% vs last month' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption text-primary">Overview</p>
          <h1 className="text-h1 mt-1">
            {greeting}, ABC Fasteners
          </h1>
          <p className="text-small mt-1">
            {mfg.city}, {mfg.state} · {mfg.industry}
          </p>
        </div>
        <Link to="/manufacturers/abc-fasteners">
          <Button variant="outline" size="sm">
            View public profile
          </Button>
        </Link>
      </div>

      <AIBriefingCard
        insights={[
          newRFQs.length > 0
            ? `${newRFQs.length} new RFQ waiting — ${newRFQs[0].id} has a 94% match. Reply within 6 hours to keep the Fast Responder badge.`
            : 'No new RFQs right now — your response rate is 96%, top 10% in Fasteners.',
          `Profile views are up 18% this month (${mfg.profileViews.toLocaleString('en-IN')}). Most buyers come from Gujarat and Maharashtra.`,
          'Adding GST and factory photos will lift your profile to 100% and rank you higher in buyer search.',
        ]}
        prompts={['Aaj kitne naye RFQ aaye?', 'Draft quotation for RFQ-2026-10482', 'Show my product performance']}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-caption">{stat.label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light">
                <stat.icon className="h-4 w-4 text-primary" />
              </span>
            </div>
            <div className="text-2xl font-bold text-secondary">{stat.value}</div>
            <div className="mt-1 text-xs font-semibold text-success">{stat.delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="New RFQs"
              subtitle="Respond quickly to improve conversion on high-match leads."
              action={
                <Link to="/manufacturer/rfqs">
                  <Button variant="ghost" size="sm">
                    View inbox <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />

            {newRFQs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border-strong px-6 py-10 text-center">
                <p className="text-small">No new RFQs in your inbox.</p>
                <p className="text-caption mt-2 normal-case tracking-normal">
                  Run the buyer RFQ demo to generate RFQ-2026-10482.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {newRFQs.map((rfq) => {
                  const meta = rfqDisplayMeta(rfq)
                  return (
                    <article
                      key={rfq.id}
                      className="rounded-2xl border border-primary/25 bg-primary-light/35 p-5"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge tone="warning">NEW</Badge>
                        <span className="text-caption normal-case tracking-normal">{rfq.id}</span>
                        {(meta.match ?? rfq.matchScore) != null && (
                          <Badge tone="primary">{meta.match ?? rfq.matchScore}% match</Badge>
                        )}
                      </div>
                      <h3 className="text-h3">{rfqDisplayTitle(rfq.id, rfq.product)}</h3>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <p className="text-small">
                          <span className="text-muted">Quantity: </span>
                          <span className="font-semibold text-secondary">{meta.quantity}</span>
                        </p>
                        <p className="text-small">
                          <span className="text-muted">Buyer: </span>
                          <span className="font-semibold text-secondary">{meta.buyer}</span>
                        </p>
                        <p className="text-small">
                          <span className="text-muted">Location: </span>
                          <span className="font-semibold text-secondary">{meta.location}</span>
                        </p>
                        <p className="text-small">
                          <span className="text-muted">Required within: </span>
                          <span className="font-semibold text-secondary">{rfq.requiredWithin}</span>
                        </p>
                      </div>
                      <Link to="/manufacturer/rfqs" className="mt-4 inline-block">
                        <Button size="sm">Open RFQ inbox</Button>
                      </Link>
                    </article>
                  )
                })}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Recent RFQ activity" subtitle="All requests in your workspace." />
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="table-enterprise">
                <thead>
                  <tr>
                    <th>RFQ ID</th>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqs.slice(0, 6).map((r) => (
                    <tr key={r.id}>
                      <td className="font-semibold">{r.id}</td>
                      <td>{rfqDisplayTitle(r.id, r.product)}</td>
                      <td className="text-muted">{r.buyer}</td>
                      <td>
                        <Badge
                          tone={
                            r.status === 'NEW'
                              ? 'warning'
                              : r.status === 'VIEWED'
                                ? 'primary'
                                : r.status === 'RESPONDED'
                                  ? 'success'
                                  : 'muted'
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Profile completion"
            subtitle="Complete your profile to rank higher in buyer search."
          />
          <div className="mb-4 flex items-end justify-between">
            <span className="text-3xl font-bold text-secondary">82%</span>
            <span className="text-small font-semibold">6 of 6 sections started</span>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full w-[82%] rounded-full bg-primary" />
          </div>
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-sm"
              >
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-warning" />
                )}
                <span className={item.done ? 'text-secondary' : 'text-muted'}>{item.label}</span>
              </li>
            ))}
          </ul>
          <Link to="/manufacturer/profile" className="mt-5 block">
            <Button variant="outline" className="w-full" size="sm">
              Complete profile
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
