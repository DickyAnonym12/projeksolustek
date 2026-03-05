import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { PageHeader } from '../ui/Page'

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="stack">
      <PageHeader title={title} subtitle="Halaman ini sudah disiapkan rutenya, tinggal diisi logic/fiturnya." />
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
        </CardHeader>
        <CardBody className="muted">
          Kalau kamu sebutkan prioritas berikutnya (mis. Settlement Vendor atau Closing Harian), aku bisa lanjutkan implementasi detailnya.
        </CardBody>
      </Card>
    </div>
  )
}

