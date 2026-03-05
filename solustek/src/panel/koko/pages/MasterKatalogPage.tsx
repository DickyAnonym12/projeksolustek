import { useMemo, useState } from 'react'
import { useAuth } from '../../../auth/auth'
import { Badge } from '../../../ui/Badge'
import { Button } from '../../../ui/Button'
import { Card, CardBody } from '../../../ui/Card'
import { Input } from '../../../ui/Input'
import { PageHeader, PageSection } from '../../../ui/Page'
import { Select } from '../../../ui/Select'
import { useKoko } from '../store'

export function MasterKatalogPage() {
  const { user } = useAuth()
  const { state, addCatalogItem, toggleCatalogStatus } = useKoko()

  const [name, setName] = useState('')
  const [variant, setVariant] = useState('')
  const [unit, setUnit] = useState<'Kg' | 'Pcs' | 'Liter'>('Kg')

  const rows = useMemo(() => {
    return [...state.catalog].sort((a, b) => (a.name > b.name ? 1 : -1))
  }, [state.catalog])

  const isItemUsedInTransaction = (catalogItemId: string) => {
    return state.prs.some((pr) => pr.lines.some((l) => l.catalogItemId === catalogItemId))
  }

  return (
    <div className="stack">
      <PageHeader
        title="Master Katalog (SKU & Spesifikasi)"
        subtitle="Koko menetapkan bahasa yang sama untuk Akuntan & Vendor: item, varian, satuan."
      />

      <Card>
        <CardBody className="muted">
          Catatan: Item yang sudah digunakan dalam transaksi tidak dapat dihapus, hanya dapat dinonaktifkan untuk menjaga konsistensi histori.
        </CardBody>
      </Card>

      <PageSection title="Tambah Item">
        <div className="formRow">
          <div className="form">
            <label className="label">Nama Barang</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Ayam Karkas" />
          </div>
          <div className="form">
            <label className="label">Varian/Spesifikasi</label>
            <Input value={variant} onChange={(e) => setVariant(e.target.value)} placeholder="Contoh: Ukuran 1kg" />
          </div>
          <div className="form">
            <label className="label">Satuan</label>
            <Select value={unit} onChange={(e) => setUnit(e.target.value as 'Kg' | 'Pcs' | 'Liter')}>
              <option value="Kg">Kg</option>
              <option value="Pcs">Pcs</option>
              <option value="Liter">Liter</option>
            </Select>
          </div>
          <div className="form" style={{ alignSelf: 'end' }}>
            <Button
              variant="primary"
              disabled={!name.trim() || !variant.trim()}
              onClick={() => {
                if (!name.trim() || !variant.trim()) return
                addCatalogItem({ name: name.trim(), variant: variant.trim(), unit, actor: user?.name ?? 'koko' })
                setName('')
                setVariant('')
                setUnit('Kg')
              }}
            >
              Tambah
            </Button>
          </div>
        </div>
      </PageSection>

      <PageSection title="Daftar SKU">
        <div className="table">
          <div className="table__head">
            <div>Nama</div>
            <div>Varian</div>
            <div>Satuan</div>
            <div>Status</div>
            <div>ID</div>
            <div>Aksi</div>
          </div>
          {rows.map((c) => {
            const usedInTransaction = isItemUsedInTransaction(c.id)
            return (
              <div key={c.id} className="table__row">
                <div>{c.name}</div>
                <div className="muted">{c.variant}</div>
                <div>{c.unit}</div>
                <div>
                  <Badge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'Aktif' : 'Nonaktif'}</Badge>
                </div>
                <div className="mono">{c.id}</div>
                <div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      if (usedInTransaction) {
                        if (confirm(`Item ini ${c.active ? 'akan dinonaktifkan' : 'akan diaktifkan kembali'}. Lanjutkan?`)) {
                          toggleCatalogStatus({ catalogItemId: c.id, actor: user?.name ?? 'koko' })
                        }
                      } else {
                        toggleCatalogStatus({ catalogItemId: c.id, actor: user?.name ?? 'koko' })
                      }
                    }}
                  >
                    {c.active ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </PageSection>
    </div>
  )
}

