import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody } from '../../../ui/Card'
import { Input } from '../../../ui/Input'
import { PageHeader, PageSection } from '../../../ui/Page'
import { formatDateTime, formatIdr } from '../format'
import { useKoko } from '../store'

function prStatusLabel(s: string) {
  switch (s) {
    case 'WAITING_KOKO_REVIEW':
      return { label: 'Menunggu Review', tone: 'warning' as const }
    case 'APPROVED_PO_ISSUED':
      return { label: 'PO Terbit', tone: 'success' as const }
    case 'REJECTED':
      return { label: 'Ditolak', tone: 'danger' as const }
    default:
      return { label: s, tone: 'neutral' as const }
  }
}

export function ReviewPesananPage() {
  const { state } = useKoko()
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return state.prs
      .filter((pr) => {
        if (!term) return true
        return pr.id.toLowerCase().includes(term)
      })
      .map((pr) => {
        const unit = state.units.find((u) => u.id === pr.unitId)
        const total = pr.lines.reduce((s, l) => s + l.qty * l.het, 0) + (pr.shippingCost ?? 0)
        return { pr, unit, total }
      })
      .sort((a, b) => (a.pr.createdAt < b.pr.createdAt ? 1 : -1))
  }, [q, state.prs, state.units])

  return (
    <div className="stack">
      <PageHeader
        title="Review Pesanan (PR Inbox)"
        subtitle="Daftar PR dari Akuntan. Klik untuk assign vendor + ongkir lalu Approve & terbitkan PO."
        right={
          <Input
            placeholder="Cari PR ID (contoh: pr-1001)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 280 }}
          />
        }
      />

      <PageSection title="PR Masuk">
        <div className="table">
          <div className="table__head" style={{ gridTemplateColumns: '100px 120px 140px 140px 120px 100px' }}>
            <div>ID</div>
            <div>Unit</div>
            <div>Waktu</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Estimasi Total</div>
            <div style={{ textAlign: 'right' }}>Aksi</div>
          </div>
          {rows.map(({ pr, unit, total }) => {
            const s = prStatusLabel(pr.status)
            return (
              <div key={pr.id} className="table__row" style={{ gridTemplateColumns: '100px 120px 140px 140px 120px 100px' }}>
                <div className="mono">{pr.id}</div>
                <div>{unit?.name ?? pr.unitId}</div>
                <div className="muted">{formatDateTime(pr.createdAt)}</div>
                <div>
                  <Badge tone={s.tone}>{s.label}</Badge>
                </div>
                <div style={{ textAlign: 'right' }}>{formatIdr(total)}</div>
                <div style={{ textAlign: 'right' }}>
                  <Link to={`/koko/operasional/review-pesanan/${pr.id}`} className="linkbtn">
                    Detail →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <Card style={{ marginTop: 12 }}>
          <CardBody className="muted">
            Catatan: ini UI demo. Aksi "Approve & Terbitkan PO" akan membuat PO baru dan tercatat
            di Audit Log.
          </CardBody>
        </Card>
      </PageSection>
    </div>
  )
}
