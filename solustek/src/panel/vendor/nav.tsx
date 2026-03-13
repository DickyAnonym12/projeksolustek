import type { ReactNode } from "react"
import type { Role } from "../../auth/auth"

import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Package,
  History
} from "lucide-react"

export type NavItem = {
  label: string
  to: string
  anyOfRoles: Role[]
  icon?: ReactNode
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
        icon: <LayoutDashboard size={16} />,
        anyOfRoles: VENDOR
      }
    ]
  },

  {
    label: "Operasional",
    color: "#f97316",
    items: [

      {
        label: "Purchase Order",
        to: "/vendor/po",
        icon: <ClipboardList size={16} />,
        anyOfRoles: VENDOR
      },

      {
        label: "Pengiriman",
        to: "/vendor/shipping",
        icon: <Truck size={16} />,
        anyOfRoles: VENDOR
      },

      {
        label: "Produk & Stok",
        to: "/vendor/inventory",
        icon: <Package size={16} />,
        anyOfRoles: VENDOR
      }

    ]
  },

  {
    label: "Laporan",
    color: "#64748b",
    items: [

      {
        label: "Riwayat Transaksi",
        to: "/vendor/history",
        icon: <History size={16} />,
        anyOfRoles: VENDOR
      }

    ]
  }

]