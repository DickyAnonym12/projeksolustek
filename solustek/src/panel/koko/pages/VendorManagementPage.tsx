import { useState } from "react"
import { Badge } from "../../../ui/Badge"
import { Button } from "../../../ui/Button"
import { Card, CardBody } from "../../../ui/Card"
import { PageHeader } from "../../../ui/Page"
import { useKoko } from "../store"

export function VendorManagementPage() {

  const { state, addVendor, toggleVendorStatus } = useKoko()

  const [name, setName] = useState("")
  const [city, setCity] = useState("")

  function handleAdd() {

    if (!name || !city) return

    addVendor({ name, city })

    setName("")
    setCity("")

  }

  return (
    <div className="stack">

      <PageHeader
        title="Manajemen Vendor"
        subtitle="Mengelola vendor yang memasok barang ke unit MBG."
      />

      {/* FORM TAMBAH VENDOR */}

      <Card>
        <CardBody className="grid grid--3">

          <div className="form">
            <label className="label">Nama Vendor</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Vendor Ayam Nusantara"
            />
          </div>

          <div className="form">
            <label className="label">Kota</label>
            <input
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Contoh: Pekanbaru"
            />
          </div>

          <div style={{ display: "flex", alignItems: "end" }}>
            <Button onClick={handleAdd}>
              Tambah Vendor
            </Button>
          </div>

        </CardBody>
      </Card>

      {/* TABLE VENDOR */}

      <Card>
        <CardBody>

          <div className="table">

            <div
              className="table__head"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
            >
              <div>Vendor</div>
              <div>Kota</div>
              <div>Status</div>
              <div>Aksi</div>
            </div>

            {state.vendors.map((v) => (

              <div
                key={v.id}
                className="table__row"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
              >

                <div>{v.name}</div>

                <div>{v.city}</div>

                <div>
                  {v.active ? (
                    <Badge tone="success">Aktif</Badge>
                  ) : (
                    <Badge tone="danger">Nonaktif</Badge>
                  )}
                </div>

                <div>
                  <Button
                    variant="secondary"
                    onClick={() => toggleVendorStatus(v.id)}
                  >
                    {v.active ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                </div>

              </div>

            ))}

          </div>

        </CardBody>
      </Card>

    </div>
  )
}