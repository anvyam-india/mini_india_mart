import { services } from '../../data/mockData'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

export function AdminServices() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption text-primary">Marketplace</p>
          <h1 className="text-h1 mt-1">Business Services</h1>
          <p className="text-small mt-1">Service listings available to manufacturers and buyers on ForgeLink.</p>
        </div>
        <Button variant="primary">Publish service</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <Card key={s.id}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h2 className="text-h3">{s.name}</h2>
              <Badge tone="muted">{s.category}</Badge>
            </div>
            <p className="text-small">{s.description}</p>
            <p className="mt-3 text-sm font-semibold text-secondary">Provider: {s.provider}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">
                Edit listing
              </Button>
              <Button size="sm" variant="ghost">
                Feature
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Service categories" subtitle="Coverage across export and operations" />
        <div className="flex flex-wrap gap-2">
          {[...new Set(services.map((s) => s.category))].map((cat) => (
            <Badge key={cat} tone="primary">
              {cat}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  )
}
