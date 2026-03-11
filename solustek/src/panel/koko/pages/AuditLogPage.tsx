import { useMemo } from "react"
import { Card, CardBody } from "../../../ui/Card"
import { PageHeader, PageSection } from "../../../ui/Page"
import { formatDateTime } from "../format"
import { useKoko } from "../store"

export function AuditLogPage() {
  const { state } = useKoko()

  const rows = useMemo(() => {
    return [...state.audit].sort((a, b) => (a.at < b.at ? 1 : -1))
  }, [state.audit])

  return (
    <div className="stack">

      <PageHeader
        title="Audit Log"
        subtitle="Jejak perubahan data krusial: approval PO, verifikasi pembayaran, sengketa, dan perubahan katalog."
      />

      <PageSection title="Events">

        <div className="table">

          {/* HEADER */}

          <div
            className="table__head"
            style={{
              gridTemplateColumns: "220px 160px 220px 1fr",
            }}
          >
            <div>Waktu</div>
            <div>Aktor</div>
            <div>Aksi</div>
            <div>Detail</div>
          </div>

          {/* ROWS */}

          {rows.map((e) => (
            <div
              key={e.id}
              className="table__row"
              style={{
                gridTemplateColumns: "220px 160px 220px 1fr",
              }}
            >

              <div className="muted">
                {formatDateTime(e.at)}
              </div>

              <div>
                {e.actor}
              </div>

              <div className="mono">
                {e.action}
              </div>

              <div
                className="muted mono"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={e.meta ? JSON.stringify(e.meta, null, 2) : "-"}
              >
                {e.meta ? JSON.stringify(e.meta) : "-"}
              </div>

            </div>
          ))}

        </div>

      </PageSection>

      <Card>
        <CardBody className="muted">
          Semua aktivitas penting sistem akan tercatat di sini, termasuk:
          approval pesanan, verifikasi pembayaran, penyelesaian sengketa,
          serta perubahan katalog dan harga HET.
        </CardBody>
      </Card>

    </div>
  )
}