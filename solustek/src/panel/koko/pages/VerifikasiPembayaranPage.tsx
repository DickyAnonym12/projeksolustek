import { useMemo, useState } from 'react'
import { useAuth } from '../../../auth/auth'
import { Badge } from '../../../ui/Badge'
import { Button } from '../../../ui/Button'
import { Card, CardBody } from '../../../ui/Card'
import { Input } from '../../../ui/Input'
import { PageHeader, PageSection } from '../../../ui/Page'
import { formatDateTime, formatIdr } from '../format'
import { useKoko } from '../store'

function tone(status: string) {
  switch (status) {
    case 'PROOF_UPLOADED':
      return 'warning' as const
    case 'VERIFIED':
      return 'info' as const
    case 'CLOSED':
      return 'success' as const
    default:
      return 'neutral' as const
  }
}

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

export function VerifikasiPembayaranPage() {
  const { user } = useAuth()
  const { state, verifyInvoice, closeInvoice } = useKoko()
  const [paidAmounts, setPaidAmounts] = useState<Record<string, number>>({})

  const rows = useMemo(() => {
    return [...state.invoices]
      .map((i) => {
        const unit = state.units.find((u) => u.id === i.unitId)
        return { i, unit }
      })
      .sort((a, b) => (a.i.createdAt < b.i.createdAt ? 1 : -1))
  }, [state.invoices, state.units])

  const handleVerify = (invoiceId: string, amount: number, paidAmount: number) => {
    if (paidAmount !== amount) {
      alert(`Nominal pembayaran (${formatIdr(paidAmount)}) tidak sesuai dengan tagihan (${formatIdr(amount)}). Verifikasi tidak dapat dilanjutkan.`)
      return
    }
    if (confirm(`Verifikasi pembayaran sebesar ${formatIdr(paidAmount)}?`)) {
      verifyInvoice({ invoiceId, paidAmount, actor: user?.name ?? 'koko' })
      setPaidAmounts((prev) => {
        const next = { ...prev }
        delete next[invoiceId]
        return next
      })
    }
  }

  const handleClose = (invoiceId: string) => {
    if (confirm('Tutup transaksi ini? Transaksi akan ditandai selesai secara administratif dan finansial.')) {
      closeInvoice({ invoiceId, actor: user?.name ?? 'koko' })
    }
  }

  return (
    <div className="stack">
      <PageHeader
        title="Verifikasi Pembayaran SPPG"
        subtitle="Cek bukti transfer, cocokkan nominal, lalu tandai Verified. Setelah verified, transaksi dapat ditutup (Closed)."
      />

      <Card>
        <CardBody className="muted">
          Sistem akan mencegah penutupan transaksi apabila nominal tidak sesuai. Seluruh bukti pembayaran disimpan untuk keperluan audit.
        </CardBody>
      </Card>

      <PageSection title="Daftar Invoice">
        <div className="table">
          <div className="table__head" style={{ gridTemplateColumns: '100px 120px 140px 120px 120px 140px 150px 120px' }}>
            <div>Invoice</div>
            <div>Unit</div>
            <div>Waktu</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Tagihan</div>
            <div style={{ textAlign: 'right' }}>Dibayar</div>
            <div>Bukti Transfer</div>
            <div style={{ textAlign: 'right' }}>Aksi</div>
          </div>
          {rows.map(({ i, unit }) => {
            const paidAmount = paidAmounts[i.id] ?? i.paidAmount ?? i.amount
            const isAmountMatch = paidAmount === i.amount

            return (
              <div key={i.id} className="table__row" style={{ gridTemplateColumns: '100px 120px 140px 120px 120px 140px 150px 120px' }}>
                <div className="mono">{i.id}</div>
                <div>{unit?.name ?? i.unitId}</div>
                <div className="muted">{formatDateTime(i.createdAt)}</div>
                <div>
                  <Badge tone={tone(i.status)}>{statusLabel(i.status)}</Badge>
                </div>
                <div style={{ textAlign: 'right' }}>{formatIdr(i.amount)}</div>
                <div style={{ textAlign: 'right' }}>
                  {i.status === 'PROOF_UPLOADED' ? (
                    <Input
                      className="mono"
                      style={{ width: 130, textAlign: 'right' }}
                      inputMode="numeric"
                      value={String(paidAmount)}
                      onChange={(e) => {
                        const val = Number(e.target.value.replace(/[^\d]/g, '')) || 0
                        setPaidAmounts((prev) => ({ ...prev, [i.id]: val }))
                      }}
                    />
                  ) : (
                    <span className={isAmountMatch ? '' : 'muted'}>
                      {formatIdr(i.paidAmount ?? 0)}
                    </span>
                  )}
                </div>
                <div className="muted">{i.proofUrl ?? '-'}</div>
                <div style={{ textAlign: 'right' }}>
                  {i.status === 'PROOF_UPLOADED' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleVerify(i.id, i.amount, paidAmount)}
                    >
                      Verify
                    </Button>
                  )}
                  {i.status === 'VERIFIED' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleClose(i.id)}
                    >
                      Close
                    </Button>
                  )}
                  {i.status === 'CLOSED' && (
                    <Badge tone="success">✓ Selesai</Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </PageSection>
    </div>
  )
}

