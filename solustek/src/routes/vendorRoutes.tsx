import { Route } from "react-router-dom";
import { RequireRole } from "../auth/RequireRole";

import { VendorLayout } from "../panel/vendor/VendorLayout";

import { VendorDashboardPage } from "../panel/vendor/pages/VendorDashboardPage";
import { VendorPOPage } from "../panel/vendor/pages/VendorPOPage";
import { VendorShippingPage } from "../panel/vendor/pages/VendorShippingPage";
import { VendorHistoryPage } from "../panel/vendor/pages/VendorHistoryPage";
import { VendorProductPage } from "../panel/vendor/pages/VendorProductPage";
import { VendorProvider } from "../panel/vendor/store";

export const vendorRoutes = (

  <Route
    path="/vendor"
    element={
      <RequireRole anyOf={["VENDOR"]}>
        <VendorProvider>
            <VendorLayout />
        </VendorProvider>
      </RequireRole>
    }
  >

    <Route path="dashboard" element={<VendorDashboardPage />} />
    <Route path="po" element={<VendorPOPage />} />
    <Route path="shipping" element={<VendorShippingPage />} />
    <Route path="history" element={<VendorHistoryPage />} />
    <Route path="inventory" element={<VendorProductPage />} />

  </Route>

);