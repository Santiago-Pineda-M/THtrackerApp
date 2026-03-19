/**
 * INFRASTRUCTURE LAYER - Router
 * Configuración de rutas de la aplicación con react-router-dom.
 * 
 * Tipos de rutas:
 * - Rutas públicas (always accessible): /example
 * - Rutas de invitados (solo sin auth): /login, /register
 * - Rutas protegidas (solo con auth): /dashboard
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
    LoginPage,
    RegisterPage,
    DashboardPage,
    ExamplePage
} from "../pages";
import { AuthRoute } from "./AuthRoute";
import { GuestRoute } from "./GuestRoute";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ═══════════════════════════════════════════════════════════
                    RUTAS PÚBLICAS (siempre accesibles)
                    No requieren verificación de autenticación
                ═══════════════════════════════════════════════════════════ */}
                <Route path="/example" element={<ExamplePage />} />

                {/* ═══════════════════════════════════════════════════════════
                    RUTAS DE INVITADOS (solo cuando NO está autenticado)
                    Si ya está autenticado, redirige al dashboard
                ═══════════════════════════════════════════════════════════ */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* ═══════════════════════════════════════════════════════════
                    RUTAS PROTEGIDAS (solo cuando SÍ está autenticado)
                    Si no está autenticado, redirige al login
                ═══════════════════════════════════════════════════════════ */}
                <Route element={<AuthRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    {/* Agregar más rutas protegidas aquí */}
                </Route>

                {/* ═══════════════════════════════════════════════════════════
                    REDIRECCIONES Y FALLBACK
                ═══════════════════════════════════════════════════════════ */}

                {/* Redirigir raíz al dashboard si está autenticado, si no al login */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Fallback para rutas no encontradas */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
