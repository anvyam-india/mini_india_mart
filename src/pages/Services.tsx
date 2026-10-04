import { services } from '../data/mockData'
import { Button } from '../components/ui/Button'
import { toast } from 'sonner'

const categories = [
  'Export Documentation',
  'Freight Forwarding',
  'Customs',
  'Logistics',
  'Finance',
  'Industrial Photography',
  'Industrial Video',
  'Product Marketing',
]

export function Services() {
  return (
    <div className="container-page py-10">
      <h1 className="text-h1">Business Services for Manufacturers & Buyers</h1>
      <p className="mt-2 mb-8 max-w-2xl text-muted">
        Export, logistics, finance and industrial media partners that support sourcing and fulfillment.
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span
            key={c}
            className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-secondary"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="card-surface flex flex-col p-6">
            <div className="text-caption text-primary">{s.category}</div>
            <h2 className="mt-2 text-lg font-bold text-secondary">{s.name}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{s.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-muted">{s.provider}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success('Service inquiry sent — demo mode')}
              >
                Request
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
