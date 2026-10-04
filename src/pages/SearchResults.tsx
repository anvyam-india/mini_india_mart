import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Sparkles, Check, X, SlidersHorizontal } from 'lucide-react'
import { searchManufacturers, searchProducts } from '../data/mockData'
import { ManufacturerCard } from '../components/manufacturers/ManufacturerCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/cn'

type Tab = 'all' | 'manufacturers' | 'products'
type Sort = 'relevance' | 'ai' | 'newest' | 'verified'

export function SearchResults() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const aiActive = params.get('ai') === '1'
  const [tab, setTab] = useState<Tab>('manufacturers')
  const [input, setInput] = useState(q)
  const [sort, setSort] = useState<Sort>(aiActive ? 'ai' : 'relevance')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>(
    q.toLowerCase().includes('gujarat') ? ['Gujarat', 'SS304', 'Fasteners'] : [],
  )
  const [matchDrawer, setMatchDrawer] = useState<string | null>(null)

  const manufacturers = useMemo(() => {
    let list = searchManufacturers(q)
    if (sort === 'verified') list = [...list].sort((a, b) => Number(b.verified) - Number(a.verified))
    if (sort === 'newest') list = [...list].sort((a, b) => b.established - a.established)
    if (sort === 'ai' || aiActive) {
      list = [...list].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    }
    return list
  }, [q, sort, aiActive])

  const products = useMemo(() => searchProducts(q), [q])
  const demoCount =
    q.toLowerCase().includes('ss') || q.toLowerCase().includes('bolt') || q.toLowerCase().includes('304')
      ? 12
      : manufacturers.length

  const runSearch = () => setParams({ q: input.trim(), ...(aiActive ? { ai: '1' } : {}) })

  const removeFilter = (f: string) => setActiveFilters((prev) => prev.filter((x) => x !== f))

  return (
    <div className="container-page py-10">
      <div className="mb-6 rounded-2xl border border-border bg-surface p-3 shadow-soft">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              className="h-11 w-full rounded-xl border border-border bg-surface-muted pl-10 pr-3 text-sm outline-none focus:border-primary focus:bg-surface"
            />
          </div>
          <Button onClick={runSearch}>Search</Button>
          <Link to="/ai-search">
            <Button variant="outline">
              <Sparkles className="h-4 w-4" /> AI Search
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h1 className="text-h1 text-[1.75rem]">Search Results</h1>
        {aiActive && (
          <Badge tone="primary">
            <Sparkles className="h-3 w-3" /> AI Search Active
          </Badge>
        )}
      </div>
      <p className="text-muted">
        Search: <span className="font-semibold text-secondary">“{q || 'all'}”</span>
      </p>
      <p className="mt-1 text-sm font-bold text-primary">{demoCount} Manufacturers Found</p>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted">Applied filters:</span>
          {activeFilters.map((f) => (
            <button
              key={f}
              onClick={() => removeFilter(f)}
              className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary"
            >
              {f} <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex gap-2">
          {(
            [
              ['manufacturers', 'Manufacturers'],
              ['products', 'Products'],
              ['all', 'All'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-bold transition',
                tab === key ? 'bg-primary-light text-primary' : 'text-muted hover:text-secondary',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-9 rounded-lg border border-border bg-surface px-2 text-sm font-semibold"
            >
              <option value="relevance">Relevance</option>
              <option value="ai">AI Match</option>
              <option value="newest">Newest</option>
              <option value="verified">Most Verified</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside
          className={cn(
            'card-surface h-fit space-y-4 p-5',
            filtersOpen ? 'fixed inset-x-4 top-20 z-40 max-h-[80vh] overflow-y-auto lg:static' : 'hidden lg:block',
          )}
        >
          <div className="flex items-center justify-between">
            <div className="text-caption">Filters</div>
            <button className="lg:hidden" onClick={() => setFiltersOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
          {[
            ['Location', ['Gujarat', 'Maharashtra', 'Tamil Nadu']],
            ['Industry', ['Industrial Fasteners', 'Precision Components', 'Packaging']],
            ['Certification', ['ISO 9001', 'CE', 'IATF 16949']],
            ['Verification', ['Verified only', 'Premium']],
            ['Export Markets', ['UAE', 'USA', 'Germany']],
          ].map(([title, options]) => (
            <details key={title as string} open className="group">
              <summary className="cursor-pointer list-none text-sm font-bold text-secondary">
                {title as string}
              </summary>
              <div className="mt-2 space-y-2">
                {(options as string[]).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(opt)}
                      onChange={(e) =>
                        setActiveFilters((prev) =>
                          e.target.checked ? [...prev, opt] : prev.filter((x) => x !== opt),
                        )
                      }
                      className="accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </details>
          ))}
        </aside>

        <div>
          {(tab === 'all' || tab === 'manufacturers') && (
            <section className="mb-10">
              {manufacturers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-12 text-center">
                  <p className="font-bold text-secondary">
                    No manufacturers found for this exact requirement.
                  </p>
                  <p className="mt-2 text-sm text-muted">Try another location, remove a certification filter, or broaden your search.</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <Button variant="outline" onClick={() => setActiveFilters([])}>
                      Clear filters
                    </Button>
                    <Link to="/ai-search">
                      <Button>
                        <Sparkles className="h-4 w-4" /> Try AI Search
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {manufacturers.map((m) => (
                    <div key={m.id} className="relative">
                      {(aiActive || sort === 'ai') && m.matchScore != null && (
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <Badge tone="warning" className="text-sm">
                            {m.matchScore >= 90 ? `${m.matchScore}% Strong Match` : `${m.matchScore}% Match`}
                          </Badge>
                          <button
                            onClick={() => setMatchDrawer(m.id)}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            View Match Details
                          </button>
                        </div>
                      )}
                      {(aiActive || sort === 'ai') && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {[
                            'Product capability',
                            'Gujarat location',
                            'Required quantity',
                            'SS304 capability',
                            'Export experience',
                          ].map((reason) => (
                            <span
                              key={reason}
                              className="inline-flex items-center gap-1 rounded-md bg-success-light px-2 py-1 text-[11px] font-semibold text-success"
                            >
                              <Check className="h-3 w-3" /> {reason}
                            </span>
                          ))}
                        </div>
                      )}
                      <ManufacturerCard manufacturer={m} showMatch={aiActive || sort === 'ai'} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {(tab === 'all' || tab === 'products') && (
            <section>
              <h2 className="mb-4 text-lg font-bold">Products</h2>
              {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-strong p-10 text-center text-sm text-muted">
                  No products matched this query.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.slug}`}
                      className="card-surface p-5 transition hover:border-primary/30"
                    >
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge tone="primary">{p.grade}</Badge>
                        <Badge>{p.category}</Badge>
                      </div>
                      <h3 className="font-bold text-secondary">{p.name}</h3>
                      <p className="mt-1 text-sm text-muted">{p.manufacturerName}</p>
                      <p className="mt-3 text-xs text-muted">
                        MOQ {p.moq} · Capacity {p.capacity}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {matchDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-secondary/40" onClick={() => setMatchDrawer(null)}>
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-surface p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-h3">AI Match Details</h3>
              <button onClick={() => setMatchDrawer(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted">
              This manufacturer scored highly because product capability, location, quantity readiness,
              material grade and export experience align with your requirement.
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Product capability match',
                'Location fit: Gujarat',
                'Capacity supports required quantity',
                'SS304 manufacturing experience',
                'Export documentation readiness',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2 text-sm font-semibold">
                  <Check className="h-4 w-4 text-success" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
