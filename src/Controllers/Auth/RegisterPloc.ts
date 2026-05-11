import { Ploc } from '../../Domain/Ploc'
import { type IRegisterState, initialRegisterState } from '../../Domain/IStates'
import {
  type RegisterCommand,
  type UserResponse,
  type ProblemDetails,
  type RegisterUseCases,
} from '../../Application/UseCases/Auth/RegisterUsesCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class RegisterPloc extends Ploc<IRegisterState> {
  private readonly registerUseCases: RegisterUseCases

  constructor(registerUseCases: RegisterUseCases) {
    super(initialRegisterState)
    this.registerUseCases = registerUseCases
  }

  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    const validationErrors = this.validateForm(
      name,
      email,
      password,
      confirmPassword
    )
    if (Object.keys(validationErrors).length > 0) {
      this.changeState({
        ...this.state,
        name,
        email,
        password,
        confirmPassword,
        errors: validationErrors,
        success: false,
        message: 'Corrige los errores del formulario.',
        isLoading: false,
      })
      return
    }

    this.changeState({
      ...this.state,
      name,
      email,
      password,
      confirmPassword,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      const request: RegisterCommand = {
        name: name.trim(),
        email: email.trim(),
        password,
      }
      const result = await this.registerUseCases.execute(request)

      if (this.isRegisterSuccess(result)) {
        // Registro exitoso
        this.changeState({
          ...this.state,
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          errors: {},
          success: true,
          message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
          isLoading: false,
        })
        return
      }

      const errorResult = result as ProblemDetails
      const mappedErrors = mapProblemDetailsToErrors(errorResult)
      this.changeState({
        ...this.state,
        name,
        email,
        password,
        confirmPassword,
        errors: mappedErrors,
        success: false,
        message: errorResult.title || 'Error al crear la cuenta.',
        isLoading: false,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al crear la cuenta.'
      this.changeState({
        ...this.state,
        name,
        email,
        password,
        confirmPassword,
        errors: { general: [message] },
        success: false,
        message,
        isLoading: false,
      })
    }
  }

  private isRegisterSuccess(
    result: UserResponse | ProblemDetails
  ): result is UserResponse {
    return 'id' in result && 'email' in result
  }

  updateName(name: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.name
    this.changeState({ ...this.state, name, errors: newErrors })
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

  updateConfirmPassword(confirmPassword: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.confirmPassword
    this.changeState({ ...this.state, confirmPassword, errors: newErrors })
  }

  reset(): void {
    this.changeState(initialRegisterState)
  }

  private validateForm(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    if (!name || name.trim() === '') {
      errors.name = ['El nombre es requerido']
    } else if (name.trim().length < 2) {
      errors.name = ['El nombre debe tener al menos 2 caracteres']
    }

    if (!email || email.trim() === '') {
      errors.email = ['El correo es requerido']
    } else if (!this.isValidEmail(email.trim())) {
      errors.email = ['El formato del correo no es válido']
    }

    if (!password || password === '') {
      errors.password = ['La contraseña es requerida']
    } else if (password.length < 8) {
      errors.password = ['La contraseña debe tener al menos 8 caracteres']
    } else if (!this.hasValidPassword(password)) {
      errors.password = [
        'La contraseña debe contener al menos una mayúscula y un número',
      ]
    }

    if (!confirmPassword || confirmPassword === '') {
      errors.confirmPassword = ['La confirmación de contraseña es requerida']
    } else if (password !== confirmPassword) {
      errors.confirmPassword = ['Las contraseñas no coinciden']
    }

    return errors
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  private hasValidPassword(password: string): boolean {
    return /[A-Z]/.test(password) && /[0-9]/.test(password)
  }
}
