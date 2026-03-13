import type { Role } from "../../auth/auth";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  AlertTriangle,
  Receipt,
  CheckCircle,
  DollarSign,
  Package,
  Building2,
  Users,
  Link,
  Tags,
  FileText,
  BarChart3,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  anyOfRoles: Role[];
  icon?: ReactNode;
};

export type NavGroup = {
  label: string;
  color: string;
  items: NavItem[];
};

/* ================= ROLE ================= */

const ADMIN: Role[] = ["ADMIN"];

/* ================= NAV ================= */

export const kokoNav: NavGroup[] = [
  {
    label: "Dashboard",
    color: "#3b82f6",
    items: [
      {
        label: "Dashboard Operasional",
        to: "/koko/dashboard",
        icon: <LayoutDashboard size={16} />,
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
        icon: <ClipboardList size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Logistic Center",
        to: "/koko/operasional/logistic-center",
        icon: <Truck size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Monitoring Pengiriman",
        to: "/koko/operasional/monitoring-pengiriman",
        icon: <Truck size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Dispute Center",
        to: "/koko/operasional/dispute-center",
        icon: <AlertTriangle size={16} />,
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
        icon: <Receipt size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Verifikasi Pembayaran",
        to: "/koko/keuangan/verifikasi",
        icon: <CheckCircle size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Settlement Vendor",
        to: "/koko/keuangan/settlement-vendor",
        icon: <DollarSign size={16} />,
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
        icon: <Package size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Unit MBG & Wilayah",
        to: "/koko/master/unit-wilayah",
        icon: <Building2 size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Manajemen Vendor",
        to: "/koko/master/vendor",
        icon: <Users size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Mapping Vendor → Unit",
        to: "/koko/master/mapping",
        icon: <Link size={16} />,
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
        icon: <Tags size={16} />,
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
        icon: <FileText size={16} />,
        anyOfRoles: ADMIN,
      },
      {
        label: "Profit & Margin",
        to: "/koko/reporting/profit",
        icon: <BarChart3 size={16} />,
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
];
