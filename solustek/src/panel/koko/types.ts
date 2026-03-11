export type ID = string

/* =========================
   ROLE
========================= */

export type Role =
  | 'ADMIN'
  | 'VENDOR'
  | 'MBG_AKUNTAN'
  | 'MBG_ASLAP'
  | 'SPPG'

/* =========================
   USER ACCOUNT
========================= */

export type UserAccount = {
  id: ID
  username: string
  password: string
  name: string
  roles: Role[]
  active: boolean
  createdAt: string
}

/* =========================
   MASTER DATA
========================= */

export type MbqUnit = {
  id: ID
  name: string
  city: string
}

export type Vendor = {
  id: ID
  name: string
  city: string
  active: boolean
}

export type CatalogItem = {
  id: ID
  name: string
  variant: string
  unit: 'Kg' | 'Pcs' | 'Liter'
  active: boolean
}

/* =========================
   PURCHASE REQUEST
========================= */

export type PurchaseRequestStatus =
  | 'WAITING_KOKO_REVIEW'
  | 'APPROVED_PO_ISSUED'
  | 'REJECTED'

export type PurchaseRequestLine = {
  id: ID
  catalogItemId: ID
  qty: number
  het: number
}

export type PurchaseRequest = {
  id: ID
  unitId: ID
  createdAt: string
  status: PurchaseRequestStatus
  lines: PurchaseRequestLine[]
  notes?: string
  assignedVendorId?: ID
  shippingCost?: number
}

/* =========================
   PURCHASE ORDER
========================= */

export type PurchaseOrderStatus =
  | 'ISSUED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'

export type PurchaseOrder = {
  id: ID
  prId: ID
  vendorId: ID
  issuedAt: string
  status: PurchaseOrderStatus
}

/* =========================
   INVOICE
========================= */

export type InvoiceStatus =
  | 'GENERATED'
  | 'UNPAID'
  | 'PROOF_UPLOADED'
  | 'VERIFIED'
  | 'CLOSED'

export type Invoice = {
  id: ID
  prId: ID
  poId: ID
  unitId: ID
  amount: number
  paidAmount?: number
  status: InvoiceStatus
  proofUrl?: string
  createdAt: string
  verifiedAt?: string
  closedAt?: string
}

/* =========================
   DISPUTE
========================= */

export type DisputeStatus =
  | 'OPEN'
  | 'VALIDATED'
  | 'REJECTED'

export type Dispute = {
  id: ID
  prId: ID
  poId: ID
  unitId: ID
  status: DisputeStatus
  createdAt: string
  evidencePhotos: string[]
  summary: string
}

/* =========================
   HET HISTORY
========================= */

export type HETHistory = {
  id: ID
  catalogItemId: ID
  region: string
  het: number
  setAt: string
  setBy: string
}

/* =========================
   AUDIT
========================= */

export type AuditEvent = {
  id: ID
  at: string
  actor: string
  action: string
  meta?: Record<string, string | number | boolean | null | undefined>
}