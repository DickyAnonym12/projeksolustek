import { Navigate, useLocation } from "react-router-dom"
import type { Role } from "./auth"
import { useAuth } from "./auth"

type Props = {
  anyOf: Role[]
  children: React.ReactNode
}

export function RequireRole({ anyOf, children }: Props) {

  const { user } = useAuth()

  const location = useLocation()

  /* ===== BELUM LOGIN ===== */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  /* ===== ROLE TIDAK SESUAI ===== */

  if (!anyOf.includes(user.role)) {

    if (user.role === "ADMIN") {
      return <Navigate to="/koko/dashboard" replace />
    }

    if (user.role === "VENDOR") {
      return <Navigate to="/vendor/dashboard" replace />
    }

    return <Navigate to="/login" replace />

  }

  /* ===== ROLE SESUAI ===== */

  return <>{children}</>

}