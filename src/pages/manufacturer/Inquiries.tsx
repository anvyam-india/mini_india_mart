import { toast } from 'sonner'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const inquiries = [
  {
    id: 'INQ-3012',
    buyer: 'ABC Auto Components',
    product: 'SS 304 Industrial Bolts',
    message: 'Need M8 and M10 mix with material certificates for automotive line.',
    date: '2026-04-02',
    status: 'New' as const,
  },
  {
    id: 'INQ-3008',
    buyer: 'Western OEM Supplies',
    product: 'Hex Head Screw',
    message: 'Requesting sample pack and lead time for 15,000 units.',
    date: '2026-03-31',
    status: 'Replied' as const,
  },
  {
    id: 'INQ-2995',
    buyer: 'Gulf Industrial Trading',
    product: 'Stainless Steel 304 Industrial Bolt',
    message: 'Export quote to UAE with packing list format for customs.',
    date: '2026-03-29',
    status: 'In progress' as const,
  },
  {
    id: 'INQ-2981',
    buyer: 'Nova Mobility Parts',
    product: 'Hex Head Screw',
    message: 'Follow-up on thread tolerance documentation.',
    date: '2026-03-27',
    status: 'Closed' as const,
  },
  {
    id: 'INQ-2974',
    buyer: 'Precision Fab India',
    product: 'Custom fastener enquiry',
    message: 'Can you support black oxide finish on SS 304 bolts?',
    date: '2026-03-25',
    status: 'New' as const,
  },
]

function statusTone(status: (typeof inquiries)[number]['status']) {
  switch (status) {
    case 'New':
      return 'warning' as const
    case 'Replied':
      return 'success' as const
    case 'In progress':
      return 'primary' as const
    default:
      return 'muted' as const
  }
}

export function ManufacturerInquiries() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Workspace</p>
        <h1 className="text-h1 mt-1">Inquiries</h1>
        <p className="text-small mt-1">Direct buyer messages linked to your product catalog.</p>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <Card key={inq.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-caption normal-case tracking-normal">{inq.id}</span>
                  <Badge tone={statusTone(inq.status)}>{inq.status}</Badge>
                </div>
                <h3 className="text-h3 mt-2">{inq.product}</h3>
                <p className="text-small mt-1">
                  {inq.buyer} · {inq.date}
                </p>
                <p className="mt-3 text-sm text-secondary">{inq.message}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => toast.success(`Reply composer opened for ${inq.buyer}.`)}
              >
                Reply
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Inquiry performance" subtitle="Last 30 days" />
        <p className="text-small">
          18 new inquiries · average first response under 4 hours in this demo narrative.
        </p>
      </Card>
    </div>
  )
}
