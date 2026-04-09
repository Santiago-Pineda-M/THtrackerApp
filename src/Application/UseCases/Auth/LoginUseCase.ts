/**
 * APPLICATION LAYER - LoginUseCase
 * Caso de uso para iniciar sesión.
 * Persiste la sesión exclusivamente a través de IAuthSessionRepository.
 */

import type {
  IUseCase,
  IAuthSessionRepository,
  ILoginRequest,
  ILoginResponse,
  ILoginResponseError,
} from '../../../Domain'
import type { IAuthService } from '../../Services/Auth/IAuthService'
import { AuthSession } from '../../../Domain/Entities/AuthSession'
import { AuthTokens } from '../../../Domain/ValueObjects'
import { isoToExpiresInSeconds } from '../../../Domain'

/** JWT claims extraídos del access token. */
interface JwtPayload {
  sub?: string
  email?: string
  name?: string
  exp?: number
}

export type LoginOutput = ILoginResponse | ILoginResponseError

/**
 * Inicia sesión, crea la AuthSession desde JWT claims, y la persiste.
 */
export class LoginUserUseCase implements IUseCase<ILoginRequest, LoginOutput> {
  private readonly authService: IAuthService
  private readonly authSessionRepo: IAuthSessionRepository

  constructor(
    authService: IAuthService,
    authSessionRepo: IAuthSessionRepository
  ) {
    this.authService = authService
    this.authSessionRepo = authSessionRepo
  }

  async execute(input: ILoginRequest): Promise<LoginOutput> {
    const result = await this.authService.login(input)

    if (!this.isSuccess(result)) return result

    const claims = this.decodeJwt(result.accessToken)
    const userId = claims.sub
    const userEmail = claims.email ?? input.email

    if (!userId?.trim()) {
      return {
        title: 'Authentication Error',
        status: 500,
        detail: 'JWT inválido: falta el campo sub',
      }
    }

    const tokens = AuthTokens.createWithExpiry(
      result.accessToken,
      result.refreshToken,
      // La API devuelve refreshTokenExpiry como ISO date — convertimos a segundos
      isoToExpiresInSeconds(result.refreshTokenExpiry)
    )

    const session = AuthSession.create({
      tokens,
      user: { id: userId, email: userEmail, name: claims.name },
    })

    await this.authSessionRepo.saveSession(session)

    return result
  }

  private isSuccess(
    r: ILoginResponse | ILoginResponseError
  ): r is ILoginResponse {
    return 'accessToken' in r && 'refreshToken' in r
  }

  private decodeJwt(token: string): JwtPayload {
    try {
      const [, payload] = token.split('.')
      let b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
      b64 += '='.repeat((4 - (b64.length % 4)) % 4)
      return JSON.parse(atob(b64))
    } catch {
      return {}
    }
  }
}
