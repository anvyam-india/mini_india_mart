import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const vendors = [
  {
    id: 'v1',
    name: 'TradeAssist India',
    category: 'Export Documentation',
    region: 'Pan India',
    rating: 4.7,
    activeJobs: 18,
    status: 'Active',
  },
  {
    id: 'v2',
    name: 'GulfRoute Logistics',
    category: 'Freight Forwarding',
    region: 'West India · GCC',
    rating: 4.5,
    activeJobs: 24,
    status: 'Active',
  },
  {
    id: 'v3',
    name: 'ClearPort Advisors',
    category: 'Customs',
    region: 'Mumbai · Chennai',
    rating: 4.6,
    activeJobs: 11,
    status: 'Active',
  },
  {
    id: 'v4',
    name: 'ForgeVisual Studio',
    category: 'Industrial Photography',
    region: 'Gujarat · Maharashtra',
    rating: 4.8,
    activeJobs: 6,
    status: 'Onboarding',
  },
  {
    id: 'v5',
    name: 'MSME Capital Desk',
    category: 'Finance',
    region: 'Pan India',
    rating: 4.4,
    activeJobs: 9,
    status: 'Active',
  },
]

export function AdminVendors() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption text-primary">Marketplace</p>
          <h1 className="text-h1 mt-1">Service Vendors</h1>
          <p className="text-small mt-1">Partners delivering logistics, finance, and marketing services to manufacturers.</p>
        </div>
        <Button variant="primary">Invite vendor</Button>
      </div>

      <Card padding={false} className="overflow-hidden">
        <div className="px-5 pt-5">
          <CardHeader title="Vendor network" subtitle={`${vendors.length} approved partners`} />
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>Region</th>
                <th>Rating</th>
                <th>Active jobs</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td className="font-semibold">{v.name}</td>
                  <td>{v.category}</td>
                  <td className="text-muted">{v.region}</td>
                  <td>{v.rating}</td>
                  <td>{v.activeJobs}</td>
                  <td>
                    <Badge tone={v.status === 'Active' ? 'success' : 'warning'}>{v.status}</Badge>
                  </td>
                  <td>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
