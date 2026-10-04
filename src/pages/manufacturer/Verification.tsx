import { CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const steps = [
  { label: 'Company Details', done: true },
  { label: 'Contact Verification', done: true },
  { label: 'GST Registration', done: false },
  { label: 'Business Documents', done: false },
  { label: 'Manufacturing Proof', done: false },
]

export function ManufacturerVerification() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Trust & compliance</p>
        <h1 className="text-h1 mt-1">Verification</h1>
        <p className="text-small mt-1">
          Build buyer confidence with document-backed verification on ForgeLink.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader
            title="Verification status"
            subtitle="ABC Fasteners Pvt Ltd"
            action={<Badge tone="warning">Partially Verified</Badge>}
          />
          <div className="mb-4 flex items-end justify-between">
            <span className="text-3xl font-bold text-secondary">60%</span>
            <span className="text-small">2 of 5 checks complete</span>
          </div>
          <div className="mb-6 h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full w-[60%] rounded-full bg-primary" />
          </div>
          <ul className="space-y-2">
            {steps.map((step) => (
              <li
                key={step.label}
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm"
              >
                {step.done ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted" />
                )}
                <span className="font-semibold text-secondary">{step.label}</span>
                <span className="ml-auto text-small">{step.done ? 'Complete' : 'Pending'}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-6 w-full"
            onClick={() => toast.success('Verification wizard opened — upload GST and factory proof.')}
          >
            Complete Verification
          </Button>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Verified badge" subtitle="Document review by ForgeLink operations." />
            <p className="text-small">
              <strong className="text-secondary">Verified</strong> confirms identity, contact, and
              core business credentials. Buyers see a trust badge on your profile and RFQ responses.
              Verification is independent of paid plans and reflects compliance—not promotion tier.
            </p>
          </Card>
          <Card>
            <CardHeader title="Premium listing" subtitle="Paid visibility and placement." />
            <p className="text-small">
              <strong className="text-secondary">Premium</strong> is a separate subscription that
              boosts search ranking, featured placement, and analytics depth. A manufacturer can be
              Verified without Premium, or Premium while still completing verification documents.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => toast.message('See Promotion plans for Premium upgrades.')}
            >
              Compare with Promotion
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
