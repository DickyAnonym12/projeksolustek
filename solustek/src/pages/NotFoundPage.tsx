import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'

export function NotFoundPage() {
  return (
    <div className="centered">
      <Card style={{ maxWidth: 520, width: '100%' }}>
        <CardHeader>
          <CardTitle>Halaman tidak ditemukan</CardTitle>
        </CardHeader>
        <CardBody className="stack">
          <div className="muted">Route yang kamu akses tidak ada.</div>
          <Link to="/koko/dashboard">
            <Button variant="secondary">Kembali ke Dashboard</Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  )
}

