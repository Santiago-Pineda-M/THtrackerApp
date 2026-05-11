import { Ploc } from '../../Domain/Ploc'
import { type IRefreshTokenState, initialRefreshTokenState } from '../../Domain'
import type {
  RefreshTokenUseCases,
  TokenResponse,
  ProblemDetails,
} from '../../Application/UseCases/Auth/RefreshTokenUseCase'
import { GetSessionUseCase } from '../../Application/UseCases/Auth/GetSessionUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

/**
 * CONTROLLER LAYER - RefreshTokenPloc
 * Maneja la renovación de tokens de autenticación.
 *
 * SOLO recibe Use Cases - no repositorios ni servicios.
 */
export class RefreshTokenPloc extends Ploc<IRefreshTokenState> {
  private readonly refreshTokenUseCases: RefreshTokenUseCases
  private readonly getSessionUseCase: GetSessionUseCase

  constructor(
    refreshTokenUseCases: RefreshTokenUseCases,
    getSessionUseCase: GetSessionUseCase
  ) {
    super(initialRefreshTokenState)
    this.refreshTokenUseCases = refreshTokenUseCases
    this.getSessionUseCase = getSessionUseCase
  }

  async forceRefreshToken(): Promise<void> {
    const { session } = await this.getSessionUseCase.execute()

    if (!session) {
      this.changeState({
        ...this.state,
        isRefreshing: false,
        success: false,
        errors: { general: ['No hay sesión activa'] },
      })
      return
    }

    this.changeState({
      ...this.state,
      isRefreshing: true,
      success: false,
      errors: {},
    })

    try {
      const result = await this.refreshTokenUseCases.execute({
        refreshToken: session.refreshToken,
      })

      if (this.isRefreshTokenSuccess(result)) {
        this.changeState({
          ...this.state,
          isRefreshing: false,
          success: true,
          errors: {},
        })
      } else {
        const errorResult = result as ProblemDetails
        const mappedErrors = mapProblemDetailsToErrors(errorResult)
        this.changeState({
          ...this.state,
          isRefreshing: false,
          success: false,
          errors: mappedErrors,
        })
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al renovar el token'
      this.changeState({
        ...this.state,
        isRefreshing: false,
        success: false,
        errors: { general: [message] },
      })
    }
  }

  private isRefreshTokenSuccess(
    result: TokenResponse | ProblemDetails
  ): result is TokenResponse {
    return 'accessToken' in result && 'refreshToken' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialRefreshTokenState)
  }
}
