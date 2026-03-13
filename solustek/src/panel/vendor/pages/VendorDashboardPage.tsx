import { Card, CardBody, CardHeader, CardTitle } from "../../../ui/Card"
import { PageHeader } from "../../../ui/Page"
import { useKoko } from "../../koko/store"

export function VendorDashboardPage() {

  const { state } = useKoko()

  return (

    <div className="stack">

      <PageHeader
        title="Dashboard Vendor"
        subtitle="Ringkasan aktivitas vendor"
      />

      <div className="grid grid--3">

        <Card>
          <CardHeader>
            <CardTitle>Total PO</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="stat">
              {state.pos.length}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengiriman Aktif</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="stat">
              {state.pos.filter(p => p.status === "SHIPPED").length}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Invoice</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="stat">
              {state.invoices.length}
            </div>
          </CardBody>
        </Card>

      </div>

    </div>

  )
}