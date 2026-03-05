import { useMemo } from 'react'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader, PageSection } from '../../../ui/Page'
import { formatDateTime, formatIdr } from '../format'
import { useKoko } from '../store'

function statusLabel(status: string) {
  switch (status) {
    case 'GENERATED':
      return 'Dibuat'
    case 'UNPAID':
      return 'Belum Dibayar'
    case 'PROOF_UPLOADED':
      return 'Bukti Diupload'
    case 'VERIFIED':
      return 'Terverifikasi'
    case 'CLOSED':
      return 'Selesai'
    default:
      return status
  }
}

function statusTone(status: string) {
  switch (status) {
    case 'VERIFIED':
      return 'success' as const
    case 'PROOF_UPLOADED':
      return 'warning' as const
    case 'CLOSED':
      return 'info' as const
    default:
      return 'neutral' as const
  }
}

export function InvoicePage() {
  const { state } = useKoko()

  const rows = useMemo(() => {
    return [...state.invoices]
      .map((i) => {
        const unit = state.units.find((u) => u.id === i.unitId)
        const pr = state.prs.find((p) => p.id === i.prId)
        return { i, unit, pr }
      })
      .sort((a, b) => (a.i.createdAt < b.i.createdAt ? 1 : -1))
  }, [state.invoices, state.units, state.prs])

  return (
    <div className="stack">
      <PageHeader
        title="Invoice & Piutang SPPG"
        subtitle="Rekap tagihan yang terbentuk setelah QC (Delivered)."
      />

      <Card>
        <CardBody className="muted">
          Invoice dibuat otomatis setelah barang delivered dan di-QC oleh Aslap. SPPG akan upload bukti transfer, lalu Koko verifikasi pembayaran.
        </CardBody>
      </Card>

      <PageSection title="Daftar Invoice">
        <div className="table">
          <div className="table__head" style={{ gridTemplateColumns: '100px 100px 120px 140px 120px 120px 140px' }}>
            <div>Invoice</div>
            <div>PR ID</div>
            <div>Unit</div>
            <div>Waktu Dibuat</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Nominal</div>
            <div>Bukti Transfer</div>
          </div>
          {rows.map(({ i, unit }) => (
            <div key={i.id} className="table__row" style={{ gridTemplateColumns: '100px 100px 120px 140px 120px 120px 140px' }}>
              <div className="mono">{i.id}</div>
              <div className="mono">{i.prId}</div>
              <div>{unit?.name ?? i.unitId}</div>
              <div className="muted">{formatDateTime(i.createdAt)}</div>
              <div>
                <Badge tone={statusTone(i.status)}>{statusLabel(i.status)}</Badge>
              </div>
              <div style={{ textAlign: 'right' }}>{formatIdr(i.amount)}</div>
              <div className="muted">
                {i.proofUrl ? (
                  <span>✓ {i.proofUrl}</span>
                ) : (
                  <span>Belum ada</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  )
}

