import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../auth/auth'
import { Badge } from '../../../ui/Badge'
import { Button } from '../../../ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '../../../ui/Card'
import { Input, Textarea } from '../../../ui/Input'
import { PageHeader, PageSection } from '../../../ui/Page'
import { Select } from '../../../ui/Select'
import { formatDateTime, formatIdr } from '../format'
import { useKoko } from '../store'

export function ReviewPesananDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { state, approveAndIssuePO } = useKoko()

  const pr = state.prs.find((p) => p.id === id)
  const unit = pr ? state.units.find((u) => u.id === pr.unitId) : null

  const [vendorId, setVendorId] = useState(pr?.assignedVendorId ?? state.vendors.find((v) => v.active)?.id ?? '')
  const [shippingCost, setShippingCost] = useState<number>(pr?.shippingCost ?? 0)
  const [notes, setNotes] = useState(pr?.notes ?? '')

  const lines = useMemo(() => {
    if (!pr) return []
    return pr.lines.map((l) => {
      const item = state.catalog.find((c) => c.id === l.catalogItemId)
      return { l, item }
    })
  }, [pr, state.catalog])

  if (!pr) {
    return (
      <div className="stack">
        <PageHeader title="PR tidak ditemukan" subtitle="Cek kembali ID PR yang kamu buka." />
        <Link to="/koko/operasional/review-pesanan" className="linkbtn">
          ← Kembali
        </Link>
      </div>
    )
  }

  const subtotal = pr.lines.reduce((s, l) => s + l.qty * l.het, 0)
  const total = subtotal + (shippingCost ?? 0)

  const canApprove = pr.status === 'WAITING_KOKO_REVIEW' && vendorId

  return (
    <div className="stack">
      <PageHeader
        title={`Detail PR — ${pr.id}`}
        subtitle={`${unit?.name ?? pr.unitId} • ${formatDateTime(pr.createdAt)}`}
        right={
          <Link to="/koko/operasional/review-pesanan" className="linkbtn">
            ← Kembali ke list
          </Link>
        }
      />

      <div className="grid grid--2">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Item</CardTitle>
          </CardHeader>
          <CardBody className="stack">
            <div className="table">
              <div className="table__head">
                <div>Barang</div>
                <div>Varian</div>
                <div style={{ textAlign: 'right' }}>Qty</div>
                <div style={{ textAlign: 'right' }}>HET</div>
                <div style={{ textAlign: 'right' }}>Subtotal</div>
              </div>
              {lines.map(({ l, item }) => (
                <div key={l.id} className="table__row">
                  <div>{item?.name ?? l.catalogItemId}</div>
                  <div className="muted">{item?.variant ?? '-'}</div>
                  <div style={{ textAlign: 'right' }}>
                    {l.qty} {item?.unit ?? ''}
                  </div>
                  <div style={{ textAlign: 'right' }}>{formatIdr(l.het)}</div>
                  <div style={{ textAlign: 'right' }}>{formatIdr(l.qty * l.het)}</div>
                </div>
              ))}
            </div>

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="muted">Subtotal</div>
              <div className="mono">{formatIdr(subtotal)}</div>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="muted">Ongkir (input Koko)</div>
              <div className="mono">{formatIdr(shippingCost ?? 0)}</div>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="h2">Total Estimasi</div>
              <div className="h2 mono">{formatIdr(total)}</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logistik & Approval</CardTitle>
          </CardHeader>
          <CardBody className="stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <div className="muted">Status PR</div>
              <Badge tone={pr.status === 'WAITING_KOKO_REVIEW' ? 'warning' : 'success'}>
                {pr.status}
              </Badge>
            </div>

            <div className="form">
              <label className="label">Assign Vendor</label>
              <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                <option value="" disabled>
                  Pilih vendor...
                </option>
                {state.vendors
                  .filter((v) => v.active)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city})
                    </option>
                  ))}
              </Select>
            </div>

            <div className="form">
              <label className="label">Ongkir (IDR)</label>
              <Input
                inputMode="numeric"
                value={String(shippingCost)}
                onChange={(e) => setShippingCost(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
              />
              <div className="muted" style={{ fontSize: 12 }}>
                Jika vendor lokal kosong, pilih vendor luar kota dan isi ongkir tambahan.
              </div>
            </div>

            <div className="form">
              <label className="label">Catatan internal</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>

            <PageSection title="Aksi Kritis (Dana Talangan)">
              <div className="muted" style={{ marginBottom: 10 }}>
                Saat klik <b>Approve & Terbitkan PO</b>, Koko dianggap setuju menalangi pembayaran ke
                vendor. Tindakan ini bersifat mengikat secara finansial dan tidak dapat diubah setelah disetujui.
              </div>
              <Card style={{ borderLeft: '4px solid #f59e0b', marginBottom: 12 }}>
                <CardBody>
                  <div className="h2">⚠️ Konfirmasi Ganda Diperlukan</div>
                  <div className="muted" style={{ marginTop: 4 }}>
                    Approval PO akan:
                    <ul style={{ marginTop: 8, marginLeft: 20 }}>
                      <li>Menerbitkan Purchase Order kepada Vendor</li>
                      <li>Mengurangi stok vendor</li>
                      <li>Mencatat komitmen dana talangan sebesar {formatIdr(total)}</li>
                      <li>Tidak dapat dibatalkan setelah disetujui</li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
              <div className="row" style={{ gap: 10 }}>
                <Button
                  disabled={!canApprove}
                  onClick={() => {
                    if (!canApprove) return
                    if (confirm(`KONFIRMASI: Anda akan menerbitkan PO dengan komitmen dana talangan ${formatIdr(total)}. Tindakan ini tidak dapat dibatalkan. Lanjutkan?`)) {
                      approveAndIssuePO({
                        prId: pr.id,
                        vendorId,
                        shippingCost,
                        actor: user?.name ?? 'koko',
                      })
                      navigate('/koko/operasional/review-pesanan', { replace: true })
                    }
                  }}
                >
                  Approve & Terbitkan PO
                </Button>
                <Link to="/koko/operasional/review-pesanan" className="linkbtn">
                  Batal
                </Link>
              </div>
              {!canApprove ? (
                <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                  Approve hanya tersedia saat status masih <span className="mono">WAITING_KOKO_REVIEW</span> dan vendor sudah dipilih.
                </div>
              ) : null}
            </PageSection>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

