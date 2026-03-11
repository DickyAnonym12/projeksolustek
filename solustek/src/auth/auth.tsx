/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { Role, UserAccount } from "../panel/koko/types"

/* =========================
   AUTH USER SESSION
========================= */

export type AuthUser = {
  id: string
  name: string
  roles: Role[]
}

/* =========================
   CONTEXT TYPE
========================= */

type AuthContextValue = {
  user: AuthUser | null
  login: (username: string, password: string) => boolean
  logout: () => void
  hasAnyRole: (roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const storageKey = "solustek.auth.user"

/* =========================
   DEMO ACCOUNT
========================= */

const accounts: UserAccount[] = [
  {
    id: "u-admin",
    username: "admin",
    password: "123456",
    name: "Administrator",
    roles: ["ADMIN"],
    active: true,
    createdAt: new Date().toISOString(),
  },
]

/* =========================
   LOAD STORED USER
========================= */

function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as AuthUser

    if (!parsed?.id || !parsed?.name || !Array.isArray(parsed.roles)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

/* =========================
   PROVIDER
========================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    parseStoredUser(localStorage.getItem(storageKey))
  )

  useEffect(() => {
    if (!user) {
      localStorage.removeItem(storageKey)
    } else {
      localStorage.setItem(storageKey, JSON.stringify(user))
    }
  }, [user])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,

      login: (username: string, password: string) => {
        const acc = accounts.find(
          (a) => a.username === username && a.password === password && a.active
        )

        if (!acc) return false

        const sessionUser: AuthUser = {
          id: acc.id,
          name: acc.name,
          roles: acc.roles,
        }

        setUser(sessionUser)

        return true
      },

      logout: () => {
        setUser(null)
      },

      hasAnyRole: (roles: Role[]) => {
        if (!user) return false
        return roles.some((r) => user.roles.includes(r))
      },
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* =========================
   HOOK
========================= */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return ctx
}