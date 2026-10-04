import { toast } from 'sonner'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const campaigns = [
  {
    id: 'bc-1',
    name: 'SS Fasteners — UAE Export Push',
    audience: 'Buyers in UAE & Saudi Arabia',
    channel: 'Email + in-app',
    status: 'Active' as const,
    sent: '12,400',
    opens: '28%',
    period: 'Apr 1 – Apr 15, 2026',
  },
  {
    id: 'bc-2',
    name: 'Automotive RFQ Reminder',
    audience: 'Saved ABC Fasteners · Automotive',
    channel: 'In-app digest',
    status: 'Active' as const,
    sent: '3,200',
    opens: '41%',
    period: 'Apr 3 – Apr 10, 2026',
  },
  {
    id: 'bc-3',
    name: 'Premium Spotlight — Industrial Bolts',
    audience: 'Category: Industrial Fasteners',
    channel: 'Homepage feature',
    status: 'Scheduled' as const,
    sent: '—',
    opens: '—',
    period: 'Starts Apr 12, 2026',
  },
]

export function ManufacturerBroadcasts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption text-primary">Marketing</p>
          <h1 className="text-h1 mt-1">Broadcasts</h1>
          <p className="text-small mt-1">Campaigns that reach qualified buyers in your categories.</p>
        </div>
        <Button onClick={() => toast.message('New broadcast wizard — demo only.')}>
          Create campaign
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((c) => (
          <Card key={c.id}>
            <CardHeader
              title={c.name}
              subtitle={c.period}
              action={
                <Badge tone={c.status === 'Active' ? 'success' : 'primary'}>{c.status}</Badge>
              }
            />
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-caption normal-case tracking-normal">Audience</dt>
                <dd className="font-semibold text-secondary">{c.audience}</dd>
              </div>
              <div>
                <dt className="text-caption normal-case tracking-normal">Channel</dt>
                <dd className="font-semibold text-secondary">{c.channel}</dd>
              </div>
              <div>
                <dt className="text-caption normal-case tracking-normal">Reach</dt>
                <dd className="font-semibold text-secondary">{c.sent}</dd>
              </div>
              <div>
                <dt className="text-caption normal-case tracking-normal">Open rate</dt>
                <dd className="font-semibold text-secondary">{c.opens}</dd>
              </div>
            </dl>
            <Button variant="ghost" size="sm" className="mt-4">
              View report
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
