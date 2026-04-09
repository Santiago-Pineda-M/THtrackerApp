/**
 * DOMAIN LAYER - Auth Response Interfaces
 * Contratos exactos para las respuestas de la API.
 * Solo refleja los 4 endpoints que realmente existen.
 */

/**
 * Respuesta de /login y /refresh (mismo shape: TokenResponse de la API).
 * ⚠ La API devuelve refreshTokenExpiry como ISO date-time string, NO expiresIn en segundos.
 * ⚠ Los datos del usuario se extraen decodificando el accessToken (JWT claims).
 */
export interface ILoginResponse {
  accessToken: string
  refreshToken: string
  refreshTokenExpiry: string // ISO date-time — e.g. "2026-03-21T22:00:00Z"
}

/**
 * Respuesta de /register.
 * La API devuelve 200 con body vacío en caso de éxito.
 */
export interface IRegisterResponse {
  message?: string
}

/**
 * Respuesta de /refresh — mismo shape que el login.
 */
export interface IRefreshTokenResponse {
  accessToken: string
  refreshToken: string
  refreshTokenExpiry: string // ISO date-time
}
