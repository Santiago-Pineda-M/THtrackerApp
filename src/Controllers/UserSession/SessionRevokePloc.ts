import { Ploc } from '../../Domain/Ploc'
import {
  type ISessionRevokeState,
  initialSessionRevokeState,
} from '../../Domain'
import type {
  RevokeSessionUseCase,
  ProblemDetails,
} from '../../Application/UseCases/UserSession/RevokeSessionUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class SessionRevokePloc extends Ploc<ISessionRevokeState> {
  private readonly revokeSessionUseCase: RevokeSessionUseCase

  constructor(revokeSessionUseCase: RevokeSessionUseCase) {
    super(initialSessionRevokeState)
    this.revokeSessionUseCase = revokeSessionUseCase
  }

  /**
   * Revoca una sesión específica por su ID.
   */
  async revokeSession(sessionId: string): Promise<void> {
    this.changeState({
      ...this.state,
      isRevoking: true,
      errors: {},
      success: false,
      revokedSessionId: null,
    })

    try {
      const result = await this.revokeSessionUseCase.execute({
        sessionId: sessionId,
      })

      if (this.isSessionRevokeError(result)) {
        const mappedErrors = mapProblemDetailsToErrors(result)
        this.changeState({
          ...this.state,
          isRevoking: false,
          success: false,
          errors: mappedErrors,
          revokedSessionId: null,
        })
        return
      }

      this.changeState({
        ...this.state,
        isRevoking: false,
        success: true,
        revokedSessionId: sessionId,
        errors: {},
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isRevoking: false,
        success: false,
        errors: { general: [message] },
        revokedSessionId: null,
      })
    }
  }

  /**
   * Type guard para verificar si el resultado es un error.
   * La revocación exitosa devuelve void (undefined).
   */
  private isSessionRevokeError(
    result: ProblemDetails | void
  ): result is ProblemDetails {
    return result !== undefined && 'type' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialSessionRevokeState)
  }
}
