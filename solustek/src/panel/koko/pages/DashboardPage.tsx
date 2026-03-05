import { useMemo } from 'react'
import { useAuth } from '../../../auth/auth'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody, CardHeader, CardTitle } from '../../../ui/Card'
import { PageHeader, PageSection } from '../../../ui/Page'
import { formatIdr } from '../format'
import { useKoko } from '../store'

export function DashboardPage() {
  const { user } = useAuth()
  const { state } = useKoko()

  const stats = useMemo(() => {
    const prNew = state.prs.filter((p) => p.status === 'WAITING_KOKO_REVIEW').length
    const disputeOpen = state.disputes.filter((d) => d.status === 'OPEN').length
    const invoiceNeedVerify = state.invoices.filter((i) => i.status === 'PROOF_UPLOADED').length

    const danaTalangan = state.prs
      .filter((p) => p.status === 'APPROVED_PO_ISSUED')
      .reduce((sum, p) => {
        const subtotal = p.lines.reduce((s, l) => s + l.qty * l.het, 0)
        return sum + subtotal + (p.shippingCost ?? 0)
      }, 0)

    const danaTalanganWarning = danaTalangan > state.danaTalanganThreshold
    const danaTalanganPercentage = Math.round((danaTalangan / state.danaTalanganThreshold) * 100)

    return { prNew, disputeOpen, invoiceNeedVerify, danaTalangan, danaTalanganWarning, danaTalanganPercentage }
  }, [state])

  return (
    <div className="stack">
      <PageHeader
        title="Dashboard Operasional"
        subtitle={`Halo, ${user?.name ?? 'User'} — ringkasan aktivitas hari ini.`}
      />

      {stats.danaTalanganWarning && (
        <Card style={{ borderLeft: '4px solid #f59e0b' }}>
          <CardBody className="row" style={{ gap: 12, alignItems: 'center' }}>
            <Badge tone="warning">⚠️ Peringatan</Badge>
            <div>
              <div className="h2">Dana Talangan Melewati Batas</div>
              <div className="muted">
                Dana talangan saat ini {formatIdr(stats.danaTalangan)} ({stats.danaTalanganPercentage}% dari threshold {formatIdr(state.danaTalanganThreshold)}). 
                Harap perhatikan risiko arus kas.
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid--4">
        <Card>
          <CardHeader>
            <CardTitle>Order Baru</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="stat">{stats.prNew}</div>
            <div className="muted">Butuh review Koko</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tagihan</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="stat">{stats.invoiceNeedVerify}</div>
            <div className="muted">Butuh verifikasi pembayaran</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sengketa</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="stat">{stats.disputeOpen}</div>
            <div className="muted">Menunggu keputusan</div>
          </CardBody>
        </Card>
        <Card style={{ borderLeft: stats.danaTalanganWarning ? '4px solid #f59e0b' : undefined }}>
          <CardHeader>
            <CardTitle>Dana Talangan</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="stat stat--money">{formatIdr(stats.danaTalangan)}</div>
            <div className="muted">
              {stats.danaTalanganPercentage}% dari threshold
              {stats.danaTalanganWarning && ' ⚠️'}
            </div>
          </CardBody>
        </Card>
      </div>

      <PageSection title="Quick health-check">
        <div className="grid grid--3">
          <Card>
            <CardBody className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="h2">Guardrail harga</div>
                <div className="muted">Survei SPPG tersedia (demo)</div>
              </div>
              <Badge tone="success">OK</Badge>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="h2">Vendor mapping</div>
                <div className="muted">1 vendor luar kota aktif</div>
              </div>
              <Badge tone="info">Info</Badge>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="h2">Audit trail</div>
                <div className="muted">Semua aksi tercatat</div>
              </div>
              <Badge tone="success">On</Badge>
            </CardBody>
          </Card>
        </div>
      </PageSection>
    </div>
  )
}

