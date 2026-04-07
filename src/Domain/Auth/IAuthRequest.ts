/**
 * DOMAIN LAYER - Auth Request Interfaces
 * Contratos exactos para las solicitudes de autenticación.
 * Solo refleja los 4 endpoints que realmente existen en la API.
 */

/**
 * Request para iniciar sesión.
 * deviceInfo es requerido por la API para identificar el dispositivo.
 */
export interface ILoginRequest {
  email: string
  password: string
  deviceInfo: string // Requerido por la API — usar navigator.userAgent
}

/**
 * Request para registrar un nuevo usuario.
 */
export interface IRegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword?: string // Validación local opcional
}

/**
 * Request para refrescar el access token.
 */
export interface IRefreshTokenRequest {
  refreshToken: string
}
