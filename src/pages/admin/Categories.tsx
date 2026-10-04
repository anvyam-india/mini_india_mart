import { categories } from '../../data/mockData'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

export function AdminCategories() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption text-primary">Marketplace</p>
          <h1 className="text-h1 mt-1">Categories</h1>
          <p className="text-small mt-1">Taxonomy for discovery, filters, and category placements.</p>
        </div>
        <Button variant="primary">New category</Button>
      </div>

      <Card padding={false} className="overflow-hidden">
        <div className="px-5 pt-5">
          <CardHeader title="Category tree" subtitle={`${categories.length} top-level categories`} />
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Listings</th>
                <th>Icon</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="font-semibold">{c.name}</td>
                  <td className="text-muted max-w-md">{c.description}</td>
                  <td>
                    <Badge tone="primary">{c.count.toLocaleString()}</Badge>
                  </td>
                  <td className="text-muted">{c.icon}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost">
                        Merge
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
