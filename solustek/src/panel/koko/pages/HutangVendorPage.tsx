import { useMemo } from 'react'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { formatIdr } from '../format'
import { useKoko } from '../store'

export function HutangVendorPage() {
  const { state } = useKoko()

  const vendorPayable = useMemo(() => {
    return state.pos.map((po) => {
      const vendor = state.vendors.find((v) => v.id === po.vendorId)
      const pr = state.prs.find((p) => p.id === po.prId)

      const subtotal =
        pr?.lines.reduce((s, l) => s + l.qty * l.het, 0) ?? 0

      const total = subtotal + (pr?.shippingCost ?? 0)

      return {
        poId: po.id,
        vendorName: vendor?.name,
        total,
      }
    })
  }, [state])

  return (
    <div className="stack">
      <PageHeader
        title="Hutang Vendor"
        subtitle="Kewajiban pembayaran ke vendor"
      />

      <Card>
        <CardBody>
          <table className="table">
            <thead>
              <tr>
                <th>PO</th>
                <th>Vendor</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {vendorPayable.map((v) => (
                <tr key={v.poId}>
                  <td>{v.poId}</td>
                  <td>{v.vendorName}</td>
                  <td>{formatIdr(v.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}