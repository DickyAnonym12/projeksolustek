import { PageHeader } from "../../../ui/Page"
import { useKoko } from "../../koko/store"

export function VendorShippingPage() {

  const { state } = useKoko()

  const shipments = state.pos.filter(
    p => p.status === "PROCESSING" || p.status === "SHIPPED"
  )

  return (

    <div className="stack">

      <PageHeader
        title="Pengiriman"
        subtitle="Status distribusi barang"
      />

      <div className="table">

        <div className="table__head">
          <div>PO</div>
          <div>Status</div>
        </div>

        {shipments.map((po) => (

          <div key={po.id} className="table__row">

            <div>{po.id}</div>
            <div>{po.status}</div>

          </div>

        ))}

      </div>

    </div>

  )
}