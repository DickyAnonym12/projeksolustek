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

const VENDOR: Role[] = ["VENDOR"]

export const vendorNav: NavGroup[] = [

  {
    label: "Dashboard",
    color: "#3b82f6",
    items: [
      {
        label: "Dashboard Vendor",
        to: "/vendor/dashboard",
        anyOfRoles: VENDOR,
      },
    ],
  },

  {
    label: "Operasional",
    color: "#f97316",
    items: [

      {
        label: "Purchase Order",
        to: "/vendor/po",
        anyOfRoles: VENDOR,
      },

      {
        label: "Pengiriman",
        to: "/vendor/shipping",
        anyOfRoles: VENDOR,
      },

      {
        label: "Produk & Stok",
        to: "/vendor/inventory",
        anyOfRoles: VENDOR,
      },

    ],
  },

  {
    label: "Laporan",
    color: "#64748b",
    items: [

      {
        label: "Riwayat Transaksi",
        to: "/vendor/history",
        anyOfRoles: VENDOR,
      },

    ],
  },

]