import { useMemo, useState } from 'react'
import { useAuth } from '../../../auth/auth'
import { Badge } from '../../../ui/Badge'
import { Button } from '../../../ui/Button'
import { Card, CardBody } from '../../../ui/Card'
import { Input } from '../../../ui/Input'
import { PageHeader, PageSection } from '../../../ui/Page'
import { formatDateTime, formatIdr } from '../format'
import { useKoko } from '../store'

type Row = {
  id: string
  name: string
  variant: string
  unit: string
  vendorCost: number
  surveyPrice: number
  het: number
  lastUpdated?: string
}

const TOLERANCE_PERCENTAGE = 10 // 10% tolerance

export function PenetapanHETPage() {
  const { user } = useAuth()
  const { state, updateHET } = useKoko()
  const [marginPct, setMarginPct] = useState(8)
  const [region, setRegion] = useState('Pekanbaru')

  const baseRows = useMemo<Row[]>(() => {
    return state.catalog
      .filter((c) => c.active)
      .map((c, idx) => {
        const vendorCost = 20000 + idx * 5000
        const surveyPrice = vendorCost + 6000
        const calculatedHet = Math.min(Math.round(vendorCost * (1 + marginPct / 100)), surveyPrice)
        
        // Get last HET from history
        const lastHET = state.hetHistory
          .filter((h) => h.catalogItemId === c.id && h.region === region)
          .sort((a, b) => (a.setAt < b.setAt ? 1 : -1))[0]

        return {
          id: c.id,
          name: c.name,
          variant: c.variant,
          unit: c.unit,
          vendorCost,
          surveyPrice,
          het: lastHET?.het ?? calculatedHet,
          lastUpdated: lastHET?.setAt,
        }
      })
  }, [marginPct, region, state.catalog, state.hetHistory])

  const [hetMap, setHetMap] = useState<Record<string, number>>({})

  const rows = useMemo(() => {
    return baseRows.map((r) => ({
      ...r,
      het: hetMap[r.id] ?? r.het,
    }))
  }, [baseRows, hetMap])

  const handleSaveHET = (catalogItemId: string, het: number) => {
    if (confirm(`Simpan HET ${formatIdr(het)} untuk item ini di wilayah ${region}?`)) {
      updateHET({ catalogItemId, region, het, actor: user?.name ?? 'koko' })
      // Remove from local map after saving
      setHetMap((m) => {
        const next = { ...m }
        delete next[catalogItemId]
        return next
      })
    }
  }

  return (
    <div className="stack">
      <PageHeader
        title="Penetapan HET (Pricing Engine)"
        subtitle="Komparasi harga modal vendor vs harga survei SPPG. Output: HET per wilayah."
        right={
          <div className="row" style={{ gap: 10, alignItems: 'center' }}>
            <div className="muted">Wilayah</div>
            <Input
              style={{ width: 140 }}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Wilayah"
            />
            <div className="muted">Margin %</div>
            <Input
              style={{ width: 100 }}
              inputMode="numeric"
              value={String(marginPct)}
              onChange={(e) => setMarginPct(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
            />
          </div>
        }
      />

      <Card>
        <CardBody className="muted">
          Untuk demo: harga modal & survei masih dummy. Nantinya ini diisi dari input Vendor (harga modal + stok) dan input SPPG (harga pasar lokal).
          Toleransi peringatan: {TOLERANCE_PERCENTAGE}% dari harga survei.
        </CardBody>
      </Card>

      <PageSection title="Tabel Komparasi & Penetapan HET">
        <div className="table">
          <div className="table__head">
            <div>Barang</div>
            <div>Varian</div>
            <div>Satuan</div>
            <div style={{ textAlign: 'right' }}>Harga Modal</div>
            <div style={{ textAlign: 'right' }}>Harga Survei</div>
            <div style={{ textAlign: 'right' }}>HET</div>
            <div>Guardrail</div>
            <div>Update Terakhir</div>
            <div>Aksi</div>
          </div>
          {rows.map((r) => {
            const toleranceThreshold = r.surveyPrice * (1 + TOLERANCE_PERCENTAGE / 100)
            const exceedsSurvey = r.het > r.surveyPrice
            const exceedsTolerance = r.het > toleranceThreshold
            const isModified = hetMap[r.id] !== undefined

            return (
              <div key={r.id} className="table__row">
                <div>{r.name}</div>
                <div className="muted">{r.variant}</div>
                <div>{r.unit}</div>
                <div style={{ textAlign: 'right' }}>{formatIdr(r.vendorCost)}</div>
                <div style={{ textAlign: 'right' }}>{formatIdr(r.surveyPrice)}</div>
                <div style={{ textAlign: 'right' }}>
                  <Input
                    className="mono"
                    style={{ width: 140, textAlign: 'right' }}
                    inputMode="numeric"
                    value={String(r.het)}
                    onChange={(e) => {
                      const next = Number(e.target.value.replace(/[^\d]/g, '')) || 0
                      setHetMap((m) => ({ ...m, [r.id]: next }))
                    }}
                  />
                </div>
                <div>
                  {exceedsTolerance ? (
                    <Badge tone="danger">⚠️ Melebihi toleransi</Badge>
                  ) : exceedsSurvey ? (
                    <Badge tone="warning">Melebihi survei</Badge>
                  ) : (
                    <Badge tone="success">OK</Badge>
                  )}
                </div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {r.lastUpdated ? formatDateTime(r.lastUpdated) : 'Belum ada'}
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={!isModified}
                    onClick={() => handleSaveHET(r.id, r.het)}
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </PageSection>

      <PageSection title="Histori Perubahan HET">
        <div className="table">
          <div className="table__head">
            <div>Waktu</div>
            <div>Barang</div>
            <div>Wilayah</div>
            <div style={{ textAlign: 'right' }}>HET</div>
            <div>Ditetapkan Oleh</div>
          </div>
          {state.hetHistory
            .filter((h) => h.region === region)
            .sort((a, b) => (a.setAt < b.setAt ? 1 : -1))
            .slice(0, 10)
            .map((h) => {
              const item = state.catalog.find((c) => c.id === h.catalogItemId)
              return (
                <div key={h.id} className="table__row">
                  <div className="muted">{formatDateTime(h.setAt)}</div>
                  <div>{item?.name ?? h.catalogItemId}</div>
                  <div>{h.region}</div>
                  <div style={{ textAlign: 'right' }}>{formatIdr(h.het)}</div>
                  <div className="muted">{h.setBy}</div>
                </div>
              )
            })}
        </div>
      </PageSection>
    </div>
  )
}

