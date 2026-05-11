import { Ploc } from '../../Domain/Ploc'
import {
  type IActivityValueDefinitionsState,
  initialActivityValueDefinitionsState,
} from '../../Domain'
import type {
  GetListActivityValueDefinitionUseCase,
  GetListActivityValueDefinitionPaginatedResponse,
  ProblemDetails,
} from '../../Application/UseCases/ActivityValueDefinition/GetListActivityValueDefinitionUseCase'
import { mapProblemDetailsToErrors } from '../ErrorMapper'

export class ActivityValueDefinitionListPloc extends Ploc<IActivityValueDefinitionsState> {
  private readonly getValueDefinitionsUseCase: GetListActivityValueDefinitionUseCase

  constructor(
    getValueDefinitionsUseCase: GetListActivityValueDefinitionUseCase
  ) {
    super(initialActivityValueDefinitionsState)
    this.getValueDefinitionsUseCase = getValueDefinitionsUseCase
  }

  /**
   * Establece el ID de la actividad para la cual se cargarán las definiciones.
   */
  setActivityId(activityId: string): void {
    this.changeState({
      ...this.state,
      activityId,
    })
  }

  /**
   * Carga las definiciones de valor de la actividad configurada.
   */
  async loadDefinitions(): Promise<void> {
    if (!this.state.activityId) {
      this.changeState({
        ...this.state,
        isLoading: false,
        errors: { general: ['No se ha especificado el ID de la actividad.'] },
      })
      return
    }

    this.changeState({
      ...this.state,
      isLoading: true,
      errors: {},
    })

    try {
      const result = await this.getValueDefinitionsUseCase.execute({
        filters: {
          pageNumber: 1,
          pageSize: 100,
        },
        path: {
          activityId: this.state.activityId,
        },
      })

      if (this.isValueDefinitionsSuccess(result)) {
        this.changeState({
          ...this.state,
          definitions: result,
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

  private isValueDefinitionsSuccess(
    result: GetListActivityValueDefinitionPaginatedResponse | ProblemDetails
  ): result is GetListActivityValueDefinitionPaginatedResponse {
    return 'items' in result
  }

  reset(): void {
    this.changeState(initialActivityValueDefinitionsState)
  }
}
