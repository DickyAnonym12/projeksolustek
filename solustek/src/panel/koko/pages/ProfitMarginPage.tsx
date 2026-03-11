import { useMemo } from 'react'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { formatIdr } from '../format'
import { useKoko } from '../store'

export function ProfitMarginPage() {

  const { state } = useKoko()

  const stats = useMemo(() => {

    const revenue = state.invoices.reduce(
      (s, i) => s + i.amount,
      0
    )

    const cost = state.prs.reduce((sum, p) => {

      const subtotal = p.lines.reduce(
        (s, l) => s + l.qty * l.het,
        0
      )

      return sum + subtotal

    }, 0)

    const profit = revenue - cost

    const margin =
      revenue === 0 ? 0 : Math.round((profit / revenue) * 100)

    return { revenue, cost, profit, margin }

  }, [state])

  return (
    <div className="stack">

      <PageHeader
        title="Profit & Margin"
        subtitle="Analisis keuntungan agregator"
      />

      <div className="grid grid--4">

        <Card>
          <CardBody>
            Revenue
            <div className="stat">{formatIdr(stats.revenue)}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            Cost
            <div className="stat">{formatIdr(stats.cost)}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            Profit
            <div className="stat">{formatIdr(stats.profit)}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            Margin
            <div className="stat">{stats.margin}%</div>
          </CardBody>
        </Card>

      </div>

    </div>
  )
}