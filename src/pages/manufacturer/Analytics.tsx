import { Card, CardHeader } from '../../components/ui/Card'

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6']

const series = {
  profileViews: [142, 168, 195, 210, 248, 321],
  rfqs: [2, 3, 2, 4, 5, 4],
  productViews: [420, 510, 580, 620, 710, 802],
}

function BarChart({
  label,
  values,
  colorClass,
  max,
}: {
  label: string
  values: number[]
  colorClass: string
  max: number
}) {
  return (
    <Card>
      <CardHeader title={label} subtitle="Last 6 weeks · ABC Fasteners" />
      <div className="flex h-44 items-end gap-2 sm:gap-3">
        {values.map((v, i) => (
          <div key={weeks[i]} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-caption normal-case tracking-normal text-secondary">{v}</span>
            <div
              className={`w-full max-w-[48px] rounded-t-xl ${colorClass} transition-all`}
              style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
            />
            <span className="text-caption normal-case tracking-normal">{weeks[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function ManufacturerAnalytics() {
  const maxProfile = Math.max(...series.profileViews)
  const maxRfqs = Math.max(...series.rfqs)
  const maxProducts = Math.max(...series.productViews)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Insights</p>
        <h1 className="text-h1 mt-1">Analytics</h1>
        <p className="text-small mt-1">
          Track how buyers discover your profile, products, and RFQ funnel.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <BarChart
          label="Profile views"
          values={series.profileViews}
          colorClass="bg-primary"
          max={maxProfile}
        />
        <BarChart label="RFQs received" values={series.rfqs} colorClass="bg-secondary" max={maxRfqs} />
        <BarChart
          label="Product views"
          values={series.productViews}
          colorClass="bg-primary/70"
          max={maxProducts}
        />
      </div>

      <Card>
        <CardHeader
          title="Summary"
          subtitle="Demo metrics aligned with your public profile totals."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-muted p-4">
            <p className="text-caption">Profile views (MTD)</p>
            <p className="text-h2 mt-1">1,284</p>
          </div>
          <div className="rounded-xl bg-surface-muted p-4">
            <p className="text-caption">RFQ response rate</p>
            <p className="text-h2 mt-1">78%</p>
          </div>
          <div className="rounded-xl bg-surface-muted p-4">
            <p className="text-caption">Product views (MTD)</p>
            <p className="text-h2 mt-1">3,842</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
