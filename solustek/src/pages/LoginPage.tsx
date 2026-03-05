import { useNavigate } from 'react-router-dom'
import type { Role } from '../auth/auth'
import { useAuth } from '../auth/auth'
import { Button } from '../ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'

const roles: Array<{ role: Role; label: string; desc: string }> = [
  { role: 'KOKO', label: 'Koko', desc: 'Pengelola supply chain dengan akses penuh ke semua modul.' },
]

export function LoginPage() {
  const { loginAs } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="centered">
      <div className="stack" style={{ maxWidth: 720, width: '100%' }}>
        <div>
          <div className="h1">Login (Demo)</div>
          <div className="muted">Login sebagai Koko untuk membuka Panel Koko.</div>
        </div>

        <div className="grid grid--1">
          {roles.map((r) => (
            <Card key={r.role}>
              <CardHeader>
                <CardTitle>{r.label}</CardTitle>
              </CardHeader>
              <CardBody className="stack">
                <div className="muted">{r.desc}</div>
                <Button
                  onClick={() => {
                    loginAs(r.role)
                    navigate('/koko/dashboard', { replace: true })
                  }}
                >
                  Masuk
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

