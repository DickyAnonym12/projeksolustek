import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/auth'
import type { Role } from './auth/auth'
import { RequireRole } from './auth/RequireRole'
import { KokoLayout } from './panel/koko/KokoLayout'
import { KokoProvider } from './panel/koko/store'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
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

const KOKO: Role[] = ['KOKO']

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
              <Route path="dashboard" element={<DashboardPage />} />

              <Route path="operasional/review-pesanan" element={<ReviewPesananPage />} />
              <Route path="operasional/review-pesanan/:id" element={<ReviewPesananDetailPage />} />
              <Route path="operasional/dispute-center" element={<DisputeCenterPage />} />
              <Route path="operasional/dispute-center/:id" element={<DisputeCenterDetailPage />} />

              <Route path="keuangan/invoice" element={<InvoicePage />} />
              <Route path="keuangan/verifikasi" element={<VerifikasiPembayaranPage />} />
              <Route path="keuangan/settlement-vendor" element={<ComingSoonPage title="Settlement Vendor" />} />
              <Route path="keuangan/closing" element={<ComingSoonPage title="Closing Harian" />} />

              <Route path="master/katalog" element={<MasterKatalogPage />} />
              <Route path="master/unit-wilayah" element={<ComingSoonPage title="Unit MBG & Wilayah" />} />
              <Route path="master/vendor" element={<ComingSoonPage title="Manajemen Vendor" />} />
              <Route path="master/mapping" element={<ComingSoonPage title="Mapping Vendor → Unit" />} />

              <Route path="pricing/het" element={<PenetapanHETPage />} />

              <Route path="reporting/audit-log" element={<AuditLogPage />} />
              <Route path="reporting/profit" element={<ComingSoonPage title="Laporan Profit & Margin" />} />
              <Route path="reporting/piutang" element={<ComingSoonPage title="Laporan Piutang" />} />
              <Route path="reporting/hutang-vendor" element={<ComingSoonPage title="Laporan Hutang Vendor" />} />

              <Route path="operasional/logistic-center" element={<ComingSoonPage title="Logistic Center" />} />
              <Route path="operasional/monitoring-pengiriman" element={<ComingSoonPage title="Monitoring Pengiriman" />} />

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
