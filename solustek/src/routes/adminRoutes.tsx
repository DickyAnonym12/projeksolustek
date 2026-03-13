import { Navigate, Route } from "react-router-dom";
import { RequireRole } from "../auth/RequireRole";
import type { Role } from "../panel/koko/types";

import { KokoLayout } from "../panel/koko/KokoLayout";

import { DashboardPage } from "../panel/koko/pages/DashboardPage";
import { ReviewPesananPage } from "../panel/koko/pages/ReviewPesananPage";
import { ReviewPesananDetailPage } from "../panel/koko/pages/ReviewPesananDetailPage";
import { DisputeCenterPage } from "../panel/koko/pages/DisputeCenterPage";
import { DisputeCenterDetailPage } from "../panel/koko/pages/DisputeCenterDetailPage";

import { LogisticCenterPage } from "../panel/koko/pages/LogisticCenterPage";
import { MonitoringPengirimanPage } from "../panel/koko/pages/MonitoringPengirimanPage";

import { InvoicePage } from "../panel/koko/pages/InvoicePage";
import { VerifikasiPembayaranPage } from "../panel/koko/pages/VerifikasiPembayaranPage";
import { SettlementVendorPage } from "../panel/koko/pages/SettlementVendorPage";
import { ClosingHarianPage } from "../panel/koko/pages/ClosingHarianPage";

import { MasterKatalogPage } from "../panel/koko/pages/MasterKatalogPage";
import { UnitWilayahPage } from "../panel/koko/pages/UnitWilayahPage";
import { VendorManagementPage } from "../panel/koko/pages/VendorManagementPage";
import { VendorMappingPage } from "../panel/koko/pages/VendorMappingPage";

import { PenetapanHETPage } from "../panel/koko/pages/PenetapanHETPage";

import { AuditLogPage } from "../panel/koko/pages/AuditLogPage";
import { ProfitMarginPage } from "../panel/koko/pages/ProfitMarginPage";
import { PiutangPage } from "../panel/koko/pages/PiutangPage";
import { HutangVendorPage } from "../panel/koko/pages/HutangVendorPage";

import { NotFoundPage } from "../pages/NotFoundPage";

const ADMIN: Role[] = ["ADMIN"];

export const adminRoutes = (

  <Route
    path="/koko"
    element={
      <RequireRole anyOf={ADMIN}>
        <KokoLayout />
      </RequireRole>
    }
  >

    <Route path="dashboard" element={<DashboardPage />} />

    {/* OPERASIONAL */}

    <Route path="operasional/review-pesanan" element={<ReviewPesananPage />} />
    <Route path="operasional/review-pesanan/:id" element={<ReviewPesananDetailPage />} />

    <Route path="operasional/dispute-center" element={<DisputeCenterPage />} />
    <Route path="operasional/dispute-center/:id" element={<DisputeCenterDetailPage />} />

    <Route path="operasional/logistic-center" element={<LogisticCenterPage />} />
    <Route path="operasional/monitoring-pengiriman" element={<MonitoringPengirimanPage />} />

    {/* KEUANGAN */}

    <Route path="keuangan/invoice" element={<InvoicePage />} />
    <Route path="keuangan/verifikasi" element={<VerifikasiPembayaranPage />} />
    <Route path="keuangan/settlement-vendor" element={<SettlementVendorPage />} />
    <Route path="keuangan/closing" element={<ClosingHarianPage />} />

    {/* MASTER */}

    <Route path="master/katalog" element={<MasterKatalogPage />} />
    <Route path="master/unit-wilayah" element={<UnitWilayahPage />} />
    <Route path="master/vendor" element={<VendorManagementPage />} />
    <Route path="master/mapping" element={<VendorMappingPage />} />

    {/* PRICING */}

    <Route path="pricing/het" element={<PenetapanHETPage />} />

    {/* REPORT */}

    <Route path="reporting/audit-log" element={<AuditLogPage />} />
    <Route path="reporting/profit" element={<ProfitMarginPage />} />
    <Route path="reporting/piutang" element={<PiutangPage />} />
    <Route path="reporting/hutang-vendor" element={<HutangVendorPage />} />

    <Route index element={<Navigate to="/koko/dashboard" replace />} />
    <Route path="*" element={<NotFoundPage />} />

  </Route>

);