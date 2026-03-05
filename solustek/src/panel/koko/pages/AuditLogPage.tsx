import { useMemo } from 'react'
import { Card, CardBody } from '../../../ui/Card'
import { PageHeader, PageSection } from '../../../ui/Page'
import { formatDateTime } from '../format'
import { useKoko } from '../store'

export function AuditLogPage() {
  const { state } = useKoko()

  const rows = useMemo(() => {
    return [...state.audit].sort((a, b) => (a.at < b.at ? 1 : -1))
  }, [state.audit])

  return (
    <div className="stack">
      <PageHeader
        title="Audit Log"
        subtitle="Jejak perubahan data krusial: approval PO, verifikasi bayar, sengketa, katalog."
      />

      <PageSection title="Events">
        <div className="table">
          <div className="table__head">
            <div>Waktu</div>
            <div>Aktor</div>
            <div>Aksi</div>
            <div>Meta</div>
          </div>
          {rows.map((e) => (
            <div key={e.id} className="table__row">
              <div className="muted">{formatDateTime(e.at)}</div>
              <div>{e.actor}</div>
              <div className="mono">{e.action}</div>
              <div className="muted mono">{e.meta ? JSON.stringify(e.meta) : '-'}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <Card>
        <CardBody className="muted">
          Contoh yang kamu minta: “User X mengubah HET Ayam …” akan masuk ke sini ketika fitur simpan
          HET sudah di-wire ke backend.
        </CardBody>
      </Card>
    </div>
  )
}

