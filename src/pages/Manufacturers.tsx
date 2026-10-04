import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { manufacturers, locations, industries, companySizes } from '../data/mockData'
import { ManufacturerCard } from '../components/manufacturers/ManufacturerCard'
import { cn } from '../lib/cn'

type Sort = 'relevance' | 'verified' | 'newest'

export function Manufacturers() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('All')
  const [industry, setIndustry] = useState(params.get('industry') ?? 'All')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [exportOnly, setExportOnly] = useState(false)
  const [cert, setCert] = useState('All')
  const [size, setSize] = useState('All')
  const [sort, setSort] = useState<Sort>('relevance')
  const [mobileFilters, setMobileFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = manufacturers.filter((m) => {
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.industry.toLowerCase().includes(q) ||
        m.products.some((p) => p.toLowerCase().includes(q)) ||
        m.city.toLowerCase().includes(q)
      const matchesLocation =
        location === 'All' || m.state === location || location === 'All India'
      const matchesIndustry = industry === 'All' || m.industry === industry
      const matchesVerified = !verifiedOnly || m.verified
      const matchesExport = !exportOnly || m.canExport
      const matchesCert = cert === 'All' || m.certifications.includes(cert)
      const matchesSize = size === 'All' || m.companySize === size
      return (
        matchesQuery &&
        matchesLocation &&
        matchesIndustry &&
        matchesVerified &&
        matchesExport &&
        matchesCert &&
        matchesSize
      )
    })
    if (sort === 'verified') list = [...list].sort((a, b) => Number(b.verified) - Number(a.verified))
    if (sort === 'newest') list = [...list].sort((a, b) => b.established - a.established)
    return list
  }, [query, location, industry, verifiedOnly, exportOnly, cert, size, sort])

  const chips = [
    industry !== 'All' && industry,
    location !== 'All' && location,
    cert !== 'All' && cert,
    verifiedOnly && 'Verified',
    exportOnly && 'Export ready',
  ].filter(Boolean) as string[]

  const FilterPanel = (
    <aside className="card-surface h-fit space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-caption">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
        </div>
        <button className="lg:hidden" onClick={() => setMobileFilters(false)}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">Industry</span>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-surface px-3"
        >
          <option value="All">All industries</option>
          {industries.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">Location</span>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-surface px-3"
        >
          <option value="All">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">Certification</span>
        <select
          value={cert}
          onChange={(e) => setCert(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-surface px-3"
        >
          <option value="All">All</option>
          <option value="ISO 9001">ISO 9001</option>
          <option value="CE">CE</option>
          <option value="RoHS">RoHS</option>
          <option value="IATF 16949">IATF 16949</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold">Company Size</span>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-surface px-3"
        >
          <option value="All">All sizes</option>
          {companySizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          className="accent-primary"
        />
        Verified only
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={exportOnly}
          onChange={(e) => setExportOnly(e.target.checked)}
          className="accent-primary"
        />
        Export Capability
      </label>
    </aside>
  )

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-h1">Manufacturer Directory</h1>
        <p className="mt-2 text-muted">
          Browse verified Indian manufacturers by location, industry and export capability.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manufacturers, products, cities…"
            className="h-11 w-full rounded-xl border border-border bg-surface-muted pl-10 pr-3 text-sm outline-none focus:border-primary focus:bg-surface"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-secondary">
            {filtered.length.toLocaleString()} Manufacturers Found
          </div>
          {chips.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-lg border border-primary/20 bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold lg:hidden"
            onClick={() => setMobileFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-9 rounded-lg border border-border bg-surface px-2 text-sm font-semibold"
          >
            <option value="relevance">Relevance</option>
            <option value="verified">Most Verified</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">{FilterPanel}</div>
        {mobileFilters && (
          <div className="fixed inset-0 z-40 bg-secondary/40 lg:hidden" onClick={() => setMobileFilters(false)}>
            <div
              className={cn('absolute left-0 top-0 h-full w-[300px] overflow-y-auto bg-surface p-4')}
              onClick={(e) => e.stopPropagation()}
            >
              {FilterPanel}
            </div>
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-12 text-center">
              <p className="font-bold text-secondary">No manufacturers match these filters</p>
              <p className="mt-1 text-sm text-muted">Try clearing filters or broadening your search.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((m) => (
                <ManufacturerCard key={m.id} manufacturer={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
