import { Navigate, useLocation } from 'react-router-dom'
import type { Role } from './auth'
import { useAuth } from './auth'

export function RequireRole({
  anyOf,
  children,
}: {
  anyOf: Role[]
  children: React.ReactNode
}) {
  const { user, hasAnyRole } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!hasAnyRole(anyOf)) return <Navigate to="/login" replace />
  return <>{children}</>
}

