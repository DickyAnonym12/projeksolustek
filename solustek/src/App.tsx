import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/auth'
import type { Role } from '../src/panel/koko/types'
import { RequireRole } from './auth/RequireRole'

import { KokoLayout } from './panel/koko/KokoLayout'
import { KokoProvider } from './panel/koko/store'

import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'

import { DashboardPage } from './panel/koko/pages/DashboardPage'
import { ReviewPesananPage } from './panel/koko/pages/ReviewPesananPage'
import { ReviewPesananDetailPage } from './panel/koko/pages/ReviewPesananDetailPage'
import { DisputeCenterPage } from './panel/koko/pages/DisputeCenterPage'
import { DisputeCenterDetailPage } from './panel/koko/pages/DisputeCenterDetailPage'

import { InvoicePage } from './panel/koko/pages/InvoicePage'
import { VerifikasiPembayaranPage } from './panel/koko/pages/VerifikasiPembayaranPage'

import { MasterKatalogPage } from './panel/koko/pages/MasterKatalogPage'
import { PenetapanHETPage } from './panel/koko/pages/PenetapanHETPage'
import { AuditLogPage } from './panel/koko/pages/AuditLogPage'

import { LogisticCenterPage } from './panel/koko/pages/LogisticCenterPage'
import { MonitoringPengirimanPage } from './panel/koko/pages/MonitoringPengirimanPage'

/* ===== HALAMAN BARU ===== */

import { SettlementVendorPage } from './panel/koko/pages/SettlementVendorPage'
import { ClosingHarianPage } from './panel/koko/pages/ClosingHarianPage'
import { UnitWilayahPage } from './panel/koko/pages/UnitWilayahPage'
import { VendorManagementPage } from './panel/koko/pages/VendorManagementPage'
import { VendorMappingPage } from './panel/koko/pages/VendorMappingPage'
import { ProfitMarginPage } from './panel/koko/pages/ProfitMarginPage'
import { PiutangPage } from './panel/koko/pages/PiutangPage'
import { HutangVendorPage } from './panel/koko/pages/HutangVendorPage'

const KOKO: Role[] = ['ADMIN']

export default function App() {
  return (
    <AuthProvider>
      <KokoProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<Navigate to="/koko/dashboard" replace />} />

            <Route
              path="/koko"
              element={
                <RequireRole anyOf={KOKO}>
                  <KokoLayout />
                </RequireRole>
              }
            >

              {/* DASHBOARD */}

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

              {/* MASTER DATA */}

              <Route path="master/katalog" element={<MasterKatalogPage />} />
              <Route path="master/unit-wilayah" element={<UnitWilayahPage />} />
              <Route path="master/vendor" element={<VendorManagementPage />} />
              <Route path="master/mapping" element={<VendorMappingPage />} />

              {/* PRICING */}

              <Route path="pricing/het" element={<PenetapanHETPage />} />

              {/* REPORTING */}

              <Route path="reporting/audit-log" element={<AuditLogPage />} />
              <Route path="reporting/profit" element={<ProfitMarginPage />} />
              <Route path="reporting/piutang" element={<PiutangPage />} />
              <Route path="reporting/hutang-vendor" element={<HutangVendorPage />} />

              {/* DEFAULT */}

              <Route index element={<Navigate to="/koko/dashboard" replace />} />
              <Route path="*" element={<NotFoundPage />} />

            </Route>

            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </BrowserRouter>
      </KokoProvider>
    </AuthProvider>
  )
}