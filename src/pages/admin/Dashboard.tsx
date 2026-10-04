import { Link } from 'react-router-dom'
import {
  Building2,
  BadgeCheck,
  Package,
  FileText,
  Users,
  Crown,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { manufacturers } from '../../data/mockData'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { AIBriefingCard } from '../../components/portal/AIBriefingCard'
import type { RFQ } from '../../types'

function SimpleBarChart({
  title,
  values,
  labels,
}: {
  title: string
  values: number[]
  labels: string[]
}) {
  const max = Math.max(...values)
  return (
    <Card>
      <h3 className="text-caption mb-4">{title}</h3>
      <div className="flex h-40 items-end gap-2">
        {values.map((v, i) => (
          <div key={labels[i]} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md bg-primary transition"
              style={{ height: `${(v / max) * 100}%`, minHeight: 8 }}
            />
            <span className="text-[10px] font-semibold text-muted">{labels[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function rfqRequirement(r: RFQ) {
  if (r.id === 'RFQ-2026-10482') return '50,000 SS 304 Bolts'
  const qty = r.quantity.replace(/\s*units?/i, '')
  return `${qty} · ${r.product}`
}

export function AdminOverview() {
  const { rfqs, verificationItems } = useApp()
  const pending = verificationItems.filter((v) => v.status === 'Pending')
  const recentRegs = manufacturers.filter((m) => m.status === 'Pending' || m.established >= 2014).slice(0, 4)

  const stats = [
    { label: 'Manufacturers', value: '2,480', icon: Building2, delta: '▲ 64 this month' },
    { label: 'Verified', value: '1,842', icon: BadgeCheck, delta: '▲ 74% of total' },
    { label: 'Products', value: '8,920', icon: Package, delta: '▲ 9% MoM' },
    { label: 'Active RFQs', value: '326', icon: FileText, delta: '▲ 14% WoW' },
    { label: 'New Leads', value: '94', icon: Users, delta: '▲ 21 today' },
    { label: 'Premium Accounts', value: '28', icon: Crown, delta: '▲ 3 upgrades' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-caption text-primary">Operations</p>
        <h1 className="text-h1 mt-1">Platform Overview</h1>
        <p className="text-small mt-1">Manufacturers, RFQs, verification queue, and lead generation at a glance.</p>
      </div>

      <AIBriefingCard
        insights={[
          `${pending.length} manufacturer verification${pending.length === 1 ? '' : 's'} pending — oldest is ${pending[0]?.company ?? 'cleared'}.`,
          rfqs.some((r) => r.status === 'NEW')
            ? `${rfqs.filter((r) => r.status === 'NEW').length} new RFQ today. Fasteners and CNC components drive 55% of RFQ volume this week.`
            : 'Fasteners and CNC components drive 55% of RFQ volume this week — 326 RFQs are active.',
          'Platform revenue is ₹18.4L this month (+22% MoM). 12 premium renewals are due in the next 7 days.',
        ]}
        prompts={['Kitne verification pending hain?', 'Show today’s RFQ activity', 'Platform revenue this month']}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-caption">{s.label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light">
                <s.icon className="h-4 w-4 text-primary" />
              </span>
            </div>
            <div className="text-2xl font-extrabold text-secondary xl:text-3xl">{s.value}</div>
            <div className="mt-1 text-xs font-semibold text-success">{s.delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SimpleBarChart
          title="RFQ Activity"
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          values={[42, 55, 48, 70, 63, 38, 51]}
        />
        <SimpleBarChart
          title="Manufacturer Growth"
          labels={['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']}
          values={[180, 210, 240, 265, 290, 320]}
        />
        <SimpleBarChart
          title="Lead Generation"
          labels={['W1', 'W2', 'W3', 'W4']}
          values={[68, 74, 81, 94]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card padding={false} className="overflow-hidden">
          <div className="px-5 pt-5">
            <CardHeader
              title="Recent RFQs"
              subtitle="Live from shared demo state"
              action={
                <Link to="/admin/rfqs" className="text-sm font-semibold text-primary hover:underline">
                  View all
                </Link>
              }
            />
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-enterprise">
              <thead>
                <tr>
                  <th>RFQ ID</th>
                  <th>Buyer</th>
                  <th>Requirement</th>
                  <th>Manufacturers</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((r) => (
                  <tr key={r.id} className={r.id === 'RFQ-2026-10482' ? 'bg-primary-light/50' : undefined}>
                    <td className="font-bold text-primary">{r.id}</td>
                    <td className="font-semibold">{r.buyer}</td>
                    <td className="text-muted">{rfqRequirement(r)}</td>
                    <td>{r.manufacturerNames.length} Manufacturers</td>
                    <td>
                      <Badge tone={r.status === 'NEW' ? 'warning' : r.status === 'RESPONDED' ? 'success' : 'primary'}>
                        {r.status === 'NEW' ? 'New' : r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Pending verification"
              subtitle={`${pending.length} awaiting review`}
              action={
                <Link to="/admin/verification" className="text-sm font-semibold text-primary">
                  Open queue
                </Link>
              }
            />
            <ul className="space-y-3">
              {pending.length === 0 ? (
                <li className="rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted">
                  No pending verifications right now.
                </li>
              ) : (
                pending.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
                  >
                    <div>
                      <div className="text-sm font-bold">{v.company}</div>
                      <div className="text-small">{v.location}</div>
                    </div>
                    <Badge tone="warning">Pending</Badge>
                  </li>
                ))
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Recent registrations" subtitle="New manufacturer sign-ups" />
            <ul className="space-y-3">
              {recentRegs.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold">{m.name}</div>
                    <div className="text-small">
                      {m.city}, {m.state} · {m.industry}
                    </div>
                  </div>
                  <Badge tone={m.status === 'Active' ? 'success' : 'warning'}>{m.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
