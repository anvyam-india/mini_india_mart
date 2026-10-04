import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Bookmark, Building2, Package, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getManufacturerById, products } from '../data/mockData'
import { PageHero } from '../components/layout/PageHero'
import { ManufacturerCard } from '../components/manufacturers/ManufacturerCard'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/cn'

type Tab = 'manufacturers' | 'products'

export function Saved() {
  const { savedIds, savedProductIds, toggleSaveProduct, openRFQ, compareIds } = useApp()
  const [params] = useSearchParams()
  const [tab, setTab] = useState<Tab>(params.get('tab') === 'products' ? 'products' : 'manufacturers')

  const savedManufacturers = savedIds
    .map((id) => getManufacturerById(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
  const savedProducts = products.filter((p) => savedProductIds.includes(p.id))

  const tabs = [
    { id: 'manufacturers' as const, label: 'Manufacturers', icon: Building2, count: savedManufacturers.length },
    { id: 'products' as const, label: 'Products', icon: Package, count: savedProducts.length },
  ]

  return (
    <div>
      <PageHero
        crumb="Saved"
        eyebrow="Your shortlist"
        title="Saved Suppliers & Products"
        subtitle="Keep 3–5 verified manufacturers per category, compare them side by side, and send one RFQ to all."
        actions={
          savedManufacturers.length > 0 && (
            <Button
              size="lg"
              onClick={() => openRFQ({ manufacturerIds: savedManufacturers.map((m) => m.id).slice(0, 5) })}
            >
              Send RFQ to shortlist
            </Button>
          )
        }
      />

      <div className="container-page py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-border bg-surface p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
                  tab === t.id ? 'bg-primary text-white' : 'text-secondary hover:bg-surface-muted',
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                <span
                  className={cn(
                    'rounded-md px-1.5 text-xs',
                    tab === t.id ? 'bg-white/20' : 'bg-surface-warm text-muted',
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          {compareIds.length > 0 && (
            <Link to="/compare" className="text-sm font-semibold text-primary hover:underline">
              Compare {compareIds.length} selected →
            </Link>
          )}
        </div>

        {tab === 'manufacturers' &&
          (savedManufacturers.length === 0 ? (
            <Empty
              title="No saved manufacturers"
              text="Tap the heart on any manufacturer card to build your shortlist."
              to="/manufacturers"
              cta="Explore manufacturers"
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {savedManufacturers.map((m) => (
                <ManufacturerCard key={m.id} manufacturer={m} />
              ))}
            </div>
          ))}

        {tab === 'products' &&
          (savedProducts.length === 0 ? (
            <Empty
              title="No saved products"
              text="Save products to review specifications and request quotes later."
              to="/products"
              cta="Browse products"
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {savedProducts.map((p) => (
                <div key={p.id} className="card-surface overflow-hidden transition hover:shadow-card">
                  <div className="relative h-32" style={{ background: `linear-gradient(135deg, ${p.imageTone}, #0f172a)` }}>
                    <button
                      onClick={() => toggleSaveProduct(p.id)}
                      className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-danger hover:bg-white"
                      aria-label="Remove saved product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-secondary">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted">{p.manufacturerName}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-lg bg-surface-muted px-2 py-1 font-semibold">{p.material} · {p.grade}</span>
                      <span className="rounded-lg bg-surface-muted px-2 py-1 font-semibold">MOQ {p.moq}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link to={`/products/${p.slug}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">View Product</Button>
                      </Link>
                      <Button size="sm" onClick={() => openRFQ({ product: p.name, manufacturerIds: [p.manufacturerId] })}>
                        Request Quote
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}

function Empty({ title, text, to, cta }: { title: string; text: string; to: string; cta: string }) {
  return (
    <div className="card-surface flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <Bookmark className="h-6 w-6" />
      </span>
      <h2 className="text-h3 mt-4">{title}</h2>
      <p className="text-small mt-1 max-w-sm">{text}</p>
      <Link to={to} className="mt-5">
        <Button>{cta}</Button>
      </Link>
    </div>
  )
}
