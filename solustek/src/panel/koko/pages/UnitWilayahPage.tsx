import { useMemo } from 'react'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { useKoko } from '../store'

export function UnitWilayahPage() {
  const { state } = useKoko()

  const units = useMemo(() => state.units, [state.units])

  return (
    <div className="stack">
      <PageHeader
        title="Unit MBG & Wilayah"
        subtitle="Daftar unit MBG yang dilayani"
      />

      <Card>
        <CardBody>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Unit</th>
                <th>Kota</th>
              </tr>
            </thead>

            <tbody>
              {units.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}