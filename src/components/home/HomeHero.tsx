import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Sparkles, BadgeCheck, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'

const popular = ['SS304 Fasteners', 'CNC Components', 'Injection Moulding', 'Packaging Machinery']

export function HomeHero() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const goSearch = (q?: string) => {
    const value = (q ?? query).trim() || 'SS304 bolt manufacturer Gujarat'
    navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  return (
    <section className="relative overflow-hidden bg-secondary text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/35 via-secondary to-secondary" />
      <div className="hero-grid-dark absolute inset-0" />

      <div className="container-page relative py-14 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">
            Where Industry Meets Opportunity
          </p>
          <h1 className="mt-3 text-[2.1rem] font-bold leading-[1.15] tracking-[-0.03em] text-white md:text-[2.75rem]">
            Find verified manufacturers in minutes
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300 md:text-base">
            Search Indian suppliers, compare capabilities, and send RFQs — without the clutter.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <div className="rounded-2xl bg-surface p-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)] sm:p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goSearch()}
                  placeholder="e.g. SS304 bolts manufacturer in Gujarat"
                  className="h-12 w-full rounded-xl border border-border bg-surface-muted pl-11 pr-4 text-sm text-secondary outline-none transition focus:border-primary focus:bg-surface"
                />
              </div>
              <Button size="lg" className="h-12 whitespace-nowrap px-6" onClick={() => goSearch()}>
                Search
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-semibold text-muted">Popular:</span>
              {popular.map((item) => (
                <button
                  key={item}
                  onClick={() => goSearch(item)}
                  className="rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-xs font-semibold text-secondary transition hover:border-primary hover:text-primary"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => navigate('/ai-search')}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" /> Try AI Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* Compact match strip — not a heavy side panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3"
        >
          {[
            { name: 'ABC Fasteners', place: 'Ahmedabad', score: '94%' },
            { name: 'Patel Engineering', place: 'Rajkot', score: '89%' },
            { name: 'Rajkot Precision', place: 'Rajkot', score: '84%' },
          ].map((m) => (
            <button
              key={m.name}
              onClick={() => goSearch('SS304 bolt manufacturer Gujarat')}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-left transition hover:bg-white/10"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold">
                {m.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{m.name}</div>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="h-3 w-3" /> {m.place}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-blue-200">{m.score}</div>
                <div className="text-[10px] font-semibold text-slate-500">match</div>
              </div>
            </button>
          ))}
        </motion.div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck className="h-3.5 w-3.5 text-green-400" /> 2,400+ verified manufacturers
          </span>
          <span>18,000+ products</span>
          <span>RFQs answered in 24–48 hrs</span>
          <button
            onClick={() => navigate('/manufacturers')}
            className="inline-flex items-center gap-1 font-semibold text-blue-200 hover:text-white"
          >
            Browse directory <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
