import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { manufacturers, products } from '../../data/mockData'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

export function AdminManufacturers() {
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    return manufacturers
      .map((m) => ({
        ...m,
        productCount: products.filter((p) => p.manufacturerId === m.id).length,
        rfqCount: m.id === 'm1' || m.id === 'm2' || m.id === 'm3' ? 12 : 4,
      }))
      .filter((m) => {
        if (verifiedFilter === 'yes' && !m.verified) return false
        if (verifiedFilter === 'no' && m.verified) return false
        if (premiumFilter === 'yes' && !m.premium) return false
        if (premiumFilter === 'no' && m.premium) return false
        if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
  }, [verifiedFilter, premiumFilter, search])

  const action = (label: string) => {
    toast.message(label)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Operations</p>
        <h1 className="text-h1 mt-1">Manufacturers</h1>
        <p className="text-small mt-1">Manage listings, verification, premium status, and account health.</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 min-w-[200px] flex-1 rounded-xl border border-border px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value as typeof verifiedFilter)}
            className="h-10 rounded-xl border border-border px-3 text-sm"
          >
            <option value="all">All verification</option>
            <option value="yes">Verified</option>
            <option value="no">Unverified</option>
          </select>
          <select
            value={premiumFilter}
            onChange={(e) => setPremiumFilter(e.target.value as typeof premiumFilter)}
            className="h-10 rounded-xl border border-border px-3 text-sm"
          >
            <option value="all">All premium</option>
            <option value="yes">Premium</option>
            <option value="no">Standard</option>
          </select>
        </div>
      </Card>

      <Card padding={false} className="overflow-hidden">
        <div className="px-5 pt-5">
          <CardHeader title="Manufacturer directory" subtitle={`${rows.length} records in demo dataset`} />
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Company</th>
                <th>Location</th>
                <th>Category</th>
                <th>Verification</th>
                <th>Premium</th>
                <th>Products</th>
                <th>RFQs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td className="font-semibold">{m.name}</td>
                  <td className="text-muted">
                    {m.city}, {m.state}
                  </td>
                  <td>{m.industry}</td>
                  <td>
                    <Badge tone={m.verified ? 'success' : 'warning'}>{m.verified ? 'Verified' : 'Pending'}</Badge>
                  </td>
                  <td>
                    <Badge tone={m.premium ? 'primary' : 'muted'}>{m.premium ? 'Premium' : 'Standard'}</Badge>
                  </td>
                  <td>{m.productCount}</td>
                  <td>{m.rfqCount}</td>
                  <td>
                    <Badge tone={m.status === 'Active' ? 'success' : m.status === 'Suspended' ? 'danger' : 'warning'}>
                      {m.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="ghost" onClick={() => action(`View ${m.name}`)}>
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => action(`Edit ${m.name}`)}>
                        Edit
                      </Button>
                      {!m.verified && (
                        <Button size="sm" variant="success" onClick={() => action(`Verified ${m.name}`)}>
                          Verify
                        </Button>
                      )}
                      <Button size="sm" variant="danger" onClick={() => action(`Rejected ${m.name}`)}>
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => action(`Suspended ${m.name}`)}>
                        Suspend
                      </Button>
                    </div>
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
