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
    if (!user) return [];

    return kokoNav
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => it.anyOfRoles.includes(user.role)),
      }))
      .filter((g) => g.items.length > 0);
  }, [user]);

  const current = useMemo(() => {
    const path = location.pathname;
    for (const g of kokoNav)
      for (const it of g.items) if (path.startsWith(it.to)) return it;
    return null;
  }, [location.pathname]);

  return (
    <div className="app">
      {/* SIDEBAR */}

      <aside className="sidebar">
        {/* BRAND */}

        <div className="sidebar__brand">
          <div className="brand__logo">S</div>
          <div>
            <div className="brand__title">SITALA</div>
            <div className="brand__subtitle">Supply Chain Control</div>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar__nav">
          {nav.map((g) => (
            <div key={g.label} className="navgroup">
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
                    <span className="navitem__icon">{it.icon || "•"}</span>

                    <span className="navitem__label">{it.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER USER */}

        <div className="sidebar__footer">
          <div className="usercard">
            <div className="usercard__avatar">
              {user?.name?.charAt(0) ?? "U"}
            </div>

            <div className="usercard__info">
              <div className="usercard__name">{user?.name ?? "Guest"}</div>
              <div className="usercard__role">
                {formatRole(user?.role?.[0] ?? "")}
              </div>
            </div>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <Link to="/login" className="w100">
              <Button variant="ghost" className="w100">
                Ganti Role
              </Button>
            </Link>

            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN */}

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
