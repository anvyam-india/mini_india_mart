import { BadgeCheck, MapPin, GitCompareArrows, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Manufacturer } from '../../types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/cn'

interface Props {
  manufacturer: Manufacturer
  showMatch?: boolean
}

export function ManufacturerCard({ manufacturer: m, showMatch }: Props) {
  const { compareIds, toggleCompare, openRFQ, savedIds, toggleSave } = useApp()
  const inCompare = compareIds.includes(m.id)
  const saved = savedIds.includes(m.id)

  return (
    <article className="card-surface group relative flex h-full flex-col p-5 transition hover:border-primary/30 hover:shadow-card">
      <button
        onClick={() => toggleSave(m.id)}
        className={cn(
          'absolute right-4 top-4 rounded-lg p-1.5 transition',
          saved ? 'text-danger' : 'text-muted opacity-0 group-hover:opacity-100 hover:bg-surface-muted',
        )}
        aria-label="Save manufacturer"
      >
        <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
      </button>

      <div className="mb-3 flex items-start gap-3 pr-8">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ background: m.logoColor }}
        >
          {m.name
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')}
        </div>
        <div className="min-w-0">
          <Link
            to={`/manufacturers/${m.slug}`}
            className="text-[15px] font-bold text-secondary transition group-hover:text-primary"
          >
            {m.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {m.verified && (
              <Badge tone="success">
                <BadgeCheck className="h-3 w-3" /> Verified
              </Badge>
            )}
            {showMatch && m.matchScore != null && (
              <Badge tone="primary">{m.matchScore}% match</Badge>
            )}
          </div>
        </div>
      </div>

      <p className="mb-3 flex items-center gap-1.5 text-sm text-muted">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {m.city}, {m.state}
        <span className="text-border-strong">·</span>
        Est. {m.established}
      </p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {m.products.slice(0, 3).map((p) => (
          <span key={p} className="rounded-md bg-surface-muted px-2 py-1 text-xs font-semibold text-secondary">
            {p}
          </span>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-3 text-xs font-semibold text-muted">
        <span className="inline-flex items-center gap-1 text-secondary">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {m.rating}
        </span>
        <span>{m.certifications[0]}</span>
        {m.canExport && <span>Export ready</span>}
      </div>

      <div className="mt-auto flex gap-2">
        <Link to={`/manufacturers/${m.slug}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full">
            View profile
          </Button>
        </Link>
        <Button
          variant={inCompare ? 'secondary' : 'outline'}
          size="sm"
          className="px-3"
          title={inCompare ? 'In compare' : 'Add to compare'}
          onClick={() => toggleCompare(m.id)}
        >
          <GitCompareArrows className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            openRFQ({
              product: m.products[0] ?? 'Custom Requirement',
              manufacturerIds: [m.id],
            })
          }
        >
          Quote
        </Button>
      </div>
    </article>
  )
}
