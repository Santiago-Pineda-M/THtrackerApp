/**
 * INFRASTRUCTURE LAYER - Router
 * Configuración de rutas de la aplicación con react-router-dom.
 * Añadir nuevas rutas aquí a medida que crecen las features.
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HealthStatus } from "../pages/health/HealthStatus";
import { LoginPage, RegisterPage } from "../pages/auth";
import { DashboardPage } from "../pages/dashboard";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Health Check - ruta de diagnóstico */}
                <Route path="/health" element={<HealthStatus />} />

                {/* Rutas Privadas (Protegidas) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    {/* Otras rutas privadas irán aquí */}
                </Route>

                {/* Redirigir raíz al dashboard por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
