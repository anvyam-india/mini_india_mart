import { products } from '../../data/mockData'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

export function AdminProducts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption text-primary">Catalog</p>
          <h1 className="text-h1 mt-1">Products</h1>
          <p className="text-small mt-1">Platform product listings and moderation.</p>
        </div>
        <Button variant="primary">Add product</Button>
      </div>

      <Card padding={false} className="overflow-hidden">
        <div className="px-5 pt-5">
          <CardHeader title="Product catalog" subtitle={`${products.length} demo listings · 8,920 live on platform`} />
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Product</th>
                <th>Manufacturer</th>
                <th>Category</th>
                <th>Grade</th>
                <th>MOQ</th>
                <th>Views</th>
                <th>Inquiries</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold">{p.name}</td>
                  <td className="text-muted">{p.manufacturerName}</td>
                  <td>{p.category}</td>
                  <td>{p.grade}</td>
                  <td>{p.moq}</td>
                  <td>{p.views.toLocaleString()}</td>
                  <td>{p.inquiries}</td>
                  <td>
                    <Badge tone={p.status === 'Active' ? 'success' : 'muted'}>{p.status}</Badge>
                  </td>
                  <td>
                    <Button size="sm" variant="ghost">
                      Moderate
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
