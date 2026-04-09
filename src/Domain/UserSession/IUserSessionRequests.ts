/**
 * DOMAIN LAYER - UserSession Request Interfaces
 * Contratos exactos para las solicitudes de sesiones de usuario.
 */

/**
 * Request para revocar una sesión específica.
 * El sessionId se pasa como path parameter en la URL.
 */
export interface IRevokeSessionRequest {
  sessionId: string // UUID de la sesión a revocar
}
