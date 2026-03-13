import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./auth/auth";
import { KokoProvider } from "./panel/koko/store";

import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import { adminRoutes } from "./routes/adminRoutes";
import { vendorRoutes } from "./routes/vendorRoutes";

export default function App() {

  return (

    <AuthProvider>

      <KokoProvider>

        <BrowserRouter>

          <Routes>

            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<Navigate to="/koko/dashboard" replace />} />

            {adminRoutes}

            {vendorRoutes}

            <Route path="*" element={<NotFoundPage />} />

          </Routes>

        </BrowserRouter>

      </KokoProvider>

    </AuthProvider>

  );

}