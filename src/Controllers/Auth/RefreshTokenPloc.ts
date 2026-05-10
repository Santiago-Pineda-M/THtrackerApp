import { Ploc } from '../../Domain/Ploc'
import {
  type IRefreshTokenState,
  initialRefreshTokenState,
} from '../../Domain/IStates'
import type {
  RefreshTokenUseCases,
  GetSessionUseCase,
} from '../../Application/UseCases/Auth'

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
        error: { title: 'Error', detail: 'No hay sesión activa' },
      })
      return
    }

    this.changeState({
      ...this.state,
      isRefreshing: true,
      success: false,
      error: null,
    })

    try {
      const result = await this.refreshTokenUseCases.execute({
        refreshToken: session.refreshToken,
      })

      if ('accessToken' in result && 'refreshToken' in result) {
        this.changeState({
          ...this.state,
          isRefreshing: false,
          success: true,
          error: null,
        })
      } else {
        this.changeState({
          ...this.state,
          isRefreshing: false,
          success: false,
          error: result,
        })
      }
    } catch (error) {
      this.changeState({
        ...this.state,
        isRefreshing: false,
        success: false,
        error: {
          title: 'Error',
          detail: 'Error al refresh el token: ' + error,
        },
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialRefreshTokenState)
  }
}
