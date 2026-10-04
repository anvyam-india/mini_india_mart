import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { manufacturers } from '../../data/mockData'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const m = manufacturers.find((x) => x.id === 'm1')!

const inputClass =
  'mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary'

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      {children}
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => toast.success(`${title} saved`)}
      >
        Save section
      </Button>
    </Card>
  )
}

export function ManufacturerProfileEdit() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-caption text-primary">Company Profile</p>
          <h1 className="text-h1 mt-1">Edit Profile</h1>
          <p className="text-small mt-1">Keep buyer-facing information accurate and export-ready.</p>
        </div>
        <Card className="min-w-[240px] p-4">
          <p className="text-caption">Completion</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-2xl font-bold text-secondary">82%</span>
            <span className="text-small">Verified exporter profile</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full w-[82%] rounded-full bg-primary" />
          </div>
        </Card>
      </div>

      <Section title="Company Information" subtitle="Legal name, location and overview shown on your public page.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-secondary">
            Company name
            <input className={inputClass} defaultValue={m.name} />
          </label>
          <label className="block text-sm font-semibold text-secondary">
            Industry
            <input className={inputClass} defaultValue={m.industry} />
          </label>
          <label className="block text-sm font-semibold text-secondary sm:col-span-2">
            About
            <textarea className={`${inputClass} min-h-[100px] py-2`} defaultValue={m.about} />
          </label>
        </div>
      </Section>

      <Section title="Business Details" subtitle="MOQ, capacity and company size for RFQ matching.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-secondary">
            MOQ
            <input className={inputClass} defaultValue={m.moq} />
          </label>
          <label className="block text-sm font-semibold text-secondary">
            Monthly capacity
            <input className={inputClass} defaultValue={m.capacity} />
          </label>
          <label className="block text-sm font-semibold text-secondary">
            Employees
            <input className={inputClass} defaultValue={m.employees} />
          </label>
          <label className="block text-sm font-semibold text-secondary">
            Manufacturing units
            <input className={inputClass} defaultValue={String(m.units)} />
          </label>
        </div>
      </Section>

      <Section title="Capabilities" subtitle="Processes buyers filter on in AI search.">
        <textarea
          className={`${inputClass} min-h-[88px] py-2`}
          defaultValue={m.capabilities.join(', ')}
        />
      </Section>

      <Section title="Certifications" subtitle="Quality and compliance credentials.">
        <input className={inputClass} defaultValue={m.certifications.join(', ')} />
      </Section>

      <Section title="Export Markets" subtitle="Countries you currently ship to with documentation support.">
        <input className={inputClass} defaultValue={m.exportMarkets.join(', ')} />
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked={m.canExport} className="rounded border-border" />
          Ready for export RFQs and overseas buyer inquiries
        </label>
      </Section>

      <Section title="Factory Media" subtitle="Photos and video links for trust on high-value RFQs.">
        <p className="text-small mb-3">{m.factoryPhotos.length} factory photos uploaded</p>
        <div className="grid grid-cols-3 gap-2">
          {m.factoryPhotos.map((src) => (
            <img
              key={src}
              src={src}
              alt="Factory"
              className="aspect-[4/3] rounded-xl object-cover"
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() => toast.message('Media upload opens in production build.')}
        >
          Upload additional media
        </Button>
      </Section>
    </div>
  )
}
