import { toast } from 'sonner'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

const inputClass =
  'mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary'

export function ManufacturerSettings() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Account</p>
        <h1 className="text-h1 mt-1">Settings</h1>
        <p className="text-small mt-1">Manage login, notifications, and portal preferences.</p>
      </div>

      <Card>
        <CardHeader title="Account" subtitle="Primary contact for RFQ and inquiry alerts." />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-secondary">
            Full name
            <input className={inputClass} defaultValue="Rajesh Mehta" />
          </label>
          <label className="block text-sm font-semibold text-secondary">
            Role
            <input className={inputClass} defaultValue="Export Sales Manager" />
          </label>
          <label className="block text-sm font-semibold text-secondary">
            Email
            <input className={inputClass} type="email" defaultValue="rajesh@abcfasteners.in" />
          </label>
          <label className="block text-sm font-semibold text-secondary">
            Mobile
            <input className={inputClass} defaultValue="+91 98765 43210" />
          </label>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => toast.success('Account settings saved')}
        >
          Save account
        </Button>
      </Card>

      <Card>
        <CardHeader title="Notifications" subtitle="Choose how you hear about new RFQs." />
        <div className="space-y-3 text-sm">
          {[
            'Email for new RFQs',
            'SMS for high-match RFQs (90%+)',
            'Weekly performance digest',
            'Product inquiry instant alerts',
          ].map((label) => (
            <label key={label} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              <span className="font-semibold text-secondary">{label}</span>
            </label>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => toast.success('Notification preferences updated')}
        >
          Save notifications
        </Button>
      </Card>

      <Card>
        <CardHeader title="Security" subtitle="Demo credentials — change password in production." />
        <div className="grid gap-4 sm:max-w-md">
          <label className="block text-sm font-semibold text-secondary">
            Current password
            <input className={inputClass} type="password" defaultValue="••••••••" />
          </label>
          <label className="block text-sm font-semibold text-secondary">
            New password
            <input className={inputClass} type="password" placeholder="Min. 8 characters" />
          </label>
        </div>
        <Button
          size="sm"
          className="mt-4"
          onClick={() => toast.success('Password updated (demo)')}
        >
          Update password
        </Button>
      </Card>
    </div>
  )
}
