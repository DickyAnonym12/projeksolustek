import { useMemo } from 'react'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { formatIdr } from '../format'
import { useKoko } from '../store'

export function ClosingHarianPage() {
  const { state } = useKoko()

  const stats = useMemo(() => {
    const revenue = state.invoices.reduce(
      (s, i) => s + i.amount,
      0
    )

    const closed = state.invoices.filter(
      (i) => i.status === 'CLOSED'
    ).length

    const disputes = state.disputes.filter(
      (d) => d.status === 'OPEN'
    ).length

    return { revenue, closed, disputes }
  }, [state])

  return (
    <div className="stack">
      <PageHeader
        title="Closing Harian"
        subtitle="Ringkasan transaksi harian"
      />

      <div className="grid grid--3">

        <Card>
          <CardBody>
            Total Revenue
            <div className="stat">
              {formatIdr(stats.revenue)}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            Transaksi Closed
            <div className="stat">
              {stats.closed}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            Sengketa Aktif
            <div className="stat">
              {stats.disputes}
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  )
}