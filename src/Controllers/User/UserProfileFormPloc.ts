/**
 * CONTROLLER LAYER - UserProfileFormPloc
 * PLOC para el formulario de actualización del perfil de usuario.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IUserProfileFormState,
  initialUserProfileFormState,
} from '../../Domain'
import type { UpdateUserProfileUseCase } from '../../Application/UseCases/User'
import type { GetUserProfileUseCase } from '../../Application/UseCases/User'
import type { AuthPloc } from '../Auth/AuthPloc'

export class UserProfileFormPloc extends Ploc<IUserProfileFormState> {
  private readonly updateUserProfileUseCase: UpdateUserProfileUseCase
  private readonly getUserProfileUseCase: GetUserProfileUseCase
  private readonly authPloc: AuthPloc

  constructor(
    updateUserProfileUseCase: UpdateUserProfileUseCase,
    getUserProfileUseCase: GetUserProfileUseCase,
    authPloc: AuthPloc
  ) {
    super(initialUserProfileFormState)
    this.updateUserProfileUseCase = updateUserProfileUseCase
    this.getUserProfileUseCase = getUserProfileUseCase
    this.authPloc = authPloc
  }

  /**
   * Inicializa el formulario con los datos actuales del usuario.
   */
  async initializeForm(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
    })

    try {
      const result = await this.getUserProfileUseCase.execute()

      if (result.success) {
        const user = result.user
        this.changeState({
          ...this.state,
          name: user.name ?? '',
          email: user.email ?? '',
          initialValues: {
            name: user.name ?? '',
            email: user.email ?? '',
          },
          isLoading: false,
          errors: {},
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        errors: result.error
          ? { general: [result.error.detail || 'Error al cargar datos'] }
          : {},
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: { general: [message] },
      })
    }
  }

  /**
   * Actualiza el nombre en el estado.
   */
  updateName(name: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.name
    this.changeState({
      ...this.state,
      name,
      errors: newErrors,
      success: false,
      message: '',
    })
  }

  /**
   * Actualiza el email en el estado.
   */
  updateEmail(email: string): void {
    const newErrors = { ...this.state.errors }
    delete newErrors.email
    this.changeState({
      ...this.state,
      email,
      errors: newErrors,
      success: false,
      message: '',
    })
  }

  /**
   * Envía el formulario de actualización.
   */
  async submit(): Promise<void> {
    const validationErrors = this.validateForm()
    if (Object.keys(validationErrors).length > 0) {
      this.changeState({
        ...this.state,
        errors: validationErrors,
        success: false,
        message: 'Corrige los errores del formulario.',
        isLoading: false,
      })
      return
    }

    // Verificar si hay cambios
    const hasChanges =
      this.state.name !== this.state.initialValues.name ||
      this.state.email !== this.state.initialValues.email

    if (!hasChanges) {
      this.changeState({
        ...this.state,
        success: true,
        message: 'No hay cambios para guardar.',
        isLoading: false,
      })
      return
    }

    this.changeState({
      ...this.state,
      errors: {},
      message: '',
      isLoading: true,
    })

    try {
      const request = {
        name: this.state.name.trim() || null,
        email: this.state.email.trim() || null,
      }

      const result = await this.updateUserProfileUseCase.execute(request)

      if (result.success) {
        // Actualizar la sesión con los nuevos datos
        await this.authPloc.updateUserSession({
          name: result.user.name,
          email: result.user.email,
        })

        this.changeState({
          ...this.state,
          name: result.user.name ?? '',
          email: result.user.email ?? '',
          initialValues: {
            name: result.user.name ?? '',
            email: result.user.email ?? '',
          },
          errors: {},
          success: true,
          message: 'Perfil actualizado correctamente.',
          isLoading: false,
        })
        return
      }

      // Error del servidor
      const errorResult = result.error
      const rawErrors = errorResult.errors ?? {
        general: [errorResult.title || errorResult.detail],
      }
      const errors = this.normalizeErrorKeys(
        rawErrors as Record<string, string[]>
      )

      this.changeState({
        ...this.state,
        errors,
        success: false,
        message: errorResult.title || 'Error al actualizar el perfil.',
        isLoading: false,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        errors: { general: [message] },
        success: false,
        message,
        isLoading: false,
      })
    }
  }

  /**
   * Resetea el estado del formulario.
   */
  reset(): void {
    this.changeState({
      ...initialUserProfileFormState,
      name: this.state.initialValues.name,
      email: this.state.initialValues.email,
      initialValues: this.state.initialValues,
    })
  }

  private validateForm(): Record<string, string[]> {
    const errors: Record<string, string[]> = {}

    if (!this.state.name || this.state.name.trim() === '') {
      errors.name = ['El nombre es requerido']
    }

    if (!this.state.email || this.state.email.trim() === '') {
      errors.email = ['El correo es requerido']
    } else if (!this.isValidEmail(this.state.email.trim())) {
      errors.email = ['El formato del correo no es válido']
    }

    return errors
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  private normalizeErrorKeys(
    errors: Record<string, string[]>
  ): Record<string, string[]> {
    const normalized: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(errors)) {
      normalized[key.toLowerCase()] = value
    }
    return normalized
  }
}
