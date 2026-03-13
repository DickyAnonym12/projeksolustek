/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Role =
  | "ADMIN"
  | "VENDOR"
  | "MBG_AKUNTAN"
  | "MBG_ASLAP"
  | "SPPG"

export type AuthUser = {
  id: string
  username: string
  name: string
  role: Role
}

type AuthContextValue = {
  user: AuthUser | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const storageKey = "sitala.auth.user"

/* ================= MOCK USERS ================= */

const mockUsers: AuthUser[] = [

  {
    id: "1",
    username: "admin",
    name: "Admin SITALA",
    role: "ADMIN",
  },

  {
    id: "2",
    username: "vendor1",
    name: "Vendor Beras",
    role: "VENDOR",
  },

]

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<AuthUser | null>(() => {

    const raw = localStorage.getItem(storageKey)

    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch {
      return null
    }

  })

  useEffect(() => {

    if (!user) localStorage.removeItem(storageKey)
    else localStorage.setItem(storageKey, JSON.stringify(user))

  }, [user])

  const value = useMemo<AuthContextValue>(() => {

    return {

      user,

      login: (username, password) => {

        /* password demo = 123 */

        const found = mockUsers.find(
          (u) => u.username === username && password === "123"
        )

        if (!found) return false

        setUser(found)

        return true

      },

      logout: () => setUser(null),

    }

  }, [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  const ctx = useContext(AuthContext)

  if (!ctx) throw new Error("useAuth must be used within AuthProvider")

  return ctx

}