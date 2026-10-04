import { Link, useParams } from 'react-router-dom'
import { FileText, ArrowLeft, Sparkles, BadgeCheck } from 'lucide-react'
import { getProductBySlug, getManufacturerById, products } from '../data/mockData'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useApp } from '../context/AppContext'

export function ProductPage() {
  const { slug } = useParams()
  const product = getProductBySlug(slug ?? '')
  const { openRFQ } = useApp()

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-h1">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block font-semibold text-primary">
          Browse products
        </Link>
      </div>
    )
  }

  const manufacturer = getManufacturerById(product.manufacturerId)
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3)

  return (
    <div className="container-page py-10">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div
          className="flex min-h-80 items-end rounded-2xl p-6 text-white shadow-card"
          style={{ background: `linear-gradient(145deg, ${product.imageTone}, #0f172a)` }}
        >
          <Badge className="border-white/20 bg-white/10 text-white">{product.category}</Badge>
        </div>

        <div>
          <h1 className="text-h1 mb-2">{product.name}</h1>
          {manufacturer && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/manufacturers/${manufacturer.slug}`}
                className="text-sm font-bold text-primary hover:underline"
              >
                {product.manufacturerName}
              </Link>
              {manufacturer.verified && (
                <Badge tone="success">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ['Material', product.material],
              ['Grade', product.grade],
              ['Size', product.size],
              ['MOQ', product.moq],
              ['Application', product.application],
              ['Capacity', product.capacity],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-surface px-4 py-3">
                <div className="text-caption">{label}</div>
                <div className="mt-1 text-sm font-semibold text-secondary">{value}</div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="lg"
              onClick={() =>
                openRFQ({
                  product: product.name.includes('Bolt')
                    ? 'SS 304 Industrial Bolts'
                    : product.name,
                  quantity: '50,000',
                  material: product.material,
                  grade: product.grade.replace(/\s/g, ''),
                  manufacturerIds: [product.manufacturerId, 'm2', 'm3'],
                })
              }
            >
              <FileText className="h-4 w-4" /> Request Quote
            </Button>
            <Link to="/ai-search">
              <Button size="lg" variant="outline">
                <Sparkles className="h-4 w-4" /> Ask AI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="card-surface mt-10 p-6">
        <h2 className="text-h3 mb-4">Technical Specifications</h2>
        <table className="table-enterprise">
          <tbody>
            {product.specs.map((s) => (
              <tr key={s.label}>
                <th className="w-1/3 !bg-transparent !normal-case !tracking-normal !text-muted">
                  {s.label}
                </th>
                <td className="font-medium">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {manufacturer && (
        <section className="card-surface mt-6 p-6">
          <h2 className="text-h3 mb-2">Manufacturer Information</h2>
          <p className="text-sm text-muted">
            {manufacturer.name} · {manufacturer.city}, {manufacturer.state} · {manufacturer.years} years
          </p>
          <Link to={`/manufacturers/${manufacturer.slug}`} className="mt-3 inline-block text-sm font-bold text-primary">
            View manufacturer profile →
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-h2 mb-4">Related Products</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} className="card-surface p-5 hover:border-primary/40">
                <div className="font-bold">{p.name}</div>
                <div className="mt-1 text-xs text-muted">{p.manufacturerName}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
