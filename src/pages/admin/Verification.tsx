import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'

function statusTone(status: string) {
  if (status === 'Pending') return 'warning' as const
  if (status === 'Approved') return 'success' as const
  if (status === 'Rejected') return 'danger' as const
  return 'primary' as const
}

export function AdminVerification() {
  const {
    verificationItems,
    approveVerification,
    rejectVerification,
    requestVerificationInfo,
  } = useApp()
  const [activeId, setActiveId] = useState(verificationItems[0]?.id ?? '')

  const active = useMemo(
    () => verificationItems.find((v) => v.id === activeId) ?? verificationItems[0] ?? null,
    [verificationItems, activeId],
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-primary">Trust & Safety</p>
        <h1 className="text-h1 mt-1">Verification Queue</h1>
        <p className="text-small mt-1">Review manufacturer documents and approve platform badges.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <Card padding={false} className="overflow-hidden">
          <div className="px-5 pt-5">
            <CardHeader title="Queue" subtitle={`${verificationItems.length} submissions`} />
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="table-enterprise">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {verificationItems.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => setActiveId(v.id)}
                    className={`cursor-pointer ${activeId === v.id ? 'bg-primary-light/40' : ''}`}
                  >
                    <td className="font-semibold">{v.company}</td>
                    <td className="text-muted">{v.location}</td>
                    <td>{v.submittedAt}</td>
                    <td>
                      <Badge tone={statusTone(v.status)}>{v.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="h-fit xl:sticky xl:top-24">
          {active ? (
            <>
              <CardHeader title={active.company} subtitle={`Submitted ${active.submittedAt}`} />
              <p className="text-small mb-4">{active.location}</p>
              <Badge tone={statusTone(active.status)} className="mb-4">
                {active.status}
              </Badge>
              <h3 className="text-caption mb-2">Documents</h3>
              <ul className="mb-6 space-y-2">
                {active.documents.map((doc) => (
                  <li key={doc} className="rounded-lg border border-border px-3 py-2 text-sm font-medium">
                    {doc}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <Button variant="success" onClick={() => approveVerification(active.id)}>
                  Approve verification
                </Button>
                <Button variant="danger" onClick={() => rejectVerification(active.id)}>
                  Reject
                </Button>
                <Button variant="outline" onClick={() => requestVerificationInfo(active.id)}>
                  Request information
                </Button>
              </div>
            </>
          ) : (
            <p className="text-small">Queue is empty.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
