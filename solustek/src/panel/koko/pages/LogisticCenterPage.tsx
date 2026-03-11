import { useMemo } from 'react'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { useKoko } from '../store'

export function LogisticCenterPage() {
  const { state } = useKoko()

  const pos = useMemo(() => {
    return state.pos.map((po) => {
      const pr = state.prs.find((p) => p.id === po.prId)
      const vendor = state.vendors.find((v) => v.id === po.vendorId)
      const unit = state.units.find((u) => u.id === pr?.unitId)

      return {
        ...po,
        vendorName: vendor?.name ?? '-',
        unitName: unit?.name ?? '-',
      }
    })
  }, [state])

  return (
    <div className="stack">
      <PageHeader
        title="Logistic Center"
        subtitle="Monitoring purchase order dan status pengiriman"
      />

      <Card>
        <CardBody>

          <div className="table">

            {/* Header */}
            <div
              className="table__head"
              style={{
                gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr',
              }}
            >
              <div>PO</div>
              <div>Vendor</div>
              <div>Unit</div>
              <div>Status</div>
            </div>

            {/* Rows */}
            {pos.map((po) => (
              <div
                key={po.id}
                className="table__row"
                style={{
                  gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr',
                }}
              >
                <div className="mono">{po.id}</div>
                <div>{po.vendorName}</div>
                <div>{po.unitName}</div>
                <div>
                  <Badge tone="info">{po.status}</Badge>
                </div>
              </div>
            ))}

          </div>

        </CardBody>
      </Card>
    </div>
  )
}