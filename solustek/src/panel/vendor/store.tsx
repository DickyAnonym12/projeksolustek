/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useMemo, useReducer } from "react"
import type { ID, PurchaseOrder } from "../koko/types"

type VendorProduct = {
  id: ID
  vendorId: ID
  catalogItemId: ID
  costPrice: number
  stock: number
  active: boolean
}

export type VendorState = {
  vendorProducts: VendorProduct[]
  pos: PurchaseOrder[]
}

type Action =
  | {
      type: "PRODUCT_UPDATE"
      productId: ID
      costPrice: number
      stock: number
    }
  | {
      type: "SHIPPING_UPDATE"
      poId: ID
      status: "PROCESSING" | "SHIPPED" | "DELIVERED"
    }

const initialState: VendorState = {
  vendorProducts: [
    {
      id: "vp-1",
      vendorId: "vendor1",
      catalogItemId: "c-ayam",
      costPrice: 30000,
      stock: 200,
      active: true,
    },
  ],

  pos: [
    {
      id: "po-1",
      prId: "pr-1",
      vendorId: "vendor1",
      issuedAt: new Date().toISOString(),
      status: "PROCESSING",
    },
  ],
}

function reducer(state: VendorState, action: Action): VendorState {

  switch (action.type) {

    case "PRODUCT_UPDATE":

      return {
        ...state,
        vendorProducts: state.vendorProducts.map((p) =>
          p.id === action.productId
            ? {
                ...p,
                costPrice: action.costPrice,
                stock: action.stock,
              }
            : p
        ),
      }

    case "SHIPPING_UPDATE":

      return {
        ...state,
        pos: state.pos.map((po) =>
          po.id === action.poId
            ? {
                ...po,
                status: action.status,
              }
            : po
        ),
      }

    default:
      return state
  }

}

type VendorContextValue = {

  state: VendorState

  updateProduct: (args: {
    productId: ID
    costPrice: number
    stock: number
  }) => void

  updateShipping: (args: {
    poId: ID
    status: "PROCESSING" | "SHIPPED" | "DELIVERED"
  }) => void
}

const VendorContext = createContext<VendorContextValue | null>(null)

export function VendorProvider({ children }: { children: React.ReactNode }) {

  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo<VendorContextValue>(() => {

    return {

      state,

      updateProduct: ({ productId, costPrice, stock }: {
        productId: ID
        costPrice: number
        stock: number
      }) =>
        dispatch({
          type: "PRODUCT_UPDATE",
          productId,
          costPrice,
          stock,
        }),

      updateShipping: ({ poId, status }: {
        poId: ID
        status: "PROCESSING" | "SHIPPED" | "DELIVERED"
      }) =>
        dispatch({
          type: "SHIPPING_UPDATE",
          poId,
          status,
        }),

    }

  }, [state])

  return (
    <VendorContext.Provider value={value}>
      {children}
    </VendorContext.Provider>
  )
}

export function useVendor() {

  const ctx = useContext(VendorContext)

  if (!ctx) {
    throw new Error("useVendor must be used within VendorProvider")
  }

  return ctx
}