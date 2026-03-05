import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../auth/auth'
import { Badge } from '../../../ui/Badge'
import { Button } from '../../../ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '../../../ui/Card'
import { Input } from '../../../ui/Input'
import { PageHeader, PageSection } from '../../../ui/Page'
import { formatDateTime, formatIdr } from '../format'
import { useKoko } from '../store'

export function DisputeCenterDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { state, resolveDispute } = useKoko()

  const d = state.disputes.find((x) => x.id === id)
  const invoice = d ? state.invoices.find((i) => i.prId === d.prId) : null
  const pr = d ? state.prs.find((p) => p.id === d.prId) : null

  const [adjustedAmount, setAdjustedAmount] = useState<number>(invoice?.amount ?? 0)

  if (!d) {
    return (
      <div className="stack">
        <PageHeader title="Sengketa tidak ditemukan" />
        <Link to="/koko/operasional/dispute-center" className="linkbtn">
          ← Kembali
        </Link>
      </div>
    )
  }

  const unit = state.units.find((u) => u.id === d.unitId)
  const originalAmount = invoice?.amount ?? 0

  const handleValidate = () => {
    if (adjustedAmount !== originalAmount) {
      if (confirm(
        `Validasi komplain akan menyesuaikan nilai pembayaran dari ${formatIdr(originalAmount)} menjadi ${formatIdr(adjustedAmount)}. Lanjutkan?`
      )) {
        resolveDispute({ 
          disputeId: d.id, 
          decision: 'VALIDATE', 
          adjustedAmount,
          actor: user?.name ?? 'koko' 
        })
        navigate('/koko/operasional/dispute-center', { replace: true })
      }
    } else {
      if (confirm('Validasi komplain tanpa perubahan nilai pembayaran?')) {
        resolveDispute({ 
          disputeId: d.id, 
          decision: 'VALIDATE',
          actor: user?.name ?? 'koko' 
        })
        navigate('/koko/operasional/dispute-center', { replace: true })
      }
    }
  }

  const handleReject = () => {
    if (confirm('Tolak komplain? Nilai tagihan akan tetap berlaku penuh.')) {
      resolveDispute({ 
        disputeId: d.id, 
        decision: 'REJECT',
        actor: user?.name ?? 'koko' 
      })
      navigate('/koko/operasional/dispute-center', { replace: true })
    }
  }

  return (
    <div className="stack">
      <PageHeader
        title={`Detail Sengketa — ${d.id}`}
        subtitle={`${unit?.name ?? d.unitId} • ${formatDateTime(d.createdAt)} • PR ${d.prId}`}
        right={
          <Link to="/koko/operasional/dispute-center" className="linkbtn">
            ← Kembali ke list
          </Link>
        }
      />

      <div className="grid grid--2">
        <Card>
          <CardHeader>
            <CardTitle>Bukti & Ringkasan</CardTitle>
          </CardHeader>
          <CardBody className="stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="muted">Status</div>
              <Badge tone={d.status === 'OPEN' ? 'warning' : d.status === 'VALIDATED' ? 'success' : 'danger'}>
                {d.status}
              </Badge>
            </div>
            <div className="muted">{d.summary}</div>

            <PageSection title="Foto bukti (placeholder)">
              <div className="stack" style={{ gap: 8 }}>
                {d.evidencePhotos.map((p) => (
                  <div key={p} className="photoPlaceholder">
                    {p}
                  </div>
                ))}
              </div>
            </PageSection>

            <PageSection title="Detail Pesanan">
              {pr && (
                <div className="stack" style={{ gap: 8 }}>
                  {pr.lines.map((l) => {
                    const item = state.catalog.find((c) => c.id === l.catalogItemId)
                    return (
                      <div key={l.id} className="row" style={{ justifyContent: 'space-between' }}>
                        <div>
                          {item?.name} - {item?.variant} ({l.qty} {item?.unit})
                        </div>
                        <div className="mono">{formatIdr(l.qty * l.het)}</div>
                      </div>
                    )
                  })}
                  {pr.shippingCost ? (
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <div className="muted">Ongkir</div>
                      <div className="mono">{formatIdr(pr.shippingCost)}</div>
                    </div>
                  ) : null}
                </div>
              )}
            </PageSection>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keputusan Koko</CardTitle>
          </CardHeader>
          <CardBody className="stack">
            <div className="muted">
              Pilih keputusan untuk menentukan apakah komplain Aslap valid (berdampak pada settlement
              vendor) atau ditolak.
            </div>

            {d.status === 'OPEN' && (
              <>
                <Card style={{ borderLeft: '4px solid #3b82f6' }}>
                  <CardBody>
                    <div className="h2">Penyesuaian Nilai Pembayaran</div>
                    <div className="muted" style={{ marginTop: 4, marginBottom: 12 }}>
                      Jika komplain divalidasi, sesuaikan nilai pembayaran berdasarkan jumlah barang yang diterima.
                    </div>
                    <div className="form">
                      <label className="label">Nilai Tagihan Original</label>
                      <div className="mono">{formatIdr(originalAmount)}</div>
                    </div>
                    <div className="form">
                      <label className="label">Nilai Setelah Penyesuaian</label>
                      <Input
                        className="mono"
                        style={{ textAlign: 'right' }}
                        inputMode="numeric"
                        value={String(adjustedAmount)}
                        onChange={(e) => {
                          const val = Number(e.target.value.replace(/[^\d]/g, '')) || 0
                          setAdjustedAmount(val)
                        }}
                      />
                    </div>
                    {adjustedAmount !== originalAmount && (
                      <div className="muted" style={{ fontSize: 12 }}>
                        Selisih: {formatIdr(Math.abs(originalAmount - adjustedAmount))} 
                        {adjustedAmount < originalAmount ? ' (pengurangan)' : ' (penambahan)'}
                      </div>
                    )}
                  </CardBody>
                </Card>

                <div className="row" style={{ gap: 10 }}>
                  <Button variant="primary" onClick={handleValidate}>
                    Validasi Komplain Aslap
                  </Button>
                  <Button variant="danger" onClick={handleReject}>
                    Tolak Komplain
                  </Button>
                </div>
              </>
            )}

            {d.status !== 'OPEN' && (
              <Card>
                <CardBody>
                  <div className="muted">
                    Sengketa sudah diputus dengan keputusan: <Badge tone={d.status === 'VALIDATED' ? 'success' : 'danger'}>{d.status}</Badge>
                    <br />
                    Untuk demo, perubahan tercatat di Audit Log.
                  </div>
                </CardBody>
              </Card>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

