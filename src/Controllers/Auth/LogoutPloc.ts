import { Ploc } from '../../Domain/Ploc'
import { type ILogoutState, initialLogoutState } from '../../Domain/IStates'
import type { LogoutUseCase } from '../../Application/UseCases/Auth'
import { AuthPloc } from './AuthPloc'

export class LogoutPloc extends Ploc<ILogoutState> {
  private readonly logoutUseCase: LogoutUseCase
  private readonly authPloc: AuthPloc

  constructor(logoutUseCase: LogoutUseCase, authPloc: AuthPloc) {
    super(initialLogoutState)
    this.logoutUseCase = logoutUseCase
    this.authPloc = authPloc
  }

  async logout(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoggingOut: true,
      success: false,
      error: null,
    })

    try {
      await this.logoutUseCase.execute()
      this.authPloc.onLogout()

      this.changeState({
        ...this.state,
        isLoggingOut: false,
        success: true,
      })
    } catch (error) {
      this.authPloc.onLogout() // Forzamos cierre aunque falle red para no dejar al usuario atrapado
      this.changeState({
        ...this.state,
        isLoggingOut: false,
        success: false,
        error:
          error instanceof Error
            ? { title: error.message, detail: 'Error al cerrar sesión.' }
            : {
                title: 'Error al cerrar sesión',
                detail:
                  'No se pudo cerrar la sesión en el servidor, pero se limpió localmente.',
              },
      })
    }
  }

  reset(): void {
    this.changeState(initialLogoutState)
  }
}
