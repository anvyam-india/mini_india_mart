import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const broadcasts = [
  {
    id: 'b1',
    title: 'Verification SLA update for Q2',
    audience: 'All manufacturers',
    channel: 'Email + In-app',
    sentAt: '2026-04-01',
    status: 'Delivered',
    reach: '2,480',
  },
  {
    id: 'b2',
    title: 'Premium listing benefits — March recap',
    audience: 'Premium accounts',
    channel: 'In-app',
    sentAt: '2026-03-28',
    status: 'Delivered',
    reach: '28',
  },
  {
    id: 'b3',
    title: 'RFQ response best practices',
    audience: 'Industrial Fasteners category',
    channel: 'Email',
    sentAt: 'Scheduled · 2026-04-05',
    status: 'Scheduled',
    reach: '1,240',
  },
  {
    id: 'b4',
    title: 'Platform maintenance — April 6',
    audience: 'All users',
    channel: 'Banner + Email',
    sentAt: 'Draft',
    status: 'Draft',
    reach: '—',
  },
]

function statusTone(s: string) {
  if (s === 'Delivered') return 'success' as const
  if (s === 'Scheduled') return 'primary' as const
  return 'muted' as const
}

export function AdminBroadcasts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption text-primary">Communications</p>
          <h1 className="text-h1 mt-1">Broadcasts</h1>
          <p className="text-small mt-1">Platform announcements to manufacturers and buyers.</p>
        </div>
        <Button variant="primary">New broadcast</Button>
      </div>

      <div className="grid gap-4">
        {broadcasts.map((b) => (
          <Card key={b.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                <span className="text-caption normal-case tracking-normal">{b.channel}</span>
              </div>
              <h2 className="text-h3">{b.title}</h2>
              <p className="text-small mt-1">
                Audience: {b.audience} · {b.sentAt}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-caption">Reach</div>
                <div className="text-xl font-extrabold text-secondary">{b.reach}</div>
              </div>
              <Button size="sm" variant="outline">
                {b.status === 'Draft' ? 'Continue' : 'View report'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Delivery health" subtitle="Last 30 days" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-muted p-4">
            <div className="text-caption">Open rate</div>
            <div className="text-2xl font-extrabold">38.4%</div>
          </div>
          <div className="rounded-xl bg-surface-muted p-4">
            <div className="text-caption">Click rate</div>
            <div className="text-2xl font-extrabold">12.1%</div>
          </div>
          <div className="rounded-xl bg-surface-muted p-4">
            <div className="text-caption">Unsubscribes</div>
            <div className="text-2xl font-extrabold">0.3%</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
