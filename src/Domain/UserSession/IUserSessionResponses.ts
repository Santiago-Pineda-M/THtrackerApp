/**
 * DOMAIN LAYER - UserSession Response Interfaces
 * Contratos exactos para las respuestas de la API de sesiones.
 */

/**
 * Respuesta de GET /api/v1/sessions.
 * Representa una sesión activa del usuario.
 */
export interface IUserSessionResponse {
    id: string; // UUID
    deviceInfo: string | null;
    ipAddress: string | null;
    location: string | null;
    createdAt: string; // ISO date-time
    expiresAt: string; // ISO date-time
    isActive: boolean;
}

/**
 * Respuesta de POST /api/v1/sessions/{sessionId}/revoke.
 * La API devuelve 204 No Content en caso de éxito.
 */
export interface IRevokeSessionResponse {
    success: boolean;
}
