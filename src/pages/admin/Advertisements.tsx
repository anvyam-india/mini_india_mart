import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

type AdStatus = 'Active' | 'Scheduled' | 'Paused'

const campaigns: {
  id: string
  name: string
  type: string
  placement: string
  status: AdStatus
  impressions: string
  ctr: string
  budget: string
}[] = [
  {
    id: 'ad1',
    name: 'ABC Fasteners — Gujarat Spotlight',
    type: 'Sponsored Manufacturer',
    placement: 'Industrial Fasteners category',
    status: 'Active',
    impressions: '128K',
    ctr: '3.2%',
    budget: '₹45,000 / mo',
  },
  {
    id: 'ad2',
    name: 'SS 304 Industrial Bolt',
    type: 'Sponsored Product',
    placement: 'Search results — bolts',
    status: 'Active',
    impressions: '86K',
    ctr: '4.1%',
    budget: '₹28,000 / mo',
  },
  {
    id: 'ad3',
    name: 'ForgeLink Q2 Supplier Drive',
    type: 'Homepage Banner',
    placement: 'Home hero rotation',
    status: 'Scheduled',
    impressions: '—',
    ctr: '—',
    budget: '₹1,20,000 / campaign',
  },
  {
    id: 'ad4',
    name: 'Packaging Machinery Leaders',
    type: 'Category Placement',
    placement: 'Packaging Machinery',
    status: 'Paused',
    impressions: '42K',
    ctr: '2.4%',
    budget: '₹18,000 / mo',
  },
]

function statusTone(s: AdStatus) {
  if (s === 'Active') return 'success' as const
  if (s === 'Scheduled') return 'primary' as const
  return 'warning' as const
}

export function AdminAdvertisements() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption text-primary">Marketplace</p>
          <h1 className="text-h1 mt-1">Advertisements</h1>
          <p className="text-small mt-1">Sponsored listings, banners, and category placements.</p>
        </div>
        <Button variant="primary">Create campaign</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <Badge tone="muted" className="mb-2">
                  {c.type}
                </Badge>
                <h2 className="text-h3">{c.name}</h2>
                <p className="text-small mt-1">{c.placement}</p>
              </div>
              <Badge tone={statusTone(c.status)}>{c.status}</Badge>
            </div>
            <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
              <div>
                <dt className="text-caption normal-case tracking-normal">Impressions</dt>
                <dd className="font-bold">{c.impressions}</dd>
              </div>
              <div>
                <dt className="text-caption normal-case tracking-normal">CTR</dt>
                <dd className="font-bold">{c.ctr}</dd>
              </div>
              <div>
                <dt className="text-caption normal-case tracking-normal">Budget</dt>
                <dd className="font-bold">{c.budget}</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">
                Edit
              </Button>
              <Button size="sm" variant="ghost">
                {c.status === 'Paused' ? 'Resume' : 'Pause'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Placement inventory" subtitle="Available ad surfaces this quarter" />
        <ul className="grid gap-2 sm:grid-cols-2 text-sm">
          <li className="rounded-xl bg-surface-muted px-3 py-2">Homepage banner — 2 slots</li>
          <li className="rounded-xl bg-surface-muted px-3 py-2">Category top — 6 slots</li>
          <li className="rounded-xl bg-surface-muted px-3 py-2">Sponsored manufacturer — 12 slots</li>
          <li className="rounded-xl bg-surface-muted px-3 py-2">Sponsored product — 24 slots</li>
        </ul>
      </Card>
    </div>
  )
}
