/**
 * APPLICATION LAYER - CheckAuthSessionUseCase
 * Caso de uso para verificar la sesión al arrancar la app.
 * Recupera la sesión persistida y valida su vigencia.
 * Si el accessToken está expirado pero el refreshToken es válido, intenta renovarlo automáticamente.
 */

import type {
  IUseCase,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
} from '../../../Domain'
import type { IAuthSessionRepository } from '../../../Domain'
import type { IAuthService } from '../../Services/Auth/IAuthService'
import { AuthSession, isoToExpiresInSeconds } from '../../../Domain'

/**
 * Output del caso de uso.
 */
export interface CheckAuthSessionOutput {
  isAuthenticated: boolean
  session: AuthSession | null
}

/**
 * Caso de uso para verificar la sesión de autenticación.
 * Si el accessToken está expirado pero el refreshToken es válido, intenta renovarlo automáticamente.
 */
export class CheckAuthSessionUseCase implements IUseCase<
  void,
  CheckAuthSessionOutput
> {
  private readonly authSessionRepo: IAuthSessionRepository
  private readonly authService: IAuthService

  constructor(
    authSessionRepo: IAuthSessionRepository,
    authService: IAuthService
  ) {
    this.authSessionRepo = authSessionRepo
    this.authService = authService
  }

  async execute(): Promise<CheckAuthSessionOutput> {
    const session = await this.authSessionRepo.getSession()

    if (!session) {
      return { isAuthenticated: false, session: null }
    }

    // Si el accessToken está expirado pero el refreshToken es válido, intentar renovar
    if (session.isAccessTokenExpired() && !session.isRefreshTokenExpired()) {
      console.log(
        '[CheckAuthSession] 🔄 AccessToken expirado. Intentando renovar con refreshToken...'
      )

      const refreshedSession = await this.attemptTokenRefresh(session)
      if (refreshedSession) {
        console.log('[CheckAuthSession] ✅ Tokens renovados automáticamente')
        return { isAuthenticated: true, session: refreshedSession }
      }
    }

    // Si el accessToken está expirado y el refreshToken también (o falló el refresh)
    if (session.isAccessTokenExpired()) {
      console.log('[CheckAuthSession] ❌ Tokens expirados. Cerrando sesión...')
      await this.authSessionRepo.clearSession()
      return { isAuthenticated: false, session: null }
    }

    return { isAuthenticated: true, session }
  }

  /**
   * Intenta renovar los tokens usando el refreshToken.
   * @returns Nueva sesión con tokens renovados o null si falla
   */
  private async attemptTokenRefresh(
    currentSession: AuthSession
  ): Promise<AuthSession | null> {
    try {
      const refreshRequest: IRefreshTokenRequest = {
        refreshToken: currentSession.refreshToken,
      }

      const result = await this.authService.refreshToken(refreshRequest)

      // Verificar si la respuesta es exitosa
      if (!this.isRefreshSuccess(result)) {
        console.log('[CheckAuthSession] ❌ Refresh fallido:', result)
        return null
      }

      // Crear nueva sesión con los tokens renovados
      const newSession = currentSession.updateTokens(
        result.accessToken,
        result.refreshToken,
        isoToExpiresInSeconds(result.refreshTokenExpiry)
      )

      // Persistir la nueva sesión
      await this.authSessionRepo.saveSession(newSession)

      return newSession
    } catch (error) {
      console.error('[CheckAuthSession] 🚨 Error al renovar tokens:', error)
      return null
    }
  }

  private isRefreshSuccess(
    r: IRefreshTokenResponse | unknown
  ): r is IRefreshTokenResponse {
    return (
      r !== null &&
      typeof r === 'object' &&
      'accessToken' in r &&
      'refreshToken' in r
    )
  }
}
