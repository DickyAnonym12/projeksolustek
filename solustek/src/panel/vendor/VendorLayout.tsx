import { useMemo } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../../auth/auth"
import { vendorNav } from "./nav"

export function VendorLayout() {

  const { user } = useAuth()

  const nav = useMemo(() => vendorNav, [])

  return (

    <div className="app">

      <aside className="sidebar">

        <div className="sidebar__brand">
          <div className="brand__title">Vendor Panel</div>
          <div className="brand__subtitle">
            Sistem Vendor MBG
          </div>
        </div>

        <nav className="sidebar__nav">

          {nav.map((g) => (

            <div key={g.label} className="navgroup">

              <div className="navgroup__label">
                {g.label}
              </div>

              <div className="navgroup__items">

                {g.items.map((it) => (

                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                      isActive ? "navitem navitem--active" : "navitem"
                    }
                  >
                    {it.label}
                  </NavLink>

                ))}

              </div>

            </div>

          ))}

        </nav>

        <div className="sidebar__footer">
          <div className="muted">
            {user?.name}
          </div>
        </div>

      </aside>

      <div className="main">

        <main className="content">
          <Outlet />
        </main>

      </div>

    </div>

  )
}