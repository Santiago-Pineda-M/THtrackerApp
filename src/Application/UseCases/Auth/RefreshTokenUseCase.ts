/**
 * APPLICATION LAYER - RefreshTokenUseCase
 * Caso de uso para renovar tokens de autenticación.
 * Usa el refresh token para obtener nuevos access y refresh tokens.
 */

import type {
  IUseCase,
  IAuthSessionRepository,
  ApiAuthTypes,
} from '../../../Domain'
import type { IAuthService } from '../../Services/Auth/IAuthService'
import { isoToExpiresInSeconds } from '../../../Domain'

type SubmitRefreshToken = ApiAuthTypes['SubmitRefreshToken']
type TokenResponse = ApiAuthTypes['TokenResponse']
type ProblemDetails = ApiAuthTypes['ProblemDetails']

export type RefreshTokenOutput = TokenResponse | ProblemDetails

/**
 * Caso de uso para renovar tokens de autenticación.
 * Recibe un refresh token y retorna nuevos tokens actualizados.
 */
export class RefreshTokenUseCases implements IUseCase<
  SubmitRefreshToken,
  RefreshTokenOutput
> {
  private readonly authService: IAuthService
  private readonly authSessionRepo: IAuthSessionRepository

  constructor(
    authService: IAuthService,
    authSessionRepo: IAuthSessionRepository
  ) {
    this.authService = authService
    this.authSessionRepo = authSessionRepo
  }

  async execute(input: SubmitRefreshToken): Promise<RefreshTokenOutput> {
    const result = await this.authService.refreshToken(input)

    if (!this.isSuccess(result)) return result

    // Actualizar la sesión con los nuevos tokens
    const currentSession = await this.authSessionRepo.getSession()
    if (currentSession) {
      const newSession = currentSession.updateTokens(
        result.accessToken!,
        result.refreshToken!,
        isoToExpiresInSeconds(result.refreshTokenExpiry!)
      )
      await this.authSessionRepo.saveSession(newSession)
    }

    return result
  }

  private isSuccess(r: TokenResponse | ProblemDetails): r is TokenResponse {
    return 'accessToken' in r && 'refreshToken' in r
  }
}
