import { toast } from 'sonner'
import { services } from '../../data/mockData'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

export function ManufacturerServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Ecosystem</p>
        <h1 className="text-h1 mt-1">Business Services</h1>
        <p className="text-small mt-1">
          Logistics, documentation, and marketing partners to support export RFQs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((svc) => (
          <Card key={svc.id} className="flex flex-col">
            <CardHeader
              title={svc.name}
              subtitle={svc.provider}
              action={<Badge tone="muted">{svc.category}</Badge>}
            />
            <p className="text-small flex-1">{svc.description}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-fit"
              onClick={() =>
                toast.success(`Service request sent to ${svc.provider} — demo notification.`)
              }
            >
              Request service
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
