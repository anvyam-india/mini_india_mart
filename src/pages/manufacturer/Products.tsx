import { Link } from 'react-router-dom'
import { Plus, Pencil, Eye, Archive } from 'lucide-react'
import { toast } from 'sonner'
import { products } from '../../data/mockData'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const myProducts = products.filter((p) => p.manufacturerId === 'm1')

export function ManufacturerProducts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption text-primary">Catalog</p>
          <h1 className="text-h1 mt-1">My Products</h1>
          <p className="text-small mt-1">
            {myProducts.length} active listings · Industrial Fasteners
          </p>
        </div>
        <Button
          onClick={() => toast.success('Add Product flow opens in the full product module demo.')}
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Views</th>
                <th>Inquiries</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 shrink-0 rounded-xl"
                        style={{ background: p.imageTone }}
                      />
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-small">{p.grade} · MOQ {p.moq}</p>
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.views.toLocaleString()}</td>
                  <td>{p.inquiries}</td>
                  <td>
                    <Badge tone={p.status === 'Active' ? 'success' : 'muted'}>{p.status}</Badge>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.message(`Editing ${p.name}`)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Link to={`/products/${p.slug}`}>
                        <Button variant="ghost" size="sm" aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.message(`${p.name} archived in demo.`)}
                        aria-label="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Listing tips"
          subtitle="Products with complete specs and export notes receive more RFQ matches."
        />
        <p className="text-small">
          Use the{' '}
          <Link to="/manufacturer/ai-product" className="font-semibold text-primary">
            AI Product Tool
          </Link>{' '}
          to draft descriptions for new SKUs in under a minute.
        </p>
      </Card>
    </div>
  )
}
