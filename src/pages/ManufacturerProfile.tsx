import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  BadgeCheck,
  Star,
  MapPin,
  Factory,
  Users,
  Calendar,
  Globe2,
  Bookmark,
  FileText,
  MessageSquare,
  Crown,
} from 'lucide-react'
import { getManufacturerBySlug, products } from '../data/mockData'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'
import { toast } from 'sonner'
import { cn } from '../lib/cn'

const tabs = ['Overview', 'Products', 'Capabilities', 'Certifications', 'Exports', 'Factory'] as const

export function ManufacturerProfile() {
  const { slug } = useParams()
  const m = getManufacturerBySlug(slug ?? '')
  const { savedIds, toggleSave, openRFQ } = useApp()
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')

  if (!m) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-h1">Manufacturer not found</h1>
        <Link to="/manufacturers" className="mt-4 inline-block font-semibold text-primary">
          Back to directory
        </Link>
      </div>
    )
  }

  const companyProducts = products.filter((p) => p.manufacturerId === m.id)
  const saved = savedIds.includes(m.id)

  return (
    <div>
      <div className="border-b border-border bg-surface">
        <div className="container-page py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
                style={{ background: m.logoColor }}
              >
                {m.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </div>
              <div>
                <h1 className="text-h1">{m.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {m.verified && (
                    <Badge tone="success">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified Manufacturer
                    </Badge>
                  )}
                  {m.featured && (
                    <Badge tone="primary">
                      <Star className="h-3.5 w-3.5" /> Featured
                    </Badge>
                  )}
                  {m.premium && (
                    <Badge tone="warning">
                      <Crown className="h-3.5 w-3.5" /> Premium
                    </Badge>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {m.city}, {m.state}
                  </span>
                  <span>Established {m.established}</span>
                  <span className="font-medium text-secondary">{m.industry}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  openRFQ({
                    product: 'SS 304 Industrial Bolts',
                    manufacturerIds: ['m1', 'm2', 'm3'],
                  })
                }
              >
                <FileText className="h-4 w-4" /> Request Quote
              </Button>
              <Button variant="outline" onClick={() => toast.success('Inquiry drafted — demo mode')}>
                <MessageSquare className="h-4 w-4" /> Send Inquiry
              </Button>
              <Button variant="ghost" onClick={() => toggleSave(m.id)}>
                <Bookmark className={`h-4 w-4 ${saved ? 'fill-primary text-primary' : ''}`} />
                Save
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Calendar, label: 'Years', value: `${m.years} Years` },
              { icon: Users, label: 'Employees', value: `${m.employeeCount} Employees` },
              { icon: Factory, label: 'Units', value: `${m.units} Units` },
              {
                icon: Globe2,
                label: 'Export',
                value: `${m.id === 'm1' ? 12 : Math.max(m.exportMarkets.length, 1)} Countries Exported`,
              },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-surface-muted px-4 py-3">
                <div className="mb-1 flex items-center gap-2 text-caption">
                  <stat.icon className="h-3.5 w-3.5" /> {stat.label}
                </div>
                <div className="text-lg font-extrabold text-secondary">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-1 overflow-x-auto border-b border-border">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'border-b-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition',
                  tab === t
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-secondary',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        {tab === 'Overview' && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="card-surface p-6">
              <h2 className="text-h3 mb-3">About Company</h2>
              <p className="leading-relaxed text-muted">{m.about}</p>
            </section>
            <aside className="card-surface p-6">
              <h3 className="mb-3 font-bold">Business Statistics</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">MOQ</dt>
                  <dd className="font-semibold">{m.moq}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Capacity</dt>
                  <dd className="font-semibold">{m.capacity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Profile Views</dt>
                  <dd className="font-semibold">{m.profileViews.toLocaleString()}</dd>
                </div>
              </dl>
            </aside>
          </div>
        )}

        {tab === 'Products' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companyProducts.map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} className="card-surface p-5 hover:border-primary/40">
                <div className="font-bold text-secondary">{p.name}</div>
                <div className="mt-1 text-xs text-muted">
                  {p.grade} · MOQ {p.moq}
                </div>
              </Link>
            ))}
            {companyProducts.length === 0 &&
              m.products.map((p) => (
                <div key={p} className="card-surface p-5 font-semibold">
                  {p}
                </div>
              ))}
          </div>
        )}

        {tab === 'Capabilities' && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {m.capabilities.map((c) => (
              <div key={c} className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold">
                {c}
              </div>
            ))}
          </div>
        )}

        {tab === 'Certifications' && (
          <div className="flex flex-wrap gap-2">
            {m.certifications.map((c) => (
              <Badge key={c} tone="primary" className="px-3 py-1.5 text-sm">
                {c}
              </Badge>
            ))}
          </div>
        )}

        {tab === 'Exports' && (
          <div>
            {m.canExport ? (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(m.exportMarkets.length
                  ? m.exportMarkets
                  : ['UAE', 'Saudi Arabia', 'Germany', 'UK']
                ).map((e) => (
                  <li key={e} className="card-surface flex items-center gap-2 p-4 text-sm font-semibold">
                    <Globe2 className="h-4 w-4 text-primary" /> {e}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">Currently serving domestic buyers.</p>
            )}
          </div>
        )}

        {tab === 'Factory' && (
          <div className="grid gap-3 sm:grid-cols-3">
            {m.factoryPhotos.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt={`${m.name} factory ${i + 1}`}
                className="h-48 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-border bg-secondary p-8 text-center text-white">
          <h3 className="text-h2 text-white">Need a supplier like this?</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-300">
            Create a structured RFQ and share it with {m.name} and matching manufacturers.
          </p>
          <Button
            className="mt-5"
            onClick={() =>
              openRFQ({
                product: 'SS 304 Industrial Bolts',
                manufacturerIds: ['m1', 'm2', 'm3'],
              })
            }
          >
            Create RFQ
          </Button>
        </div>
      </div>
    </div>
  )
}
