import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/auth"
import { Button } from "../ui/Button"
import { Card, CardBody, CardHeader, CardTitle } from "../ui/Card"

export function LoginPage() {

  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleLogin() {

    const ok = login(username, password)

    if (!ok) {
      setError("Username atau password salah")
      return
    }

    navigate("/koko/dashboard", { replace: true })

  }

  return (
    <div className="centered">

      <Card style={{ width: 420 }}>

        <CardHeader>
          <CardTitle>Login SITALA</CardTitle>
        </CardHeader>

        <CardBody className="stack">

          <div className="form">
            <label className="label">Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form">
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: "red", fontSize: 13 }}>
              {error}
            </div>
          )}

          <Button onClick={handleLogin}>
            Login
          </Button>

        </CardBody>

      </Card>

    </div>
  )
}