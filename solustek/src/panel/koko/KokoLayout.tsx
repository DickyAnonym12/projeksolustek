import { useMemo } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/auth";
import { cx } from "../../ui/cx";
import { Button } from "../../ui/Button";
import { kokoNav } from "./nav";

function formatRole(role: string) {
  return role === "KOKO" ? "Koko" : role;
}

export function KokoLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const nav = useMemo(() => {

  if (!user) return []

  return kokoNav
    .map((g) => ({
      ...g,
      items: g.items.filter((it) =>
        it.anyOfRoles.includes(user.role)
      ),
    }))
    .filter((g) => g.items.length > 0)

}, [user])

  const current = useMemo(() => {
    const path = location.pathname;
    for (const g of kokoNav)
      for (const it of g.items) if (path.startsWith(it.to)) return it;
    return null;
  }, [location.pathname]);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="brand__title">SITALA</div>
          <div className="brand__subtitle">
            Sistem Tata Kelola Logistik & Anggaran MBG
          </div>
        </div>

        <nav className="sidebar__nav">
          {nav.map((g) => (
            <div
              key={g.label}
              className="navgroup"
              style={{
                borderLeft: `4px solid ${g.color}`,
                background: `${g.color}10`,
              }}
            >
              <div className="navgroup__label">{g.label}</div>
              <div className="navgroup__items">
                {g.items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                      cx("navitem", {
                        "navitem--active": isActive,
                      })
                    }
                    end={it.to === "/koko/dashboard"}
                  >
                    {it.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="muted" style={{ fontSize: 12 }}>
            {user ? (
              <>
                <div>{user.name}</div>
                <div>Role: {formatRole(user.role[0] ?? "")}</div>
              </>
            ) : (
              <div>Belum login</div>
            )}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <Link to="/login" className="w100">
              <Button variant="ghost" className="w100">
                Ganti Role
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar__left">
            <div className="topbar__title">
              {current?.label ?? "Panel Koko"}
            </div>
            <div className="topbar__crumb muted">{location.pathname}</div>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
