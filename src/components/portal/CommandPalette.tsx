import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, CornerDownLeft, FileText, LayoutGrid, Package, Search, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { manufacturers, products } from '../../data/mockData'
import { cn } from '../../lib/cn'
import { usePortalUI } from './PortalUIContext'

interface Result {
  id: string
  group: string
  label: string
  meta?: string
  icon: typeof Search
  run: () => void
}

export function CommandPalette() {
  const { config, searchOpen, setSearchOpen, openAi } = usePortalUI()
  const { rfqs } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const base = config.homePath

  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setIndex(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [searchOpen])

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase()
    const go = (to: string) => () => {
      setSearchOpen(false)
      navigate(to)
    }
    const modules: Result[] = config.groups.flatMap((g) =>
      g.items.map((i) => ({ id: i.to, group: 'Modules', label: i.label, meta: g.label, icon: LayoutGrid, run: go(i.to) })),
    )
    const rfqResults: Result[] = rfqs.map((r) => ({
      id: r.id,
      group: 'RFQs',
      label: `${r.id} · ${r.product}`,
      meta: `${r.quantity} · ${r.buyer}`,
      icon: FileText,
      run: go(`${base}/rfqs`),
    }))
    const mfr: Result[] =
      config.kind === 'admin'
        ? manufacturers.map((m) => ({
            id: m.id,
            group: 'Manufacturers',
            label: m.name,
            meta: `${m.city}, ${m.state}`,
            icon: Building2,
            run: go('/admin/manufacturers'),
          }))
        : []
    const prod: Result[] = products
      .filter((p) => config.kind === 'admin' || p.manufacturerId === 'm1')
      .map((p) => ({
        id: p.id,
        group: 'Products',
        label: p.name,
        meta: p.manufacturerName,
        icon: Package,
        run: go(`${base}/products`),
      }))

    const all = [...modules, ...rfqResults, ...mfr, ...prod]
    const filtered = q
      ? all.filter((r) => `${r.label} ${r.meta ?? ''}`.toLowerCase().includes(q))
      : [...modules.slice(0, 6), ...rfqResults.slice(0, 3)]

    const ask: Result = {
      id: 'ask-ai',
      group: 'ForgeLink AI',
      label: q ? `Ask AI: “${query.trim()}”` : 'Ask ForgeLink AI anything',
      meta: 'Chat · Voice',
      icon: Sparkles,
      run: () => {
        setSearchOpen(false)
        openAi(q ? { prompt: query.trim() } : undefined)
      },
    }
    return [...filtered.slice(0, 12), ask]
  }, [query, config, rfqs, base, navigate, setSearchOpen, openAi])

  useEffect(() => {
    if (index >= results.length) setIndex(0)
  }, [results.length, index])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      results[index]?.run()
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
    }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-secondary/40 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_64px_rgba(15,23,42,0.25)]"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setIndex(0)
                }}
                onKeyDown={onKey}
                placeholder={config.searchPlaceholder}
                className="h-14 flex-1 bg-transparent text-sm text-secondary outline-none placeholder:text-muted"
              />
              <kbd className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-2 scrollbar-thin">
              {results.map((r, i) => {
                const header = r.group !== lastGroup
                lastGroup = r.group
                return (
                  <div key={`${r.group}-${r.id}`}>
                    {header && (
                      <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                        {r.group}
                      </p>
                    )}
                    <button
                      onMouseEnter={() => setIndex(i)}
                      onClick={r.run}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm',
                        i === index ? 'bg-primary-light text-primary' : 'text-secondary',
                      )}
                    >
                      <r.icon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate font-medium">{r.label}</span>
                      {r.meta && <span className="truncate text-xs text-muted">{r.meta}</span>}
                      {i === index && <CornerDownLeft className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
