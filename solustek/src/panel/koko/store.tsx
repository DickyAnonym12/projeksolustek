/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

import {
  mockCatalog,
  mockDisputes,
  mockHETHistory,
  mockInvoices,
  mockPOs,
  mockPRs,
  mockUnits,
  mockVendors,
} from "./mock";

import type {
  AuditEvent,
  CatalogItem,
  Dispute,
  HETHistory,
  ID,
  Invoice,
  MbqUnit,
  PurchaseOrder,
  PurchaseRequest,
  Vendor,
  VendorUnitMapping,
  PurchaseRequestStatus,
  InvoiceStatus,
  DisputeStatus,
} from "./types";

export type KokoState = {
  units: MbqUnit[];
  vendors: Vendor[];
  catalog: CatalogItem[];
  hetHistory: HETHistory[];
  prs: PurchaseRequest[];
  pos: PurchaseOrder[];
  invoices: Invoice[];
  disputes: Dispute[];
  audit: AuditEvent[];

  vendorMappings: VendorUnitMapping[];

  danaTalanganThreshold: number;
};

type Action =
  | {
      type: "PR_APPROVE_AND_ISSUE_PO";
      prId: ID;
      vendorId: ID;
      shippingCost: number;
      actor: string;
    }
  | { type: "INVOICE_VERIFY"; invoiceId: ID; paidAmount: number; actor: string }
  | { type: "INVOICE_CLOSE"; invoiceId: ID; actor: string }
  | {
      type: "DISPUTE_RESOLVE";
      disputeId: ID;
      decision: "VALIDATE" | "REJECT";
      adjustedAmount?: number;
      actor: string;
    }
  | { type: "CATALOG_ADD"; item: CatalogItem; actor: string }
  | { type: "CATALOG_TOGGLE_STATUS"; catalogItemId: ID; actor: string }
  | {
      type: "HET_UPDATE";
      catalogItemId: ID;
      region: string;
      het: number;
      actor: string;
    }
  | { type: "VENDOR_MAPPING_TOGGLE"; vendorId: ID; unitId: ID }
  | { type: "VENDOR_ADD"; vendor: Vendor }
  | { type: "VENDOR_TOGGLE_STATUS"; vendorId: ID };

const storageKey = "solustek.koko.state.v1";

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`;
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

    vendorMappings: [
      {
        id: "map-1",
        vendorId: "v-lokal-1",
        unitId: "u-pekanbaru",
      },
    ],

    danaTalanganThreshold: 50000000,

    audit: [
      {
        id: "aud-1",
        at: nowIso(),
        actor: "system",
        action: "INIT_DEMO_DATA",
      },
    ],
  };
}

function loadState(): KokoState {
  const raw = localStorage.getItem(storageKey);

  if (!raw) return initialState();

  try {
    const parsed = JSON.parse(raw) as KokoState;

    if (!parsed?.prs || !parsed?.catalog) return initialState();

    return {
      ...parsed,
      hetHistory: parsed.hetHistory ?? mockHETHistory,
      danaTalanganThreshold: parsed.danaTalanganThreshold ?? 50000000,
      vendorMappings: parsed.vendorMappings ?? [],
    };
  } catch {
    return initialState();
  }
}

function reducer(state: KokoState, action: Action): KokoState {
  switch (action.type) {

    case "PR_APPROVE_AND_ISSUE_PO": {
      const pr = state.prs.find((p) => p.id === action.prId);
      if (!pr) return state;

      const updatedPRs = state.prs.map((p) =>
        p.id !== action.prId
          ? p
          : {
              ...p,
              status: "APPROVED_PO_ISSUED" as PurchaseRequestStatus,
              assignedVendorId: action.vendorId,
              shippingCost: action.shippingCost,
            }
      );

      const newPo: PurchaseOrder = {
        id: id("po"),
        prId: action.prId,
        vendorId: action.vendorId,
        issuedAt: nowIso(),
        status: "ISSUED",
      };

      return {
        ...state,
        prs: updatedPRs,
        pos: [newPo, ...state.pos],
      };
    }

    case "INVOICE_VERIFY": {

      const updated = state.invoices.map((i) =>
        i.id !== action.invoiceId
          ? i
          : {
              ...i,
              status: "VERIFIED" as InvoiceStatus,
              paidAmount: action.paidAmount,
              verifiedAt: nowIso(),
            }
      );

      return { ...state, invoices: updated };
    }

    case "INVOICE_CLOSE": {

      const updated = state.invoices.map((i) =>
        i.id !== action.invoiceId
          ? i
          : {
              ...i,
              status: "CLOSED" as InvoiceStatus,
              closedAt: nowIso(),
            }
      );

      return { ...state, invoices: updated };
    }

    case "DISPUTE_RESOLVE": {

      const updatedDisputes = state.disputes.map((d) =>
        d.id !== action.disputeId
          ? d
          : {
              ...d,
              status:
                (action.decision === "VALIDATE"
                  ? "VALIDATED"
                  : "REJECTED") as DisputeStatus,
            }
      );

      return { ...state, disputes: updatedDisputes };
    }

    case "CATALOG_ADD":
      return {
        ...state,
        catalog: [action.item, ...state.catalog],
      };

    case "CATALOG_TOGGLE_STATUS":
      return {
        ...state,
        catalog: state.catalog.map((c) =>
          c.id !== action.catalogItemId ? c : { ...c, active: !c.active }
        ),
      };

    case "HET_UPDATE": {

      const newHistory: HETHistory = {
        id: id("het"),
        catalogItemId: action.catalogItemId,
        region: action.region,
        het: action.het,
        setAt: nowIso(),
        setBy: action.actor,
      };

      return {
        ...state,
        hetHistory: [newHistory, ...state.hetHistory],
      };
    }

    case "VENDOR_MAPPING_TOGGLE": {

      const exists = state.vendorMappings.find(
        (m) => m.vendorId === action.vendorId && m.unitId === action.unitId
      );

      if (exists) {
        return {
          ...state,
          vendorMappings: state.vendorMappings.filter(
            (m) =>
              !(m.vendorId === action.vendorId && m.unitId === action.unitId)
          ),
        };
      }

      return {
        ...state,
        vendorMappings: [
          ...state.vendorMappings,
          {
            id: id("map"),
            vendorId: action.vendorId,
            unitId: action.unitId,
          },
        ],
      };
    }

    case "VENDOR_ADD":
      return {
        ...state,
        vendors: [action.vendor, ...state.vendors],
      };

    case "VENDOR_TOGGLE_STATUS":
      return {
        ...state,
        vendors: state.vendors.map((v) =>
          v.id !== action.vendorId ? v : { ...v, active: !v.active }
        ),
      };

    default:
      return state;
  }
}

type KokoContextValue = {
  state: KokoState;

  approveAndIssuePO: (args: {
    prId: ID;
    vendorId: ID;
    shippingCost: number;
    actor: string;
  }) => void;

  verifyInvoice: (args: {
    invoiceId: ID;
    paidAmount: number;
    actor: string;
  }) => void;

  closeInvoice: (args: { invoiceId: ID; actor: string }) => void;

  resolveDispute: (args: {
    disputeId: ID;
    decision: "VALIDATE" | "REJECT";
    adjustedAmount?: number;
    actor: string;
  }) => void;

  addCatalogItem: (args: {
    name: string;
    variant: string;
    unit: CatalogItem["unit"];
    actor: string;
  }) => void;

  toggleCatalogStatus: (args: { catalogItemId: ID; actor: string }) => void;

  updateHET: (args: {
    catalogItemId: ID;
    region: string;
    het: number;
    actor: string;
  }) => void;

  toggleVendorMapping: (args: { vendorId: ID; unitId: ID }) => void;

  addVendor: (args: { name: string; city: string }) => void;

  toggleVendorStatus: (vendorId: ID) => void;
};

const KokoContext = createContext<KokoContextValue | null>(null);

export function KokoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const value = useMemo<KokoContextValue>(() => {
    return {
      state,

      approveAndIssuePO: ({ prId, vendorId, shippingCost, actor }) =>
        dispatch({
          type: "PR_APPROVE_AND_ISSUE_PO",
          prId,
          vendorId,
          shippingCost,
          actor,
        }),

      verifyInvoice: ({ invoiceId, paidAmount, actor }) =>
        dispatch({
          type: "INVOICE_VERIFY",
          invoiceId,
          paidAmount,
          actor,
        }),

      closeInvoice: ({ invoiceId, actor }) =>
        dispatch({
          type: "INVOICE_CLOSE",
          invoiceId,
          actor,
        }),

      resolveDispute: ({ disputeId, decision, adjustedAmount, actor }) =>
        dispatch({
          type: "DISPUTE_RESOLVE",
          disputeId,
          decision,
          adjustedAmount,
          actor,
        }),

      addCatalogItem: ({ name, variant, unit, actor }) =>
        dispatch({
          type: "CATALOG_ADD",
          actor,
          item: {
            id: id("c"),
            name,
            variant,
            unit,
            active: true,
          },
        }),

      toggleCatalogStatus: ({ catalogItemId, actor }) =>
        dispatch({
          type: "CATALOG_TOGGLE_STATUS",
          catalogItemId,
          actor,
        }),

      updateHET: ({ catalogItemId, region, het, actor }) =>
        dispatch({
          type: "HET_UPDATE",
          catalogItemId,
          region,
          het,
          actor,
        }),

      toggleVendorMapping: ({ vendorId, unitId }) =>
        dispatch({
          type: "VENDOR_MAPPING_TOGGLE",
          vendorId,
          unitId,
        }),

      addVendor: ({ name, city }) =>
        dispatch({
          type: "VENDOR_ADD",
          vendor: {
            id: id("v"),
            name,
            city,
            active: true,
          },
        }),

      toggleVendorStatus: (vendorId) =>
        dispatch({
          type: "VENDOR_TOGGLE_STATUS",
          vendorId,
        }),
    };
  }, [state]);

  return <KokoContext.Provider value={value}>{children}</KokoContext.Provider>;
}

export function useKoko() {
  const ctx = useContext(KokoContext);

  if (!ctx) throw new Error("useKoko must be used within KokoProvider");

  return ctx;
}