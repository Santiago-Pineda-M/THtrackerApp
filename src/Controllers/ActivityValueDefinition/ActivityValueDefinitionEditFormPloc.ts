/**
 * CONTROLLER LAYER - ActivityValueDefinitionEditFormPloc
 * PLOC para el formulario de edición de definiciones de valores.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IValueDefinitionEditFormState,
  initialValueDefinitionEditFormState,
} from '../../Domain'
import type {
  GetByIdActivityValueDefinitionUseCase,
  ProblemDetails,
} from '../../Application/UseCases/ActivityValueDefinition/GetByIdActivityValueDefinitionUseCase'
import type {
  UpdateActivityValueDefinitionUseCase,
  UpdateValueDefinitionRequest,
} from '../../Application/UseCases/ActivityValueDefinition/UpdateActivityValueDefinitionUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class ActivityValueDefinitionEditFormPloc extends Ploc<IValueDefinitionEditFormState> {
  private readonly getValueDefinitionByIdUseCase: GetByIdActivityValueDefinitionUseCase
  private readonly updateValueDefinitionUseCase: UpdateActivityValueDefinitionUseCase

  constructor(
    getValueDefinitionByIdUseCase: GetByIdActivityValueDefinitionUseCase,
    updateValueDefinitionUseCase: UpdateActivityValueDefinitionUseCase
  ) {
    super(initialValueDefinitionEditFormState)
    this.getValueDefinitionByIdUseCase = getValueDefinitionByIdUseCase
    this.updateValueDefinitionUseCase = updateValueDefinitionUseCase
  }

  /**
   * Carga la definición para editar.
   */
  async loadDefinition(activityId: string, id: string): Promise<void> {
    this.changeState({
      ...this.state,
      activityId,
      id,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getValueDefinitionByIdUseCase.execute({
        activityId,
        definitionId: id,
      })

      if (this.isEditDefinitionSuccess(result)) {
        this.changeState({
          ...this.state,
          name: result.name ?? '',
          valueType: result.valueType ?? 'Number',
          isRequired: result.isRequired ?? false,
          unit: result.unit ?? '',
          minValue: result.minValue ?? '',
          maxValue: result.maxValue ?? '',
          isLoading: false,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: mappedErrors,
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
   * Envía el formulario de edición.
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
        definitionId: this.state.id,
        name: this.state.name?.trim() || null,
        valueType: this.state.valueType || 'Number',
        isRequired: this.state.isRequired,
        unit: this.state.unit?.trim() || null,
        minValue: this.state.minValue?.trim() || null,
        maxValue: this.state.maxValue?.trim() || null,
      }

      const result = await this.updateValueDefinitionUseCase.execute(request)

      if (this.isEditDefinitionSuccess(result)) {
        this.changeState({
          ...this.state,
          success: true,
          message: 'Definición actualizada correctamente.',
          isLoading: false,
        })
        return
      }

      const mappedErrors = mapProblemDetailsToErrors(result)
      this.changeState({
        ...this.state,
        errors: mappedErrors,
        success: false,
        message:
          (result as ProblemDetails).title ||
          'Error al actualizar la definición.',
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

  private isEditDefinitionSuccess(
    result: UpdateValueDefinitionRequest | ProblemDetails
  ): result is UpdateValueDefinitionRequest {
    return 'definitionId' in result && 'name' in result
  }

  /**
   * Resetea el estado del formulario.
   */
  reset(): void {
    this.changeState(initialValueDefinitionEditFormState)
  }

  private validateForm(): Record<string, string[]> {
    const errors: Record<string, string[]> = {}
    if (!this.state.name || this.state.name.trim() === '') {
      errors.name = ['El nombre es requerido']
    }
    return errors
  }
}
