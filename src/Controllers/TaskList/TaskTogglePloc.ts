/**
 * CONTROLLER LAYER - TaskTogglePloc
 * PLOC para alternar el estado de completado de una tarea.
 */

import { Ploc } from '../../Domain/Ploc'
import { type ITaskToggleState, initialTaskToggleState } from '../../Domain'
import type { ToggleTaskUseCase } from '../../Application/UseCases/Task/ToggleTaskUseCase'

export class TaskTogglePloc extends Ploc<ITaskToggleState> {
  private readonly toggleTaskUseCase: ToggleTaskUseCase

  constructor(toggleTaskUseCase: ToggleTaskUseCase) {
    super(initialTaskToggleState)
    this.toggleTaskUseCase = toggleTaskUseCase
  }

  /**
   * Alterna el estado de completado de una tarea.
   */
  async toggle(id: string): Promise<void> {
    this.changeState({
      ...this.state,
      taskId: id,
      isLoading: true,
      success: false,
      error: null,
    })

    try {
      const result = await this.toggleTaskUseCase.execute({ id })

      if (result.success) {
        this.changeState({
          ...this.state,
          isLoading: false,
          success: true,
        })
        return
      }

      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        error: result.error,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      this.changeState({
        ...this.state,
        isLoading: false,
        success: false,
        error: { title: 'Error', detail: message },
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialTaskToggleState)
  }
}
