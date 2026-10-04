import { Link } from 'react-router-dom'
import { FileText, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getManufacturerById, manufacturers } from '../data/mockData'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const rows: { key: string; label: string; get: (id: string) => string }[] = [
  {
    key: 'location',
    label: 'Location',
    get: (id) => {
      const m = getManufacturerById(id)!
      return `${m.city}, ${m.state}`
    },
  },
  { key: 'years', label: 'Years', get: (id) => `${getManufacturerById(id)!.years} years` },
  {
    key: 'employees',
    label: 'Employees',
    get: (id) => getManufacturerById(id)!.employees,
  },
  {
    key: 'products',
    label: 'Products',
    get: (id) => getManufacturerById(id)!.products.join(', '),
  },
  {
    key: 'certs',
    label: 'Certifications',
    get: (id) => getManufacturerById(id)!.certifications.join(', '),
  },
  {
    key: 'caps',
    label: 'Capabilities',
    get: (id) => getManufacturerById(id)!.capabilities.join(', '),
  },
  {
    key: 'export',
    label: 'Export Markets',
    get: (id) => {
      const m = getManufacturerById(id)!
      return m.canExport ? m.exportMarkets.join(', ') : 'Domestic only'
    },
  },
  { key: 'moq', label: 'MOQ', get: (id) => getManufacturerById(id)!.moq },
  { key: 'capacity', label: 'Capacity', get: (id) => getManufacturerById(id)!.capacity },
  {
    key: 'verification',
    label: 'Verification',
    get: (id) => (getManufacturerById(id)!.verified ? 'Verified' : 'Unverified'),
  },
]

export function Compare() {
  const { compareIds, toggleCompare, openRFQ } = useApp()
  const ids = compareIds.length >= 2 ? compareIds : ['m1', 'm2', 'm3']
  const usingFallback = compareIds.length < 2

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h1">Compare Manufacturers</h1>
          <p className="mt-2 text-muted">
            Side-by-side capability view for faster supplier shortlisting.
          </p>
          {usingFallback && (
            <p className="mt-2 text-xs font-semibold text-warning">
              Demo preview with ABC Fasteners, Patel Engineering and Rajkot Precision. Add 2–4 to customize.
            </p>
          )}
        </div>
        <Button
          size="lg"
          onClick={() =>
            openRFQ({
              product: 'SS 304 Industrial Bolts',
              quantity: '50,000',
              material: 'Stainless Steel',
              grade: 'SS304',
              delivery: 'Ahmedabad',
              requiredWithin: '30 days',
              manufacturerIds: ids.slice(0, 4),
            })
          }
        >
          <FileText className="h-4 w-4" /> Send RFQ to Selected Manufacturers
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-card">
        <table className="min-w-[900px] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              <th className="sticky left-0 z-10 bg-surface-muted px-4 py-4 text-left font-bold text-muted">
                Criteria
              </th>
              {ids.map((id) => {
                const m = getManufacturerById(id)!
                return (
                  <th key={id} className="min-w-[220px] px-4 py-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/manufacturers/${m.slug}`}
                          className="font-extrabold text-secondary hover:text-primary"
                        >
                          {m.name}
                        </Link>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.verified && <Badge tone="success">Verified</Badge>}
                          {m.featured && <Badge tone="primary">Featured</Badge>}
                        </div>
                      </div>
                      {!usingFallback && (
                        <button onClick={() => toggleCompare(id)} className="text-muted hover:text-secondary">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.key}
                className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-muted/60'}
              >
                <th className="sticky left-0 z-10 border-t border-border bg-inherit px-4 py-3 text-left font-bold text-secondary">
                  {row.label}
                </th>
                {ids.map((id) => (
                  <td key={id} className="border-t border-border px-4 py-3 text-muted">
                    {row.get(id)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="text-sm font-semibold text-muted">Quick add:</span>
        {manufacturers
          .filter((m) => !ids.includes(m.id))
          .slice(0, 4)
          .map((m) => (
            <button
              key={m.id}
              onClick={() => toggleCompare(m.id)}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
            >
              + {m.name}
            </button>
          ))}
      </div>
    </div>
  )
}
