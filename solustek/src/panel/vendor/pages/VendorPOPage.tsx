import { PageHeader } from "../../../ui/Page"
import { useKoko } from "../../koko/store"

export function VendorPOPage() {

  const { state } = useKoko()

  return (

    <div className="stack">

      <PageHeader
        title="Purchase Order"
        subtitle="Daftar PO yang diterima vendor"
      />

      <div className="table">

        <div className="table__head">
          <div>PO</div>
          <div>PR</div>
          <div>Status</div>
        </div>

        {state.pos.map((po) => (

          <div key={po.id} className="table__row">

            <div>{po.id}</div>
            <div>{po.prId}</div>
            <div>{po.status}</div>

          </div>

        ))}

      </div>

    </div>

  )
}