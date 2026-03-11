import type { Role } from './types'

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

const KOKO: Role[] = ['ADMIN']

export const kokoNav: NavGroup[] = [
  {
    label: 'Dashboard',
    color: '#3b82f6',
    items: [
      { label: 'Dashboard Operasional', to: '/koko/dashboard', anyOfRoles: KOKO }
    ],
  },

  {
    label: 'Operasional',
    color: '#f97316',
    items: [
      { label: 'Review Pesanan (PR)', to: '/koko/operasional/review-pesanan', anyOfRoles: KOKO },
      { label: 'Logistic Center', to: '/koko/operasional/logistic-center', anyOfRoles: KOKO },
      { label: 'Monitoring Pengiriman', to: '/koko/operasional/monitoring-pengiriman', anyOfRoles: KOKO },
      { label: 'Dispute Center', to: '/koko/operasional/dispute-center', anyOfRoles: KOKO },
    ],
  },

  {
    label: 'Keuangan',
    color: '#10b981',
    items: [
      { label: 'Invoice & Piutang SPPG', to: '/koko/keuangan/invoice', anyOfRoles: KOKO },
      { label: 'Verifikasi Pembayaran', to: '/koko/keuangan/verifikasi', anyOfRoles: KOKO },
      { label: 'Settlement Vendor', to: '/koko/keuangan/settlement-vendor', anyOfRoles: KOKO },
      { label: 'Closing Harian', to: '/koko/keuangan/closing', anyOfRoles: KOKO },
    ],
  },

  {
    label: 'Master Data',
    color: '#6366f1',
    items: [
      { label: 'Master Katalog (SKU)', to: '/koko/master/katalog', anyOfRoles: KOKO },
      { label: 'Unit MBG & Wilayah', to: '/koko/master/unit-wilayah', anyOfRoles: KOKO },
      { label: 'Manajemen Vendor', to: '/koko/master/vendor', anyOfRoles: KOKO },
      { label: 'Mapping Vendor → Unit', to: '/koko/master/mapping', anyOfRoles: KOKO },
    ],
  },

  {
    label: 'Pricing Engine',
    color: '#ec4899',
    items: [
      { label: 'Penetapan HET', to: '/koko/pricing/het', anyOfRoles: KOKO }
    ],
  },

  {
    label: 'Pelaporan & Audit',
    color: '#64748b',
    items: [
      { label: 'Audit Log', to: '/koko/reporting/audit-log', anyOfRoles: KOKO },
      { label: 'Profit & Margin', to: '/koko/reporting/profit', anyOfRoles: KOKO },
      { label: 'Piutang', to: '/koko/reporting/piutang', anyOfRoles: KOKO },
      { label: 'Hutang Vendor', to: '/koko/reporting/hutang-vendor', anyOfRoles: KOKO },
    ],
  },
]

