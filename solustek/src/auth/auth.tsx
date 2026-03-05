/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Role =
  | 'KOKO' // Koko - satu orang yang mengelola supply chain
  | 'VENDOR' // Vendor
  | 'MBG_AKUNTAN' // Akuntan MBG
  | 'MBG_ASLAP' // Aslap MBG
  | 'SPPG' // SPPG

export type AuthUser = {
  id: string
  name: string
  roles: Role[]
}

type AuthContextValue = {
  user: AuthUser | null
  loginAs: (role: Role) => void
  logout: () => void
  hasAnyRole: (roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const storageKey = 'solustek.auth.user'

function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.id || !parsed?.name || !Array.isArray(parsed?.roles)) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    parseStoredUser(localStorage.getItem(storageKey)),
  )

  useEffect(() => {
    if (!user) localStorage.removeItem(storageKey)
    else localStorage.setItem(storageKey, JSON.stringify(user))
  }, [user])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      loginAs: (role) =>
        setUser({
          id: 'u-koko-demo',
          name: 'Koko (Demo)',
          roles: [role],
        }),
      logout: () => setUser(null),
      hasAnyRole: (roles) => {
        if (!user) return false
        return roles.some((r) => user.roles.includes(r))
      },
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

