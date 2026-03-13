import { useMemo } from "react"
import { useVendor } from "../store"

import { PageHeader } from "../../../ui/Page"
import { Card, CardBody } from "../../../ui/Card"

export function VendorDashboardPage() {

  const { state } = useVendor()

  const stats = useMemo(() => {

    const totalPO = state.pos.length

    const processing = state.pos.filter(p => p.status === "PROCESSING").length

    const shipped = state.pos.filter(p => p.status === "SHIPPED").length

    const delivered = state.pos.filter(p => p.status === "DELIVERED").length

    const lowStock = state.vendorProducts.filter(p => p.stock < 50).length

    return {
      totalPO,
      processing,
      shipped,
      delivered,
      lowStock
    }

  }, [state])

  const latestPO = useMemo(() => {

    return [...state.pos]
      .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1))
      .slice(0, 5)

  }, [state.pos])

  return (

    <div className="stack">

      <PageHeader
        title="Dashboard Vendor"
        subtitle="Ringkasan aktivitas pengiriman dan stok vendor."
      />

      {/* ===== STAT CARDS ===== */}

      <div className="grid grid--5">

        <Card>
          <CardBody>
            <div className="muted">Total PO</div>
            <div className="h2">{stats.totalPO}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="muted">Sedang Diproses</div>
            <div className="h2">{stats.processing}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="muted">Sedang Dikirim</div>
            <div className="h2">{stats.shipped}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="muted">Selesai</div>
            <div className="h2">{stats.delivered}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="muted">Stok Rendah</div>
            <div className="h2" style={{ color: "#dc2626" }}>
              {stats.lowStock}
            </div>
          </CardBody>
        </Card>

      </div>


      {/* ===== PO TERBARU ===== */}

      <Card>

        <CardBody>

          <div className="h3">PO Terbaru</div>

          <div className="table">

            <div
              className="table__head"
              style={{
                gridTemplateColumns: "160px 160px 200px 160px"
              }}
            >
              <div>PO</div>
              <div>Status</div>
              <div>Vendor</div>
              <div>Tanggal</div>
            </div>

            {latestPO.map((po) => (

              <div
                key={po.id}
                className="table__row"
                style={{
                  gridTemplateColumns: "160px 160px 200px 160px"
                }}
              >

                <div className="mono">{po.id}</div>

                <div>

                  {po.status === "PROCESSING" && (
                    <span className="badge badge--info">
                      Processing
                    </span>
                  )}

                  {po.status === "SHIPPED" && (
                    <span className="badge badge--warning">
                      Dikirim
                    </span>
                  )}

                  {po.status === "DELIVERED" && (
                    <span className="badge badge--success">
                      Selesai
                    </span>
                  )}

                </div>

                <div>{po.vendorId}</div>

                <div className="muted">
                  {new Date(po.issuedAt).toLocaleDateString()}
                </div>

              </div>

            ))}

          </div>

        </CardBody>

      </Card>


      {/* ===== ALERT STOK ===== */}

      <Card>

        <CardBody>

          <div className="h3">Produk Stok Rendah</div>

          <div className="table">

            <div
              className="table__head"
              style={{
                gridTemplateColumns: "200px 120px 120px"
              }}
            >
              <div>Produk</div>
              <div>Stok</div>
              <div>Status</div>
            </div>

            {state.vendorProducts
              .filter(p => p.stock < 50)
              .map(p => (

                <div
                  key={p.id}
                  className="table__row"
                  style={{
                    gridTemplateColumns: "200px 120px 120px"
                  }}
                >

                  <div>{p.catalogItemId}</div>

                  <div className="mono">{p.stock}</div>

                  <div>

                    <span className="badge badge--danger">
                      Stok Rendah
                    </span>

                  </div>

                </div>

              ))}

          </div>

        </CardBody>

      </Card>

    </div>

  )

}