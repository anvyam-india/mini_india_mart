import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

export function AdminSettings() {
  const [platform, setPlatform] = useState({
    name: 'ForgeLink',
    supportEmail: 'ops@forgelink.in',
    defaultLocale: 'en-IN',
    maintenanceMode: false,
    allowPublicSignup: true,
    requireGstForManufacturers: true,
  })

  const [rfq, setRfq] = useState({
    maxManufacturersPerRfq: '5',
    autoMatchEnabled: true,
    slaHours: '48',
  })

  const save = () => toast.success('Platform settings saved')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">System</p>
        <h1 className="text-h1 mt-1">Platform Settings</h1>
        <p className="text-small mt-1">Global configuration for the ForgeLink B2B marketplace.</p>
      </div>

      <Card>
        <CardHeader title="General" subtitle="Branding and access" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-caption mb-1 block normal-case tracking-normal">Platform name</span>
            <input
              className="h-10 w-full rounded-xl border border-border px-3 text-sm"
              value={platform.name}
              onChange={(e) => setPlatform({ ...platform, name: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-caption mb-1 block normal-case tracking-normal">Support email</span>
            <input
              className="h-10 w-full rounded-xl border border-border px-3 text-sm"
              value={platform.supportEmail}
              onChange={(e) => setPlatform({ ...platform, supportEmail: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-caption mb-1 block normal-case tracking-normal">Default locale</span>
            <select
              className="h-10 w-full rounded-xl border border-border px-3 text-sm"
              value={platform.defaultLocale}
              onChange={(e) => setPlatform({ ...platform, defaultLocale: e.target.value })}
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (India)</option>
            </select>
          </label>
        </div>
        <div className="mt-4 space-y-2">
          {(
            [
              ['maintenanceMode', 'Maintenance mode'],
              ['allowPublicSignup', 'Allow public manufacturer signup'],
              ['requireGstForManufacturers', 'Require GSTIN for manufacturer accounts'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <span className="text-sm font-medium">{label}</span>
              <input
                type="checkbox"
                checked={platform[key]}
                onChange={(e) => setPlatform({ ...platform, [key]: e.target.checked })}
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="RFQ policy" subtitle="Routing and automation" />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-caption mb-1 block normal-case tracking-normal">Max manufacturers per RFQ</span>
            <input
              className="h-10 w-full rounded-xl border border-border px-3 text-sm"
              value={rfq.maxManufacturersPerRfq}
              onChange={(e) => setRfq({ ...rfq, maxManufacturersPerRfq: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-caption mb-1 block normal-case tracking-normal">Response SLA (hours)</span>
            <input
              className="h-10 w-full rounded-xl border border-border px-3 text-sm"
              value={rfq.slaHours}
              onChange={(e) => setRfq({ ...rfq, slaHours: e.target.value })}
            />
          </label>
        </div>
        <label className="mt-4 flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <span className="text-sm font-medium">AI auto-match enabled</span>
          <input
            type="checkbox"
            checked={rfq.autoMatchEnabled}
            onChange={(e) => setRfq({ ...rfq, autoMatchEnabled: e.target.checked })}
          />
        </label>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={save}>
          Save platform settings
        </Button>
      </div>
    </div>
  )
}
