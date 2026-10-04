import { Link } from 'react-router-dom'
import { GitCompareArrows, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getManufacturerById } from '../../data/mockData'
import { Button } from '../ui/Button'

export function CompareBar() {
  const { compareIds, toggleCompare, clearCompare } = useApp()
  if (compareIds.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface shadow-[0_-8px_30px_rgba(15,23,42,0.08)]">
      <div className="container-page flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="mr-2 flex items-center gap-2 text-sm font-bold text-secondary">
            <GitCompareArrows className="h-4 w-4 text-primary" />
            {compareIds.length} manufacturers selected
          </div>
          {compareIds.map((id) => {
            const m = getManufacturerById(id)
            if (!m) return null
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-muted px-2.5 py-1 text-xs font-semibold"
              >
                {m.name}
                <button onClick={() => toggleCompare(id)} aria-label="Remove">
                  <X className="h-3.5 w-3.5 text-muted" />
                </button>
              </span>
            )
          })}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            Clear
          </Button>
          <Link to="/compare">
            <Button size="sm" disabled={compareIds.length < 2}>
              Compare Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
