import type { Role } from '../../auth/auth'

export type NavItem = {
  label: string
  to: string
  anyOfRoles: Role[]
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

const KOKO: Role[] = ['KOKO']

export const kokoNav: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [{ label: 'Dashboard Operasional', to: '/koko/dashboard', anyOfRoles: KOKO }],
  },
  {
    label: 'Operasional',
    items: [
      { label: 'Review Pesanan (PR)', to: '/koko/operasional/review-pesanan', anyOfRoles: KOKO },
      { label: 'Logistic Center', to: '/koko/operasional/logistic-center', anyOfRoles: KOKO },
      { label: 'Monitoring Pengiriman', to: '/koko/operasional/monitoring-pengiriman', anyOfRoles: KOKO },
      { label: 'Dispute Center', to: '/koko/operasional/dispute-center', anyOfRoles: KOKO },
    ],
  },
  {
    label: 'Keuangan',
    items: [
      { label: 'Invoice & Piutang SPPG', to: '/koko/keuangan/invoice', anyOfRoles: KOKO },
      { label: 'Verifikasi Pembayaran', to: '/koko/keuangan/verifikasi', anyOfRoles: KOKO },
      { label: 'Settlement Vendor', to: '/koko/keuangan/settlement-vendor', anyOfRoles: KOKO },
      { label: 'Closing Harian', to: '/koko/keuangan/closing', anyOfRoles: KOKO },
    ],
  },
  {
    label: 'Master Data',
    items: [
      { label: 'Master Katalog (SKU)', to: '/koko/master/katalog', anyOfRoles: KOKO },
      { label: 'Unit MBG & Wilayah', to: '/koko/master/unit-wilayah', anyOfRoles: KOKO },
      { label: 'Manajemen Vendor', to: '/koko/master/vendor', anyOfRoles: KOKO },
      { label: 'Mapping Vendor → Unit', to: '/koko/master/mapping', anyOfRoles: KOKO },
    ],
  },
  {
    label: 'Pricing Engine',
    items: [{ label: 'Penetapan HET', to: '/koko/pricing/het', anyOfRoles: KOKO }],
  },
  {
    label: 'Pelaporan & Audit',
    items: [
      { label: 'Audit Log', to: '/koko/reporting/audit-log', anyOfRoles: KOKO },
      { label: 'Profit & Margin', to: '/koko/reporting/profit', anyOfRoles: KOKO },
      { label: 'Piutang', to: '/koko/reporting/piutang', anyOfRoles: KOKO },
      { label: 'Hutang Vendor', to: '/koko/reporting/hutang-vendor', anyOfRoles: KOKO },
    ],
  },
]

