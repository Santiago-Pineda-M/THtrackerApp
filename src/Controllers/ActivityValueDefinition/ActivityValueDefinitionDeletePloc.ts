/**
 * CONTROLLER LAYER - ActivityValueDefinitionDeletePloc
 * PLOC para la eliminación de definiciones de valores.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IValueDefinitionDeleteState,
  initialValueDefinitionDeleteState,
} from '../../Domain'
import { mapProblemDetailsToErrors } from '../ErrorMapper'
import type {
  DeleteActivityValueDefinitionUseCase,
  ProblemDetails,
} from '../../Application/UseCases/ActivityValueDefinition/DeleteActivityValueDefinitionUseCase'

export class ActivityValueDefinitionDeletePloc extends Ploc<IValueDefinitionDeleteState> {
  private readonly deleteValueDefinitionUseCase: DeleteActivityValueDefinitionUseCase

  constructor(
    deleteValueDefinitionUseCase: DeleteActivityValueDefinitionUseCase
  ) {
    super(initialValueDefinitionDeleteState)
    this.deleteValueDefinitionUseCase = deleteValueDefinitionUseCase
  }

  /**
   * Elimina una definición de valor por su ID.
   */
  async deleteValueDefinition(activityId: string, id: string): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      success: false,
      errors: {},
    })

    try {
      const result = await this.deleteValueDefinitionUseCase.execute({
        activityId,
        definitionId: id,
      })

      if (this.isDeleteDefinitionError(result)) {
        const mappedErrors = mapProblemDetailsToErrors(result)
        this.changeState({
          ...this.state,
          isLoading: false,
          success: false,
          errors: mappedErrors,
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        success: true,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        errors: { general: [message] },
      })
    }
  }

  private isDeleteDefinitionError(
    result: void | ProblemDetails
  ): result is ProblemDetails {
    return typeof result === 'object' && result !== null && 'type' in result
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialValueDefinitionDeleteState)
  }
}
