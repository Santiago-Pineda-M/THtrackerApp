/**
 * INFRASTRUCTURE LAYER - Router
 * Configuración de rutas de la aplicación con react-router-dom.
 * Añadir nuevas rutas aquí a medida que crecen las features.
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
    HealthStatus,
    LoginPage,
    RegisterPage,
    DashboardPage,
    ProfilePage,
    ExamplePage
} from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Health Check - ruta de diagnóstico */}
                    <Route path="/health" element={<HealthStatus />} />
                    <Route path="/example" element={<ExamplePage />} />

                    {/* Rutas Privadas (Protegidas) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        {/* Otras rutas privadas irán aquí */}
                    </Route>

                    {/* Redirigir raíz al dashboard por defecto */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
};
