import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Car,
  Cog,
  Layers,
  Package,
  Zap,
  Factory,
  Sparkles,
} from 'lucide-react'
import { manufacturers, products } from '../data/mockData'
import { ManufacturerCard } from '../components/manufacturers/ManufacturerCard'
import { Button } from '../components/ui/Button'
import { HomeHero } from '../components/home/HomeHero'
import { useApp } from '../context/AppContext'

const industries = [
  { name: 'Automotive', count: 482, icon: Car, q: 'Automotive Components' },
  { name: 'Engineering', count: 610, icon: Cog, q: 'Precision Components' },
  { name: 'Plastics', count: 540, icon: Layers, q: 'Plastic Manufacturing' },
  { name: 'Packaging', count: 386, icon: Package, q: 'Packaging Machinery' },
  { name: 'Electrical', count: 420, icon: Zap, q: 'Electrical Components' },
  { name: 'Machinery', count: 470, icon: Factory, q: 'Machinery' },
]

const steps = [
  { n: '1', title: 'Search', text: 'Find manufacturers by product, location or industry.' },
  { n: '2', title: 'Compare', text: 'Shortlist by capacity, certifications and export readiness.' },
  { n: '3', title: 'Send RFQ', text: 'Share your requirement and get quotes in 24–48 hours.' },
]

export function Home() {
  const navigate = useNavigate()
  const { openRFQ } = useApp()

  return (
    <div>
      <HomeHero />

      {/* How it works — short orientation */}
      <section className="border-b border-border bg-surface">
        <div className="container-page grid gap-6 py-10 md:grid-cols-3 md:gap-8 md:py-12">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-sm font-extrabold text-primary">
                {s.n}
              </span>
              <div>
                <h2 className="text-base font-bold text-secondary">{s.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Manufacturers */}
      <section className="container-page py-14 md:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-h1">Verified manufacturers</h2>
            <p className="mt-1.5 text-sm text-muted">Trusted suppliers across India’s industrial hubs.</p>
          </div>
          <Link to="/manufacturers" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {manufacturers
            .filter((m) => m.verified)
            .slice(0, 3)
            .map((m) => (
              <ManufacturerCard key={m.id} manufacturer={m} />
            ))}
        </div>
      </section>

      {/* Industries — compact */}
      <section className="border-y border-border bg-surface-muted py-14 md:py-16">
        <div className="container-page">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-h1">Browse by industry</h2>
              <p className="mt-1.5 text-sm text-muted">Jump straight into the category you need.</p>
            </div>
            <Link to="/categories" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary">
              All categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((ind) => (
              <Link
                key={ind.name}
                to={`/manufacturers?industry=${encodeURIComponent(ind.q)}`}
                className="rounded-xl border border-border bg-surface px-4 py-4 transition hover:border-primary/40"
              >
                <ind.icon className="mb-3 h-5 w-5 text-primary" />
                <div className="text-sm font-bold text-secondary">{ind.name}</div>
                <div className="mt-0.5 text-xs text-muted">{ind.count} suppliers</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container-page py-14 md:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-h1">Popular products</h2>
            <p className="mt-1.5 text-sm text-muted">Clear specs, MOQs and ready-to-quote listings.</p>
          </div>
          <Link to="/products" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary">
            Browse products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.slice(0, 3).map((p) => (
            <div key={p.id} className="card-surface flex flex-col overflow-hidden">
              <div
                className="h-28"
                style={{ background: `linear-gradient(135deg, ${p.imageTone}, #0f172a)` }}
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-secondary">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.manufacturerName}</p>
                <p className="mt-3 text-xs font-semibold text-muted">
                  {p.grade} · MOQ {p.moq.includes('pcs') ? p.moq : `${p.moq} pcs`}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link to={`/products/${p.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() =>
                      openRFQ({ product: p.name, manufacturerIds: [p.manufacturerId] })
                    }
                  >
                    Quote
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Single CTA */}
      <section className="container-page pb-14 md:pb-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-secondary px-6 py-8 text-white md:flex-row md:items-center md:px-10 md:py-10">
          <div className="max-w-lg">
            <h2 className="text-xl font-bold md:text-2xl">Not sure where to start?</h2>
            <p className="mt-2 text-sm text-slate-300">
              Describe your requirement in plain language — AI will shortlist matching manufacturers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate('/ai-search')}>
              <Sparkles className="h-4 w-4" /> Try AI Search
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate('/manufacturers')}
            >
              Browse directory
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
