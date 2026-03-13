import { useMemo, useState } from "react";
import { useVendor } from "../store";
import { PageHeader } from "../../../ui/Page";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";

export function VendorProductPage() {
  const { state, updateProduct } = useVendor();

  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const products = useMemo(() => {
    let rows = state.vendorProducts;

    if (filterActive === "ACTIVE") rows = rows.filter((p) => p.active);

    if (filterActive === "INACTIVE") rows = rows.filter((p) => !p.active);

    if (search)
      rows = rows.filter((p) =>
        p.catalogItemId.toLowerCase().includes(search.toLowerCase()),
      );

    return rows;
  }, [state.vendorProducts, search, filterActive]);

  const stats = useMemo(() => {
    const total = state.vendorProducts.length;
    const active = state.vendorProducts.filter((p) => p.active).length;
    const lowStock = state.vendorProducts.filter((p) => p.stock < 50).length;

    return { total, active, lowStock };
  }, [state.vendorProducts]);

  return (
    <div className="stack">
      <PageHeader
        title="Produk & Stok Vendor"
        subtitle="Kelola harga modal dan stok produk yang disuplai ke MBG."
      />

      {/* ===== STAT CARD ===== */}

      <div className="grid grid--3">
        <Card>
          <CardBody>
            <div className="muted">Total Produk</div>
            <div className="h2">{stats.total}</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="muted">Produk Aktif</div>
            <div className="h2">{stats.active}</div>
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

      {/* ===== FILTER ===== */}

      <Card>
        <CardBody className="row" style={{ gap: 12 }}>
          <input
            className="input"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input"
            value={filterActive}
            onChange={(e) =>
              setFilterActive(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
            }
          >
            <option value="ALL">Semua</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Nonaktif</option>
          </select>
        </CardBody>
      </Card>

      {/* ===== TABLE ===== */}

      <Card>
        <CardBody>
          <div className="table">
            <div
              className="table__head"
              style={{
                gridTemplateColumns: "200px 150px 150px 120px 120px 140px",
              }}
            >
              <div>Produk</div>
              <div>Harga Modal</div>
              <div>Stok</div>
              <div>Status</div>
              <div>Stok Alert</div>
              <div>Aksi</div>
            </div>

            {products.map((p) => {
              const lowStock = p.stock < 50;

              return (
                <div
                  key={p.id}
                  className="table__row"
                  style={{
                    gridTemplateColumns: "200px 150px 150px 120px 120px 140px",
                  }}
                >
                  <div className="mono">{p.catalogItemId}</div>

                  <div>
                    <input
                      className="input"
                      defaultValue={p.costPrice}
                      type="number"
                      onBlur={(e) =>
                        updateProduct({
                          productId: p.id,
                          costPrice: Number(e.target.value),
                          stock: p.stock,
                        })
                      }
                    />
                  </div>

                  <div>
                    <input
                      className="input"
                      defaultValue={p.stock}
                      type="number"
                      onBlur={(e) =>
                        updateProduct({
                          productId: p.id,
                          costPrice: p.costPrice,
                          stock: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    {p.active ? (
                      <span className="badge badge--success">Aktif</span>
                    ) : (
                      <span className="badge badge--muted">Nonaktif</span>
                    )}
                  </div>

                  <div>
                    {lowStock ? (
                      <span className="badge badge--danger">Stok Rendah</span>
                    ) : (
                      <span className="badge badge--success">Aman</span>
                    )}
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        updateProduct({
                          productId: p.id,
                          costPrice: p.costPrice,
                          stock: p.stock,
                        })
                      }
                    >
                      Simpan
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
