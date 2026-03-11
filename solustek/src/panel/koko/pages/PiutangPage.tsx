import { useMemo } from 'react'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { formatIdr } from '../format'
import { useKoko } from '../store'

export function PiutangPage() {
  const { state } = useKoko()

  const invoices = useMemo(() => {
    return state.invoices
      .filter((i) => i.status !== 'CLOSED')
      .map((inv) => {
        const unit = state.units.find((u) => u.id === inv.unitId)

        return {
          ...inv,
          unitName: unit?.name,
        }
      })
  }, [state])

  return (
    <div className="stack">
      <PageHeader
        title="Piutang SPPG"
        subtitle="Tagihan yang belum diselesaikan oleh SPPG"
      />

      <Card>
        <CardBody>
          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Unit</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.unitName}</td>
                  <td>{formatIdr(i.amount)}</td>
                  <td>
                    <Badge tone="warning">{i.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}