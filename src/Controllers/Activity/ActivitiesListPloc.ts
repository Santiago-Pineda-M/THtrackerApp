/**
 * CONTROLLER LAYER - ActivitiesListPloc
 * PLOC para mostrar la lista de actividades del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type IActivitiesListState,
  initialActivitiesListState,
} from '../../Domain'
import type { GetActivitiesUseCase } from '../../Application/UseCases/Activity'

export class ActivitiesListPloc extends Ploc<IActivitiesListState> {
  private readonly getActivitiesUseCase: GetActivitiesUseCase

  constructor(getActivitiesUseCase: GetActivitiesUseCase) {
    super(initialActivitiesListState)
    this.getActivitiesUseCase = getActivitiesUseCase
  }

  /**
   * Carga todas las actividades del usuario autenticado.
   */
  async loadActivities(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      error: null,
    })

    try {
      const result = await this.getActivitiesUseCase.execute()

      if (result.success) {
        this.changeState({
          ...this.state,
          activities: result.activities,
          isLoading: false,
          error: null,
        })
        return
      }

      this.changeState({
        ...this.state,
        activities: [],
        isLoading: false,
        error: result.error,
      })
    } catch (err: unknown) {
      const error =
        err instanceof Error
          ? { title: 'Error', detail: err.message }
          : {
              title: 'Error',
              detail: 'Error desconocido al cargar las actividades',
            }

      this.changeState({
        ...this.state,
        activities: [],
        isLoading: false,
        error,
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialActivitiesListState)
  }
}
