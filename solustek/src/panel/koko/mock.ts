import type { CatalogItem, Dispute, HETHistory, Invoice, MbqUnit, PurchaseOrder, PurchaseRequest, Vendor } from './types'

export const mockUnits: MbqUnit[] = [
  { id: 'u-pekanbaru', name: 'MBG Pekanbaru', city: 'Pekanbaru' },
  { id: 'u-bandung', name: 'MBG Bandung', city: 'Bandung' },
]

export const mockVendors: Vendor[] = [
  { id: 'v-lokal-1', name: 'Vendor Lokal A', city: 'Pekanbaru', active: true },
  { id: 'v-luar-1', name: 'Vendor Luar Kota B', city: 'Medan', active: true },
]

export const mockCatalog: CatalogItem[] = [
  { id: 'c-ayam-karkas-1kg', name: 'Ayam Karkas', variant: 'Ukuran 1kg', unit: 'Kg', active: true },
  { id: 'c-sapi-paha', name: 'Daging Sapi', variant: 'Paha Belakang', unit: 'Kg', active: true },
  { id: 'c-telur', name: 'Telur Ayam', variant: 'Grade A', unit: 'Pcs', active: true },
]

export const mockHETHistory: HETHistory[] = [
  {
    id: 'het-1',
    catalogItemId: 'c-ayam-karkas-1kg',
    region: 'Pekanbaru',
    het: 26000,
    setAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    setBy: 'koko-admin',
  },
  {
    id: 'het-2',
    catalogItemId: 'c-sapi-paha',
    region: 'Bandung',
    het: 125000,
    setAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    setBy: 'koko-admin',
  },
]

export const mockPRs: PurchaseRequest[] = [
  {
    id: 'pr-1001',
    unitId: 'u-pekanbaru',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    status: 'WAITING_KOKO_REVIEW',
    notes: 'Untuk menu besok pagi',
    lines: [
      { id: 'prl-1', catalogItemId: 'c-ayam-karkas-1kg', qty: 25, het: 26000 },
      { id: 'prl-2', catalogItemId: 'c-telur', qty: 180, het: 2200 },
    ],
  },
  {
    id: 'pr-1002',
    unitId: 'u-bandung',
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    status: 'APPROVED_PO_ISSUED',
    assignedVendorId: 'v-luar-1',
    shippingCost: 150000,
    lines: [{ id: 'prl-3', catalogItemId: 'c-sapi-paha', qty: 10, het: 125000 }],
  },
]

export const mockPOs: PurchaseOrder[] = [
  {
    id: 'po-9001',
    prId: 'pr-1002',
    vendorId: 'v-luar-1',
    issuedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'SHIPPED',
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-7001',
    prId: 'pr-1002',
    poId: 'po-9001',
    unitId: 'u-bandung',
    amount: 10 * 125000 + 150000,
    status: 'PROOF_UPLOADED',
    proofUrl: 'bukti-transfer-demo.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
  },
]

export const mockDisputes: Dispute[] = [
  {
    id: 'dsp-3001',
    prId: 'pr-1002',
    poId: 'po-9001',
    unitId: 'u-bandung',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    evidencePhotos: ['foto-1.jpg', 'foto-2.jpg'],
    summary: 'Aslap lapor 2kg ditolak karena kualitas (busuk).',
  },
]