import { PageHeader } from "../../../ui/Page"
import { formatIdr } from "../../koko/format"
import { useKoko } from "../../koko/store"

export function VendorHistoryPage() {

  const { state } = useKoko()

  return (

    <div className="stack">

      <PageHeader
        title="Riwayat Transaksi"
        subtitle="Riwayat pembayaran vendor"
      />

      <div className="table">

        <div className="table__head">
          <div>Invoice</div>
          <div>Unit</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        {state.invoices.map((inv) => (

          <div key={inv.id} className="table__row">

            <div>{inv.id}</div>
            <div>{inv.unitId}</div>
            <div>{formatIdr(inv.amount)}</div>
            <div>{inv.status}</div>

          </div>

        ))}

      </div>

    </div>

  )
}