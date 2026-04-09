import { Ploc } from '../../Domain/Ploc'
import { AuthStatus } from '../../Domain'
import type { IAuthState } from '../../Domain'
import { initialAuthState } from '../../Domain'
import type { IAuthSessionRepository } from '../../Domain/Repositories/IAuthSessionRepository'

// Importar tipos de la nueva arquitectura
import type {
  CheckAuthSessionUseCase,
  GetSessionUseCase,
} from '../../Application/UseCases/Auth'

export class AuthPloc extends Ploc<IAuthState> {
  private readonly checkAuthSessionUseCase: CheckAuthSessionUseCase
  private readonly getSessionUseCase: GetSessionUseCase
  private readonly authSessionRepository: IAuthSessionRepository

  constructor(
    checkAuthSessionUseCase: CheckAuthSessionUseCase,
    getSessionUseCase: GetSessionUseCase,
    authSessionRepository: IAuthSessionRepository
  ) {
    super(initialAuthState)
    this.checkAuthSessionUseCase = checkAuthSessionUseCase
    this.getSessionUseCase = getSessionUseCase
    this.authSessionRepository = authSessionRepository
  }

  async init(): Promise<void> {
    this.changeState({ ...this.state, status: AuthStatus.LOADING })

    try {
      // CheckAuthSessionUseCase verifica y valida la sesión
      const { isAuthenticated, session } =
        await this.checkAuthSessionUseCase.execute()

      if (!isAuthenticated || !session) {
        this.changeState({
          ...this.state,
          status: AuthStatus.UNAUTHENTICATED,
          user: null,
        })
        return
      }

      // Sesión válida - usuario autenticado
      this.changeState({
        status: AuthStatus.AUTHENTICATED,
        user: session, // session ya es AuthSession del use case
      })
    } catch {
      this.changeState({
        ...this.state,
        status: AuthStatus.UNAUTHENTICATED,
        user: null,
      })
    }
  }

  async onLoginSuccess(): Promise<void> {
    // GetSessionUseCase simplemente retorna lo que hay guardado
    const { session } = await this.getSessionUseCase.execute()

    if (session) {
      this.changeState({
        status: AuthStatus.AUTHENTICATED,
        user: session, // session ya es AuthSession del use case
      })
    }
  }

  onLogout(): void {
    this.changeState({
      ...initialAuthState,
      status: AuthStatus.UNAUTHENTICATED,
    })
  }

  /**
   * Actualiza los datos del usuario en la sesión actual.
   * Se llama cuando se obtiene o actualiza el perfil del usuario.
   */
  async updateUserSession(updatedUser: {
    name?: string | null
    email?: string | null
  }): Promise<void> {
    if (!this.state.user) return

    try {
      const updatedSession = this.state.user.updateUser({
        name: updatedUser.name ?? undefined,
        email: updatedUser.email ?? this.state.user.email,
      })

      // Persistir la sesión actualizada
      await this.authSessionRepository.saveSession(updatedSession)

      // Actualizar el estado
      this.changeState({
        ...this.state,
        user: updatedSession,
      })
    } catch (error) {
      console.error('[AuthPloc] Error updating user session:', error)
    }
  }
}
