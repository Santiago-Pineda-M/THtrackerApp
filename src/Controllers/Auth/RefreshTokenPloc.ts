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

  /**
   * Fuerza la renovación del token manualmente.
   *
   * Flujo:
   * 1. Obtiene la sesión actual usando GetSessionUseCase
   * 2. Extrae el refreshToken
   * 3. Usa RefreshTokenUseCases para renovar
   * 4. Actualiza el estado según el resultado
   */
  async forceRefreshToken(): Promise<void> {
    // Obtener sesión actual
    const { session } = await this.getSessionUseCase.execute()

    if (!session) {
      this.changeState({
        ...this.state,
        isRefreshing: false,
        success: false,
        error: 'No hay sesión activa',
      })
      return
    }

    this.changeState({
      ...this.state,
      isRefreshing: true,
      success: false,
      error: undefined,
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
          error: undefined,
        })
      } else {
        this.changeState({
          ...this.state,
          isRefreshing: false,
          success: false,
          error: 'Error al refresh el token',
        })
      }
    } catch (error) {
      this.changeState({
        ...this.state,
        isRefreshing: false,
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al refresh el token',
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
