import type { Role } from "../../auth/auth"

export type NavItem = {
  label: string
  to: string
  anyOfRoles: Role[]
}

export type NavGroup = {
  label: string
  color: string
  items: NavItem[]
}

/* ================= ROLE ================= */

const ADMIN: Role[] = ["ADMIN"]

/* ================= NAV ================= */

export const kokoNav: NavGroup[] = [

  {
    label: "Dashboard",
    color: "#3b82f6",
    items: [
      {
        label: "Dashboard Operasional",
        to: "/koko/dashboard",
        anyOfRoles: ADMIN,
      },
    ],
  },

  {
    label: "Operasional",
    color: "#f97316",
    items: [

      {
        label: "Review Pesanan (PR)",
        to: "/koko/operasional/review-pesanan",
        anyOfRoles: ADMIN,
      },

      {
        label: "Logistic Center",
        to: "/koko/operasional/logistic-center",
        anyOfRoles: ADMIN,
      },

      {
        label: "Monitoring Pengiriman",
        to: "/koko/operasional/monitoring-pengiriman",
        anyOfRoles: ADMIN,
      },

      {
        label: "Dispute Center",
        to: "/koko/operasional/dispute-center",
        anyOfRoles: ADMIN,
      },

    ],
  },

  {
    label: "Keuangan",
    color: "#10b981",
    items: [

      {
        label: "Invoice & Piutang SPPG",
        to: "/koko/keuangan/invoice",
        anyOfRoles: ADMIN,
      },

      {
        label: "Verifikasi Pembayaran",
        to: "/koko/keuangan/verifikasi",
        anyOfRoles: ADMIN,
      },

      {
        label: "Settlement Vendor",
        to: "/koko/keuangan/settlement-vendor",
        anyOfRoles: ADMIN,
      },

      {
        label: "Closing Harian",
        to: "/koko/keuangan/closing",
        anyOfRoles: ADMIN,
      },

    ],
  },

  {
    label: "Master Data",
    color: "#6366f1",
    items: [

      {
        label: "Master Katalog (SKU)",
        to: "/koko/master/katalog",
        anyOfRoles: ADMIN,
      },

      {
        label: "Unit MBG & Wilayah",
        to: "/koko/master/unit-wilayah",
        anyOfRoles: ADMIN,
      },

      {
        label: "Manajemen Vendor",
        to: "/koko/master/vendor",
        anyOfRoles: ADMIN,
      },

      {
        label: "Mapping Vendor → Unit",
        to: "/koko/master/mapping",
        anyOfRoles: ADMIN,
      },

    ],
  },

  {
    label: "Pricing Engine",
    color: "#ec4899",
    items: [

      {
        label: "Penetapan HET",
        to: "/koko/pricing/het",
        anyOfRoles: ADMIN,
      },

    ],
  },

  {
    label: "Pelaporan & Audit",
    color: "#64748b",
    items: [

      {
        label: "Audit Log",
        to: "/koko/reporting/audit-log",
        anyOfRoles: ADMIN,
      },

      {
        label: "Profit & Margin",
        to: "/koko/reporting/profit",
        anyOfRoles: ADMIN,
      },

      {
        label: "Piutang",
        to: "/koko/reporting/piutang",
        anyOfRoles: ADMIN,
      },

      {
        label: "Hutang Vendor",
        to: "/koko/reporting/hutang-vendor",
        anyOfRoles: ADMIN,
      },

    ],
  },

]