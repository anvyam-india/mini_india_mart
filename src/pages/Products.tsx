import { Link } from 'react-router-dom'
import { products } from '../data/mockData'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'

export function Products() {
  const { openRFQ, toggleSaveProduct, savedProductIds } = useApp()

  return (
    <div className="container-page py-10">
      <h1 className="text-h1">Explore Industrial Products</h1>
      <p className="mt-2 mb-8 text-muted">
        Browse industrial products listed by verified manufacturers.
      </p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.id}
            className="card-surface overflow-hidden transition hover:shadow-card"
          >
            <div
              className="h-36"
              style={{ background: `linear-gradient(135deg, ${p.imageTone}, #0f172a)` }}
            />
            <div className="p-5">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge tone="primary">{p.grade}</Badge>
                <Badge>{p.category}</Badge>
              </div>
              <h2 className="font-bold text-secondary">{p.name}</h2>
              <p className="mt-1 text-sm text-muted">{p.manufacturerName}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-muted">
                <span className="rounded-lg bg-surface-muted px-2 py-1">
                  Material: {p.material.includes('Steel') ? 'SS304' : p.material}
                </span>
                <span className="rounded-lg bg-surface-muted px-2 py-1">
                  MOQ: {p.moq.includes('pcs') ? p.moq : `${p.moq} pcs`}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">Applications: {p.application}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/products/${p.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Product
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() =>
                    openRFQ({
                      product: p.name,
                      manufacturerIds: [p.manufacturerId],
                    })
                  }
                >
                  Request Quote
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSaveProduct(p.id)}
                >
                  {savedProductIds.includes(p.id) ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
