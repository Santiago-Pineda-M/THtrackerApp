/**
 * CONTROLLER LAYER - ActivityValueDefinitionCreateFormPloc
 * PLOC para el formulario de creación de definiciones de valores.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IValueDefinitionCreateFormState,
  initialValueDefinitionCreateFormState,
} from '../../Domain'
import type { CreateActivityValueDefinitionUseCase } from '../../Application/UseCases/ActivityValueDefinition'

export class ActivityValueDefinitionCreateFormPloc extends Ploc<IValueDefinitionCreateFormState> {
  private readonly createValueDefinitionUseCase: CreateActivityValueDefinitionUseCase
  constructor(
    createValueDefinitionUseCase: CreateActivityValueDefinitionUseCase
  ) {
    super(initialValueDefinitionCreateFormState)
    this.createValueDefinitionUseCase = createValueDefinitionUseCase
  }

  /**
   * Inicializa el formulario con un ID de actividad.
   */
  init(activityId: string): void {
    this.changeState({
      ...initialValueDefinitionCreateFormState,
      activityId,
    })
  }

  updateName(name: string): void {
    const errors = { ...this.state.errors }
    delete errors.name
    this.changeState({
      ...this.state,
      name,
      errors,
      success: false,
      message: '',
    })
  }

  updateValueType(valueType: string): void {
    this.changeState({ ...this.state, valueType, success: false, message: '' })
  }

  updateIsRequired(isRequired: boolean): void {
    this.changeState({ ...this.state, isRequired, success: false, message: '' })
  }

  updateUnit(unit: string): void {
    this.changeState({ ...this.state, unit, success: false, message: '' })
  }

  updateMinValue(minValue: string): void {
    this.changeState({ ...this.state, minValue, success: false, message: '' })
  }

  updateMaxValue(maxValue: string): void {
    this.changeState({ ...this.state, maxValue, success: false, message: '' })
  }

  /**
   * Envía el formulario de creación.
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

    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
      message: '',
    })

    try {
      const request = {
        activityId: this.state.activityId,
        name: this.state.name.trim() || null,
        valueType: this.state.valueType || 'Number',
        isRequired: this.state.isRequired,
        unit: this.state.unit.trim() || null,
        minValue: this.state.minValue.trim() || null,
        maxValue: this.state.maxValue.trim() || null,
      }

      const result = await this.createValueDefinitionUseCase.execute(request)

      if (result.success) {
        this.changeState({
          ...this.state,
          success: true,
          message: 'Definición creada correctamente.',
          isLoading: false,
        })
        return
      }

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
        message: errorResult.title || 'Error al crear la definición.',
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
    this.changeState(initialValueDefinitionCreateFormState)
  }

  private validateForm(): Record<string, string[]> {
    const errors: Record<string, string[]> = {}
    if (!this.state.name || this.state.name.trim() === '') {
      errors.name = ['El nombre es requerido']
    }
    return errors
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
