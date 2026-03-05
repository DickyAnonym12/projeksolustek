import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader, PageSection } from '../../../ui/Page'
import { formatDateTime } from '../format'
import { useKoko } from '../store'

function disputeTone(status: string) {
  switch (status) {
    case 'OPEN':
      return 'warning' as const
    case 'VALIDATED':
      return 'success' as const
    case 'REJECTED':
      return 'danger' as const
    default:
      return 'neutral' as const
  }
}

function disputeLabel(status: string) {
  switch (status) {
    case 'OPEN':
      return 'Menunggu Keputusan'
    case 'VALIDATED':
      return 'Divalidasi'
    case 'REJECTED':
      return 'Ditolak'
    default:
      return status
  }
}

export function DisputeCenterPage() {
  const { state } = useKoko()

  const rows = useMemo(() => {
    return [...state.disputes]
      .map((d) => {
        const unit = state.units.find((u) => u.id === d.unitId)
        return { d, unit }
      })
      .sort((a, b) => (a.d.createdAt < b.d.createdAt ? 1 : -1))
  }, [state.disputes, state.units])

  return (
    <div className="stack">
      <PageHeader
        title="Dispute Center"
        subtitle="Keputusan Koko untuk laporan ketidaksesuaian dari Aslap."
      />

      <PageSection title="Daftar Sengketa">
        <div className="table">
          <div className="table__head" style={{ gridTemplateColumns: '100px 100px 120px 140px 140px 250px 100px' }}>
            <div>ID</div>
            <div>PR ID</div>
            <div>Unit</div>
            <div>Waktu</div>
            <div>Status</div>
            <div>Ringkasan</div>
            <div style={{ textAlign: 'right' }}>Aksi</div>
          </div>
          {rows.map(({ d, unit }) => (
            <div key={d.id} className="table__row" style={{ gridTemplateColumns: '100px 100px 120px 140px 140px 250px 100px' }}>
              <div className="mono">{d.id}</div>
              <div className="mono">{d.prId}</div>
              <div>{unit?.name ?? d.unitId}</div>
              <div className="muted">{formatDateTime(d.createdAt)}</div>
              <div>
                <Badge tone={disputeTone(d.status)}>{disputeLabel(d.status)}</Badge>
              </div>
              <div className="muted">{d.summary}</div>
              <div style={{ textAlign: 'right' }}>
                <Link to={`/koko/operasional/dispute-center/${d.id}`} className="linkbtn">
                  Detail →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <Card style={{ marginTop: 12 }}>
          <CardBody className="muted">
            Mekanisme ini menjawab kebutuhan "siapa hakim saat vendor menolak dipotong"—keputusan ada
            di Koko via Dispute Center.
          </CardBody>
        </Card>
      </PageSection>
    </div>
  )
}
