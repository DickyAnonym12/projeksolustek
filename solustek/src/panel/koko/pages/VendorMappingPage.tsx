import { useMemo } from 'react'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { useKoko } from '../store'

export function VendorMappingPage() {
  const { state } = useKoko()

  const mapping = useMemo(() => {
    return state.prs
      .filter((p) => p.assignedVendorId)
      .map((p) => {
        const vendor = state.vendors.find((v) => v.id === p.assignedVendorId)
        const unit = state.units.find((u) => u.id === p.unitId)

        return {
          prId: p.id,
          vendor: vendor?.name,
          unit: unit?.name,
        }
      })
  }, [state])

  return (
    <div className="stack">
      <PageHeader
        title="Mapping Vendor → Unit"
        subtitle="Vendor yang supply ke unit MBG"
      />

      <Card>
        <CardBody>
          <table className="table">
            <thead>
              <tr>
                <th>PR</th>
                <th>Vendor</th>
                <th>Unit</th>
              </tr>
            </thead>

            <tbody>
              {mapping.map((m) => (
                <tr key={m.prId}>
                  <td>{m.prId}</td>
                  <td>{m.vendor}</td>
                  <td>{m.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}