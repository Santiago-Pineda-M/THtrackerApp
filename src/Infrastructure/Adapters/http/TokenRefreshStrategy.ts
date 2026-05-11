/**
 * INFRASTRUCTURE LAYER - Token Refresh Strategy
 * ─────────────────────────────────────────────────────────────────────────────
 * Encapsula la lógica de refresco de tokens JWT ante respuestas 401.
 *
 * Responsabilidades:
 *  - Cola de peticiones pendientes mientras se refresca (evita race conditions).
 *  - Llamada directa de bajo nivel a /auth/refresh para evitar ciclos.
 *  - Persiste los nuevos tokens SOLO a través del callback onSessionRefreshed,
 *    que lo delega al AuthSessionRepository (nunca accede al storage directamente).
 *
 * SRP: solo sabe refrescar tokens. No conoce el storage, no conoce React.
 */

import type { ApiAuthTypes } from '../../../Domain'

export type GetRefreshTokenFn = () => Promise<string | null>
export type OnSessionRefreshedFn = (
  newAccessToken: string,
  response: ApiAuthTypes['TokenResponse']
) => Promise<void>

export class TokenRefreshStrategy {
  private readonly baseUrl: string
  private readonly getRefreshToken: GetRefreshTokenFn
  private readonly onSessionRefreshed: OnSessionRefreshedFn

  private isRefreshing = false
  private subscribers: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
  }> = []

  constructor(
    baseUrl: string,
    getRefreshToken: GetRefreshTokenFn,
    onSessionRefreshed: OnSessionRefreshedFn
  ) {
    this.baseUrl = baseUrl
    this.getRefreshToken = getRefreshToken
    this.onSessionRefreshed = onSessionRefreshed
  }

  /**
   * Intenta refrescar el access token y reintenta la petición original.
   * Si ya hay un refresh en curso, encola el reintento y espera.
   *
   * @param retryRequest Función que vuelve a ejecutar la petición con el nuevo token.
   */
  async attemptRefresh<T>(
    retryRequest: (newAccessToken: string) => Promise<T>
  ): Promise<T> {
    if (this.isRefreshing) {
      console.log('[AuthRefresh] ⏳ Refresh en curso. Encolando petición...')
      return new Promise<T>((resolve, reject) => {
        this.subscribers.push({
          resolve: (token) => {
            console.log('[AuthRefresh] ✅ Petición encolada liberada con éxito')
            resolve(retryRequest(token))
          },
          reject: (err) => {
            console.log(
              '[AuthRefresh] ❌ Petición encolada fallida por error en refresh'
            )
            reject(err)
          },
        })
      })
    }

    console.log('[AuthRefresh] 🔄 Iniciando proceso de refresco de tokens...')
    this.isRefreshing = true

    try {
      const refreshToken = await this.getRefreshToken()
      if (!refreshToken) throw new Error('No hay refresh token disponible')

      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      })

      console.log(`[AuthRefresh] 🌐 API Response Status: ${response.status}`)

      if (response.status !== 200) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Refresh fallido (${response.status}): ${errorData.detail || 'Error desconocido'}`
        )
      }

      const result: ApiAuthTypes['TokenResponse'] = await response.json()
      if (!result.accessToken || !result.refreshToken)
        throw new Error('Respuesta de refresh incompleta')

      // Delegar la persistencia al repositorio a través del callback
      await this.onSessionRefreshed(result.accessToken, result)
      console.log(
        '[AuthRefresh] 💾 Nuevos tokens persistidos en el repositorio'
      )

      // Notificar éxito a todas las peticiones encoladas
      console.log(
        `[AuthRefresh] 📢 Notificando a ${this.subscribers.length} suscriptores...`
      )
      this.notifySubscribers(result.accessToken)

      return retryRequest(result.accessToken)
    } catch (error) {
      console.error(
        '[AuthRefresh] 🚨 Error fatal en el proceso de refresco:',
        error
      )
      // Notificar error a todas las peticiones encoladas para que no se queden colgadas
      this.notifyErrorToSubscribers(error)
      throw error
    } finally {
      this.isRefreshing = false
    }
  }

  private notifySubscribers(newToken: string): void {
    this.subscribers.forEach((s) => s.resolve(newToken))
    this.subscribers = []
  }

  private notifyErrorToSubscribers(error: unknown): void {
    this.subscribers.forEach((s) => s.reject(error))
    this.subscribers = []
  }
}
