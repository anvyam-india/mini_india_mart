import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

function LineBars({
  title,
  subtitle,
  labels,
  values,
  suffix,
}: {
  title: string
  subtitle?: string
  labels: string[]
  values: number[]
  suffix?: string
}) {
  const max = Math.max(...values)
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} />
      <div className="space-y-3">
        {values.map((v, i) => (
          <div key={labels[i]}>
            <div className="mb-1 flex justify-between text-xs font-semibold">
              <span className="text-muted">{labels[i]}</span>
              <span>
                {v.toLocaleString()}
                {suffix}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(v / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function MiniChart({ title, values }: { title: string; values: number[] }) {
  const max = Math.max(...values)
  return (
    <Card>
      <h3 className="text-caption mb-3">{title}</h3>
      <div className="flex h-32 items-end gap-1">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-secondary/80"
            style={{ height: `${(v / max) * 100}%`, minHeight: 4 }}
          />
        ))}
      </div>
    </Card>
  )
}

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">System</p>
        <h1 className="text-h1 mt-1">Analytics</h1>
        <p className="text-small mt-1">Engagement, conversion, and marketplace growth metrics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Profile views', value: '184K', delta: '+12%' },
          { label: 'RFQ conversion', value: '6.8%', delta: '+0.4%' },
          { label: 'Verified sign-ups', value: '142', delta: '+18%' },
          { label: 'Premium upgrades', value: '9', delta: '+3' },
        ].map((k) => (
          <Card key={k.label}>
            <div className="text-caption">{k.label}</div>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-3xl font-extrabold">{k.value}</span>
              <Badge tone="success">{k.delta}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <LineBars
          title="RFQ volume by category"
          subtitle="Last 90 days"
          labels={['Industrial Fasteners', 'Automotive', 'Plastic', 'Packaging', 'Machinery']}
          values={[420, 280, 190, 156, 134]}
        />
        <LineBars
          title="Top buyer regions"
          subtitle="RFQs originated"
          labels={['Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi NCR']}
          values={[312, 248, 164, 132, 98]}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <MiniChart title="Daily active buyers (30d)" values={[820, 880, 910, 940, 960, 990, 1020, 1040, 1010, 1080, 1120, 1150]} />
        <MiniChart title="Manufacturer responses / day" values={[120, 132, 128, 145, 150, 162, 158, 171, 168, 180, 176, 188]} />
        <MiniChart title="Lead quality score" values={[72, 74, 73, 76, 78, 77, 79, 81, 80, 82, 83, 84]} />
      </div>

      <Card>
        <CardHeader title="Funnel snapshot" subtitle="Buyer journey — March 2026" />
        <div className="grid gap-3 sm:grid-cols-5">
          {[
            { step: 'Search', count: '24,800' },
            { step: 'Profile view', count: '8,420' },
            { step: 'Product view', count: '5,160' },
            { step: 'RFQ started', count: '892' },
            { step: 'RFQ sent', count: '326' },
          ].map((f, i, arr) => (
            <div key={f.step} className="relative rounded-xl border border-border p-4 text-center">
              <div className="text-caption">{f.step}</div>
              <div className="mt-1 text-xl font-extrabold">{f.count}</div>
              {i < arr.length - 1 && (
                <span className="absolute -right-2 top-1/2 hidden h-0 w-0 -translate-y-1/2 border-y-8 border-l-8 border-y-transparent border-l-border sm:block" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
