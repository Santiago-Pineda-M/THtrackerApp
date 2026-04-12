/**
 * DOMAIN LAYER - Value Objects
 * AuthTokens: Value Object que encapsula los tokens de autenticación.
 * Maneja la lógica de expiración de access token y refresh token internamente.
 */

/**
 * Función pura para decodificar un JWT y obtener su payload.
 */
export const decodeJwt = (token: string): Record<string, unknown> => {
  if (!token) return {}
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return {}
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padding = base64.length % 4
    if (padding) base64 += '='.repeat(4 - padding)
    const decoded = atob(base64)
    return JSON.parse(decoded)
  } catch {
    return {}
  }
}

// Función pura para decodificar JWT expiración (exp está en segundos, retorna milisegundos)
export const decodeJwtExp = (token: string): number | null => {
  const payload = decodeJwt(token)
  const exp = payload.exp as number | undefined
  return exp ? exp * 1000 : null
}

/**
 * Convierte una fecha ISO string a segundos hasta la expiración.
 * @param isoDate - Fecha en formato ISO string
 * @returns Segundos hasta la expiración, o 0 si la fecha es inválida
 */
export const isoToExpiresInSeconds = (
  isoDate: string | null | undefined
): number => {
  if (!isoDate) return 0
  try {
    const expiryTime = new Date(isoDate).getTime()
    const now = Date.now()
    const diff = expiryTime - now
    return diff > 0 ? Math.floor(diff / 1000) : 0
  } catch {
    return 0
  }
}

export interface AuthTokensProps {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: number // Unix timestamp en milisegundos
  refreshTokenExpiresAt: number | null // Unix timestamp en milisegundos
}

export class AuthTokens {
  private readonly accessToken: string
  private readonly refreshToken: string
  private readonly accessTokenExpiresAt: number
  private readonly refreshTokenExpiresAt: number | null

  private constructor(props: AuthTokensProps) {
    this.accessToken = props.accessToken
    this.refreshToken = props.refreshToken
    this.accessTokenExpiresAt = props.accessTokenExpiresAt
    this.refreshTokenExpiresAt = props.refreshTokenExpiresAt
  }

  /**
   * Factory method que crea AuthTokens con validación.
   * @throws Error si los tokens son inválidos
   */
  static create(props: AuthTokensProps): AuthTokens {
    if (!props.accessToken || props.accessToken.trim() === '') {
      throw new Error('Access token es requerido')
    }
    if (!props.refreshToken || props.refreshToken.trim() === '') {
      throw new Error('Refresh token es requerido')
    }
    if (
      typeof props.accessTokenExpiresAt !== 'number' ||
      props.accessTokenExpiresAt <= 0
    ) {
      throw new Error('accessTokenExpiresAt debe ser un número positivo')
    }

    return new AuthTokens({
      accessToken: props.accessToken.trim(),
      refreshToken: props.refreshToken.trim(),
      accessTokenExpiresAt: props.accessTokenExpiresAt,
      refreshTokenExpiresAt: props.refreshTokenExpiresAt,
    })
  }

  /**
   * Crea AuthTokens desde tokens nuevos + duración en segundos calculada desde el backend.
   * - accessTokenExpiresAt: se extrae del JWT
   * - refreshTokenExpiresAt: viene del refreshTokenExpiry de la API (convertido a timestamp)
   */
  static createWithExpiry(
    accessToken: string,
    refreshToken: string,
    refreshTokenExpiresInSeconds: number
  ): AuthTokens {
    // Decodifica el JWT para obtener fecha de expiración del access token
    const decodedAccess = decodeJwtExp(accessToken)
    const accessExp = decodedAccess || Date.now() + 7 * 24 * 60 * 60 * 1000 // fallback 7 días

    // El refresh token expiry viene de la API, convertir a timestamp
    const refreshExp =
      refreshTokenExpiresInSeconds > 0
        ? Date.now() + refreshTokenExpiresInSeconds * 1000
        : null

    return AuthTokens.create({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: accessExp,
      refreshTokenExpiresAt: refreshExp,
    })
  }

  /**
   * Crea desde JSON persistido (sin validación extra).
   */
  static fromJSON(data: {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
    refreshTokenExpiresAt?: number | null
  }): AuthTokens {
    return AuthTokens.create({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiresAt: data.accessTokenExpiresAt,
      // Fallback backward compatible o para tokens estaticos pre-update
      refreshTokenExpiresAt:
        data.refreshTokenExpiresAt !== undefined
          ? data.refreshTokenExpiresAt
          : decodeJwtExp(data.refreshToken),
    })
  }

  // Getters
  getAccessToken(): string {
    return this.accessToken
  }

  getRefreshToken(): string {
    return this.refreshToken
  }

  getAccessTokenExpiresAt(): number {
    return this.accessTokenExpiresAt
  }

  getRefreshTokenExpiresAt(): number | null {
    return this.refreshTokenExpiresAt
  }

  /**
   * Verifica si el access token ha expirado.
   */
  isAccessTokenExpired(): boolean {
    return Date.now() >= this.accessTokenExpiresAt
  }

  /**
   * Verifica si el refresh token ha expirado.
   */
  isRefreshTokenExpired(): boolean {
    if (!this.refreshTokenExpiresAt) return false // si no hay meta, asumimos vivo y fallará en HTTP 401
    return Date.now() >= this.refreshTokenExpiresAt
  }

  /**
   * Verifica si los tokens necesitan refresh (el access token expira en menos de 5 minutos).
   */
  accessTokenNeedsRefresh(): boolean {
    const fiveMinutes = 5 * 60 * 1000
    return Date.now() >= this.accessTokenExpiresAt - fiveMinutes
  }

  /**
   * Crea nueva instancia con nuevos tokens (manteniendo estructura inmutable).
   * - accessTokenExpiresAt: se extrae del nuevo JWT
   * - refreshTokenExpiresAt: viene del refreshTokenExpiry de la API
   */
  updateTokens(
    newAccessToken: string,
    newRefreshToken: string,
    refreshTokenExpiresInSeconds: number
  ): AuthTokens {
    return AuthTokens.createWithExpiry(
      newAccessToken,
      newRefreshToken,
      refreshTokenExpiresInSeconds
    )
  }

  /**
   * Serializa a objeto plano para persistencia.
   */
  toJSON(): {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number | null
  } {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      accessTokenExpiresAt: this.accessTokenExpiresAt,
      refreshTokenExpiresAt: this.refreshTokenExpiresAt,
    }
  }
}
