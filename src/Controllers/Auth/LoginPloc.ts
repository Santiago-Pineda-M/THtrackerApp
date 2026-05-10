import { Ploc } from '../../Domain/Ploc'
import { type ILoginState, initialLoginState } from '../../Domain/IStates'
import type { ApiAuthTypes } from '../../Domain'
import type { LoginUserUseCase } from '../../Application/UseCases/Auth'
import { AuthPloc } from './AuthPloc'

type LoginRequest = ApiAuthTypes['LoginCommand']
type LoginResponse = ApiAuthTypes['TokenResponse']
type LoginResponseError = ApiAuthTypes['ProblemDetails']

export class LoginPloc extends Ploc<ILoginState> {
  private readonly loginUserUseCase: LoginUserUseCase
  private readonly authPloc: AuthPloc

  constructor(loginUserUseCase: LoginUserUseCase, authPloc: AuthPloc) {
    super(initialLoginState)
    this.loginUserUseCase = loginUserUseCase
    this.authPloc = authPloc
  }

  async login(): Promise<void> {
    const validationErrors = this.validateForm(
      this.state.email,
      this.state.password,
      this.state.deviceInfo
    )
    if (Object.keys(validationErrors).length > 0) {
      this.changeState({
        ...this.state,
        email: this.state.email,
        password: this.state.password,
        errors: validationErrors,
        success: false,
        message: 'Corrige los errores del formulario.',
        isLoading: false,
      })
      return
    }

    this.changeState({
      ...this.state,
      email: this.state.email,
      password: this.state.password,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      const request: LoginRequest = {
        email: this.state.email.trim(),
        password: this.state.password,
        deviceInfo: this.state.deviceInfo,
      }
      const result = await this.loginUserUseCase.execute(request)

      if (this.isLoginSuccess(result)) {
        await this.authPloc.onLoginSuccess()

        this.changeState({
          ...this.state,
          email: this.state.email,
          password: this.state.password,
          errors: {},
          success: true,
          message: 'Sesión iniciada correctamente.',
          isLoading: false,
        })
        return
      }

      const errorResult = result as LoginResponseError
      console.log('[LoginPloc] Login failed, errorResult:', errorResult)
      this.changeState({
        ...this.state,
        email: this.state.email,
        password: this.state.password,
        errors: errorResult,
        success: false,
        message: errorResult.title!,
        isLoading: false,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesión.'
      this.changeState({
        ...this.state,
        email: this.state.email,
        password: this.state.password,
        errors: { general: [message] },
        success: false,
        message,
        isLoading: false,
      })
    }
  }

  updateEmail(email: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.email
    this.changeState({ ...this.state, email, errors: newErrors })
  }

  updatePassword(password: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.password
    delete newErrors.general
    this.changeState({ ...this.state, password, errors: newErrors })
  }

  updateDeviceInfo(deviceInfo: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.deviceInfo
    delete newErrors.general
    this.changeState({ ...this.state, deviceInfo, errors: newErrors })
  }

  /**
   * Resetea el estado del formulario de login.
   * Se llama cuando el componente se monta para limpiar el estado anterior.
   */
  reset(): void {
    this.changeState(initialLoginState)
  }

  private isLoginSuccess(
    result: LoginResponse | LoginResponseError
  ): result is LoginResponse {
    return (
      typeof (result as LoginResponse).accessToken === 'string' &&
      typeof (result as LoginResponse).refreshToken === 'string'
    )
  }

  private validateForm(
    email: string,
    password: string,
    deviceInfo: string
  ): Record<string, string[]> {
    const errors: Record<string, string[]> = {}
    if (!email || email.trim() === '') {
      errors.email = ['El correo es requerido']
    } else if (!this.isValidEmail(email.trim())) {
      errors.email = ['El formato del correo no es válido']
    }
    if (!password || password === '') {
      errors.password = ['La contraseña es requerida']
    }
    if (!deviceInfo || deviceInfo.trim() === '') {
      errors.deviceInfo = ['El dispositivo es requerido']
    }
    return errors
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
}
