/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { mockCatalog, mockDisputes, mockHETHistory, mockInvoices, mockPOs, mockPRs, mockUnits, mockVendors } from './mock'
import type { AuditEvent, CatalogItem, Dispute, HETHistory, ID, Invoice, MbqUnit, PurchaseOrder, PurchaseRequest, Vendor } from './types'

export type KokoState = {
  units: MbqUnit[]
  vendors: Vendor[]
  catalog: CatalogItem[]
  hetHistory: HETHistory[]
  prs: PurchaseRequest[]
  pos: PurchaseOrder[]
  invoices: Invoice[]
  disputes: Dispute[]
  audit: AuditEvent[]
  danaTalanganThreshold: number
}

type Action =
  | { type: 'PR_APPROVE_AND_ISSUE_PO'; prId: ID; vendorId: ID; shippingCost: number; actor: string }
  | { type: 'INVOICE_VERIFY'; invoiceId: ID; paidAmount: number; actor: string }
  | { type: 'INVOICE_CLOSE'; invoiceId: ID; actor: string }
  | { type: 'DISPUTE_RESOLVE'; disputeId: ID; decision: 'VALIDATE' | 'REJECT'; adjustedAmount?: number; actor: string }
  | { type: 'CATALOG_ADD'; item: CatalogItem; actor: string }
  | { type: 'CATALOG_TOGGLE_STATUS'; catalogItemId: ID; actor: string }
  | { type: 'HET_UPDATE'; catalogItemId: ID; region: string; het: number; actor: string }

const storageKey = 'solustek.koko.state.v1'

function nowIso() {
  return new Date().toISOString()
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`
}

function initialState(): KokoState {
  return {
    units: mockUnits,
    vendors: mockVendors,
    catalog: mockCatalog,
    hetHistory: mockHETHistory,
    prs: mockPRs,
    pos: mockPOs,
    invoices: mockInvoices,
    disputes: mockDisputes,
    danaTalanganThreshold: 50000000, // 50 juta
    audit: [
      {
        id: 'aud-1',
        at: nowIso(),
        actor: 'system',
        action: 'INIT_DEMO_DATA',
      },
    ],
  }
}

function loadState(): KokoState {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return initialState()
  try {
    const parsed = JSON.parse(raw) as KokoState
    if (!parsed?.prs || !parsed?.catalog) return initialState()
    // Ensure new fields exist
    return {
      ...parsed,
      hetHistory: parsed.hetHistory ?? mockHETHistory,
      danaTalanganThreshold: parsed.danaTalanganThreshold ?? 50000000,
    }
  } catch {
    return initialState()
  }
}

function reducer(state: KokoState, action: Action): KokoState {
  switch (action.type) {
    case 'PR_APPROVE_AND_ISSUE_PO': {
      const pr = state.prs.find((p) => p.id === action.prId)
      if (!pr) return state

      const updatedPRs: PurchaseRequest[] = state.prs.map((p): PurchaseRequest => {
        if (p.id !== action.prId) return p
        return {
          ...p,
          status: 'APPROVED_PO_ISSUED',
          assignedVendorId: action.vendorId,
          shippingCost: action.shippingCost,
        }
      })

      const newPo: PurchaseOrder = {
        id: id('po'),
        prId: action.prId,
        vendorId: action.vendorId,
        issuedAt: nowIso(),
        status: 'ISSUED',
      }

      const audit: AuditEvent = {
        id: id('aud'),
        at: nowIso(),
        actor: action.actor,
        action: 'APPROVE_AND_ISSUE_PO',
        meta: { prId: action.prId, vendorId: action.vendorId, shippingCost: action.shippingCost },
      }

      return {
        ...state,
        prs: updatedPRs,
        pos: [newPo, ...state.pos],
        audit: [audit, ...state.audit],
      }
    }
    case 'INVOICE_VERIFY': {
      const inv = state.invoices.find((i) => i.id === action.invoiceId)
      if (!inv) return state
      const updated: Invoice[] = state.invoices.map((i): Invoice => {
        if (i.id !== action.invoiceId) return i
        return { ...i, status: 'VERIFIED', paidAmount: action.paidAmount, verifiedAt: nowIso() }
      })
      const audit: AuditEvent = {
        id: id('aud'),
        at: nowIso(),
        actor: action.actor,
        action: 'VERIFY_SPPG_PAYMENT',
        meta: { invoiceId: action.invoiceId, prId: inv.prId, paidAmount: action.paidAmount },
      }
      return { ...state, invoices: updated, audit: [audit, ...state.audit] }
    }
    case 'INVOICE_CLOSE': {
      const inv = state.invoices.find((i) => i.id === action.invoiceId)
      if (!inv || inv.status !== 'VERIFIED') return state
      const updated: Invoice[] = state.invoices.map((i): Invoice => {
        if (i.id !== action.invoiceId) return i
        return { ...i, status: 'CLOSED', closedAt: nowIso() }
      })
      const audit: AuditEvent = {
        id: id('aud'),
        at: nowIso(),
        actor: action.actor,
        action: 'CLOSE_TRANSACTION',
        meta: { invoiceId: action.invoiceId, prId: inv.prId },
      }
      return { ...state, invoices: updated, audit: [audit, ...state.audit] }
    }
    case 'DISPUTE_RESOLVE': {
      const dispute = state.disputes.find((d) => d.id === action.disputeId)
      if (!dispute) return state

      const updated: Dispute[] = state.disputes.map((d): Dispute => {
        if (d.id !== action.disputeId) return d
        return { ...d, status: action.decision === 'VALIDATE' ? 'VALIDATED' : 'REJECTED' }
      })

      // Adjust invoice amount if validated
      let updatedInvoices = state.invoices
      if (action.decision === 'VALIDATE' && action.adjustedAmount !== undefined) {
        updatedInvoices = state.invoices.map((i): Invoice => {
          if (i.prId === dispute.prId) {
            return { ...i, amount: action.adjustedAmount! }
          }
          return i
        })
      }

      const audit: AuditEvent = {
        id: id('aud'),
        at: nowIso(),
        actor: action.actor,
        action: 'RESOLVE_DISPUTE',
        meta: { 
          disputeId: action.disputeId, 
          decision: action.decision,
          adjustedAmount: action.adjustedAmount 
        },
      }
      return { ...state, disputes: updated, invoices: updatedInvoices, audit: [audit, ...state.audit] }
    }
    case 'CATALOG_ADD': {
      const audit: AuditEvent = {
        id: id('aud'),
        at: nowIso(),
        actor: action.actor,
        action: 'CATALOG_ADD_ITEM',
        meta: { catalogItemId: action.item.id, name: action.item.name },
      }
      return { ...state, catalog: [action.item, ...state.catalog], audit: [audit, ...state.audit] }
    }
    case 'CATALOG_TOGGLE_STATUS': {
      const item = state.catalog.find((c) => c.id === action.catalogItemId)
      if (!item) return state
      
      const updated: CatalogItem[] = state.catalog.map((c): CatalogItem => {
        if (c.id !== action.catalogItemId) return c
        return { ...c, active: !c.active }
      })
      
      const audit: AuditEvent = {
        id: id('aud'),
        at: nowIso(),
        actor: action.actor,
        action: 'CATALOG_TOGGLE_STATUS',
        meta: { catalogItemId: action.catalogItemId, newStatus: !item.active },
      }
      return { ...state, catalog: updated, audit: [audit, ...state.audit] }
    }
    case 'HET_UPDATE': {
      const newHistory: HETHistory = {
        id: id('het'),
        catalogItemId: action.catalogItemId,
        region: action.region,
        het: action.het,
        setAt: nowIso(),
        setBy: action.actor,
      }
      
      const audit: AuditEvent = {
        id: id('aud'),
        at: nowIso(),
        actor: action.actor,
        action: 'HET_UPDATE',
        meta: { 
          catalogItemId: action.catalogItemId, 
          region: action.region,
          het: action.het 
        },
      }
      return { 
        ...state, 
        hetHistory: [newHistory, ...state.hetHistory], 
        audit: [audit, ...state.audit] 
      }
    }
    default:
      return state
  }
}

type KokoContextValue = {
  state: KokoState
  approveAndIssuePO: (args: { prId: ID; vendorId: ID; shippingCost: number; actor: string }) => void
  verifyInvoice: (args: { invoiceId: ID; paidAmount: number; actor: string }) => void
  closeInvoice: (args: { invoiceId: ID; actor: string }) => void
  resolveDispute: (args: { disputeId: ID; decision: 'VALIDATE' | 'REJECT'; adjustedAmount?: number; actor: string }) => void
  addCatalogItem: (args: { name: string; variant: string; unit: CatalogItem['unit']; actor: string }) => void
  toggleCatalogStatus: (args: { catalogItemId: ID; actor: string }) => void
  updateHET: (args: { catalogItemId: ID; region: string; het: number; actor: string }) => void
}

const KokoContext = createContext<KokoContextValue | null>(null)

export function KokoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  const value = useMemo<KokoContextValue>(() => {
    return {
      state,
      approveAndIssuePO: ({ prId, vendorId, shippingCost, actor }) =>
        dispatch({ type: 'PR_APPROVE_AND_ISSUE_PO', prId, vendorId, shippingCost, actor }),
      verifyInvoice: ({ invoiceId, paidAmount, actor }) =>
        dispatch({ type: 'INVOICE_VERIFY', invoiceId, paidAmount, actor }),
      closeInvoice: ({ invoiceId, actor }) =>
        dispatch({ type: 'INVOICE_CLOSE', invoiceId, actor }),
      resolveDispute: ({ disputeId, decision, adjustedAmount, actor }) =>
        dispatch({ type: 'DISPUTE_RESOLVE', disputeId, decision, adjustedAmount, actor }),
      addCatalogItem: ({ name, variant, unit, actor }) =>
        dispatch({
          type: 'CATALOG_ADD',
          actor,
          item: { id: id('c'), name, variant, unit, active: true },
        }),
      toggleCatalogStatus: ({ catalogItemId, actor }) =>
        dispatch({ type: 'CATALOG_TOGGLE_STATUS', catalogItemId, actor }),
      updateHET: ({ catalogItemId, region, het, actor }) =>
        dispatch({ type: 'HET_UPDATE', catalogItemId, region, het, actor }),
    }
  }, [state])

  return <KokoContext.Provider value={value}>{children}</KokoContext.Provider>
}

export function useKoko() {
  const ctx = useContext(KokoContext)
  if (!ctx) throw new Error('useKoko must be used within KokoProvider')
  return ctx
}

