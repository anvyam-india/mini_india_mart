import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const plans = [
  {
    id: 'standard',
    name: 'Standard',
    price: '₹0',
    period: '/ month (demo)',
    description: 'Included with every manufacturer account.',
    features: ['Public profile', 'Product listings', 'RFQ inbox', 'Basic search visibility'],
    current: true,
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹4,999',
    period: '/ month (demo)',
    description: 'Higher placement for export-ready MSMEs.',
    features: [
      'Priority in category search',
      'Premium badge on profile',
      'Advanced analytics',
      'Featured in weekly buyer digest',
    ],
    current: false,
    highlight: true,
  },
  {
    id: 'featured',
    name: 'Featured',
    price: '₹9,999',
    period: '/ month (demo)',
    description: 'Homepage and campaign spotlight slots.',
    features: [
      'Homepage featured carousel',
      'Industry spotlight placement',
      'Dedicated success manager (demo)',
      'Broadcast campaign credits',
    ],
    current: false,
    highlight: false,
  },
]

export function ManufacturerPromotion() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Growth</p>
        <h1 className="text-h1 mt-1">Promotion Plans</h1>
        <p className="text-small mt-1">
          Grow visibility with placement upgrades—pricing shown for demo purposes only.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${plan.highlight ? 'border-primary ring-1 ring-primary/20' : ''}`}
          >
            <CardHeader
              title={plan.name}
              subtitle={plan.description}
              action={
                plan.current ? (
                  <Badge tone="success">Current</Badge>
                ) : plan.highlight ? (
                  <Badge tone="primary">Popular</Badge>
                ) : null
              }
            />
            <div className="mb-4">
              <span className="text-3xl font-bold text-secondary">{plan.price}</span>
              <span className="text-small">{plan.period}</span>
            </div>
            <ul className="mb-6 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.highlight ? 'primary' : 'outline'}
              className="w-full"
              disabled={plan.current}
              onClick={() => {
                if (plan.id === 'premium') {
                  toast.success('Upgrade to Premium recorded — demo checkout skipped.')
                } else {
                  toast.message(`${plan.name} plan selected in demo.`)
                }
              }}
            >
              {plan.current ? 'Active plan' : plan.id === 'premium' ? 'Upgrade to Premium' : `Choose ${plan.name}`}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
