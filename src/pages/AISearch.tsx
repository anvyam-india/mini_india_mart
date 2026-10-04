import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, MapPin, Package, Hash, Globe2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { manufacturers } from '../data/mockData'
import type { AIMatchResult } from '../types'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'

const defaultQuery =
  'I need 20,000 SS 304 screws from a Gujarat manufacturer that can export to UAE.'

function buildMatches(): AIMatchResult[] {
  const ids = ['m1', 'm2', 'm3', 'm4']
  const scores = [94, 89, 84, 81]
  return ids.map((id, i) => ({
    manufacturer: manufacturers.find((m) => m.id === id)!,
    score: scores[i],
    breakdown: {
      product: true,
      location: true,
      export: true,
      capacity: i < 3,
      moq: i < 3,
    },
  }))
}

export function AISearch() {
  const [query, setQuery] = useState(defaultQuery)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [matches, setMatches] = useState<AIMatchResult[]>([])
  const { openRFQ, toggleCompare } = useApp()

  const run = async () => {
    setLoading(true)
    setDone(false)
    await new Promise((r) => setTimeout(r, 1400))
    setMatches(buildMatches())
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="hero-pattern min-h-[70vh] border-b border-border">
      <div className="container-page py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI Requirement Matching
          </div>
          <h1 className="text-h1 mb-3 text-[2.35rem] md:text-[2.75rem]">Describe what you need</h1>
          <p className="mb-8 text-muted">
            Describe your product, quantity, location and export needs in plain language.
          </p>

          <div className="rounded-2xl border border-border bg-surface p-3 text-left shadow-card">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-surface-muted p-4 text-sm outline-none focus:border-primary focus:bg-surface"
            />
            <div className="mt-3 flex justify-end">
              <Button size="lg" onClick={run} disabled={loading}>
                <Sparkles className="h-4 w-4" />
                {loading ? 'Analyzing requirement…' : 'Search with AI'}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-12 max-w-xl rounded-2xl border border-border bg-surface p-8 text-center shadow-soft"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <Sparkles className="h-7 w-7 animate-pulse text-primary" />
              </div>
              <p className="font-bold text-secondary">Understanding your requirement…</p>
              <p className="mt-1 text-sm text-muted">
                Extracting product, location, quantity and export market
              </p>
              <div className="mx-auto mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-surface-muted">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '10%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {done && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-12 max-w-4xl space-y-8"
          >
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <h2 className="mb-4 text-caption text-primary">AI Understood</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Package, label: 'Product', value: 'SS 304 Screws' },
                  { icon: MapPin, label: 'Location', value: 'Gujarat' },
                  { icon: Hash, label: 'Quantity', value: '20,000' },
                  { icon: Globe2, label: 'Export Market', value: 'UAE' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted p-4"
                  >
                    <item.icon className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <div className="text-caption">{item.label}</div>
                      <div className="font-bold text-secondary">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-h2">12 manufacturers match your requirement.</h3>
              <p className="mb-5 text-sm text-muted">Ranked by Match Score across capability factors.</p>

              <div className="space-y-4">
                {matches.map((m) => (
                  <div key={m.manufacturer.id} className="card-surface p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            to={`/manufacturers/${m.manufacturer.slug}`}
                            className="text-lg font-extrabold text-secondary hover:text-primary"
                          >
                            {m.manufacturer.name}
                          </Link>
                          <Badge tone="warning">{m.score}% MATCH</Badge>
                          {m.manufacturer.verified && <Badge tone="success">Verified</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          {m.manufacturer.city}, {m.manufacturer.state} · {m.manufacturer.industry}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCompare(m.manufacturer.id)}
                        >
                          Compare
                        </Button>
                        <Link to={`/manufacturers/${m.manufacturer.slug}`}>
                          <Button size="sm">View Profile</Button>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                      {(
                        [
                          ['Product capability', m.breakdown.product],
                          ['Location', m.breakdown.location],
                          ['Export capability', m.breakdown.export],
                          ['Capacity', m.breakdown.capacity],
                          ['MOQ', m.breakdown.moq],
                        ] as const
                      ).map(([label, ok]) => (
                        <div
                          key={label}
                          className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2 text-xs font-semibold"
                        >
                          <Check className={`h-3.5 w-3.5 ${ok ? 'text-success' : 'text-muted'}`} />
                          <span className={ok ? 'text-secondary' : 'text-muted'}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  size="lg"
                  onClick={() =>
                    openRFQ({
                      product: 'SS 304 Screws',
                      quantity: '20,000',
                      grade: 'SS304',
                      delivery: 'Gujarat',
                      manufacturerIds: matches.slice(0, 3).map((m) => m.manufacturer.id),
                    })
                  }
                >
                  Send RFQ to Top Matches
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
