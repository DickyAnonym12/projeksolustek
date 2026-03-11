import { useMemo } from 'react'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { useKoko } from '../store'

export function MonitoringPengirimanPage() {

  const { state } = useKoko()

  const shipments = useMemo(() => {
    return state.pos
      .filter((po) =>
        ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(po.status)
      )
      .map((po) => {

        const vendor = state.vendors.find(v => v.id === po.vendorId)
        const pr = state.prs.find(p => p.id === po.prId)
        const unit = state.units.find(u => u.id === pr?.unitId)

        return {
          ...po,
          vendorName: vendor?.name ?? '-',
          unitName: unit?.name ?? '-'
        }

      })
  }, [state])

  function getStatusTone(status: string) {

    switch (status) {
      case 'PROCESSING':
        return 'warning'
      case 'SHIPPED':
        return 'info'
      case 'DELIVERED':
        return 'success'
      default:
        return 'neutral'
    }

  }

  return (
    <div className="stack">

      <PageHeader
        title="Monitoring Pengiriman"
        subtitle="Status distribusi barang vendor → unit MBG"
      />

      <Card>
        <CardBody>

          <div className="table">

            {/* Header */}

            <div
              className="table__head"
              style={{
                gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr'
              }}
            >
              <div>PO</div>
              <div>Vendor</div>
              <div>Unit</div>
              <div>Status</div>
            </div>

            {/* Rows */}

            {shipments.map((po) => (
              <div
                key={po.id}
                className="table__row"
                style={{
                  gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr'
                }}
              >
                <div className="mono">{po.id}</div>

                <div>{po.vendorName}</div>

                <div>{po.unitName}</div>

                <div>
                  <Badge tone={getStatusTone(po.status)}>
                    {po.status}
                  </Badge>
                </div>

              </div>
            ))}

          </div>

        </CardBody>
      </Card>

    </div>
  )
}