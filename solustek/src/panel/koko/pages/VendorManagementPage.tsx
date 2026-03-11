import { useMemo } from 'react'
import { Badge } from '../../../ui/Badge'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader } from '../../../ui/Page'
import { useKoko } from '../store'

export function VendorManagementPage() {
  const { state } = useKoko()

  const vendors = useMemo(() => state.vendors, [state.vendors])

  return (
    <div className="stack">
      <PageHeader
        title="Manajemen Vendor"
        subtitle="Kelola vendor supply chain"
      />

      <Card>
        <CardBody>
          <table className="table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Kota</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.city}</td>
                  <td>
                    <Badge tone={v.active ? 'success' : 'danger'}>
                      {v.active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
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