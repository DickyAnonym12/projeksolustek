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

  function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    const success = login(username, password)

    if (!success) {

      setError("Username atau password salah")
      return

    }

    if (username === "admin") navigate("/koko/dashboard")
    else navigate("/vendor/dashboard")

  }

  return (

    <div className="centered">

      <Card style={{ width: 400 }}>

        <CardHeader>
          <CardTitle>Login SITALA</CardTitle>
        </CardHeader>

        <CardBody>

          <form className="stack" onSubmit={handleSubmit}>

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
              <div className="badge badge--danger">
                {error}
              </div>
            )}

            <Button type="submit">
              Login
            </Button>

          </form>

        </CardBody>

      </Card>

    </div>

  )
}