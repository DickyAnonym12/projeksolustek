import { useMemo } from 'react'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { formatIdr } from '../format'
import { useKoko } from '../store'

export function SettlementVendorPage() {

  const { state } = useKoko()

  const settlements = useMemo(() => {

    return state.invoices
      .filter((i) => i.status === 'CLOSED')
      .map((inv) => {

        const po = state.pos.find((p) => p.id === inv.poId)
        const vendor = state.vendors.find((v) => v.id === po?.vendorId)
        const unit = state.units.find((u) => u.id === inv.unitId)

        return {
          ...inv,
          poId: po?.id ?? '-',
          vendorName: vendor?.name ?? '-',
          unitName: unit?.name ?? '-'
        }

      })

  }, [state])

  return (
    <div className="stack">

      <PageHeader
        title="Settlement Vendor"
        subtitle="Pembayaran vendor setelah transaksi selesai"
      />

      <Card>
        <CardBody>

          <div className="table">

            {/* Header */}

            <div
              className="table__head"
              style={{
                gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr 1fr'
              }}
            >
              <div>Invoice</div>
              <div>PO</div>
              <div>Vendor</div>
              <div>Unit</div>
              <div>Amount</div>
            </div>

            {/* Rows */}

            {settlements.map((s) => (
              <div
                key={s.id}
                className="table__row"
                style={{
                  gridTemplateColumns: '1fr 1fr 1.5fr 1.5fr 1fr'
                }}
              >
                <div className="mono">{s.id}</div>

                <div className="mono">{s.poId}</div>

                <div>{s.vendorName}</div>

                <div>{s.unitName}</div>

                <div>
                  <Badge tone="success">
                    {formatIdr(s.amount)}
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