/**
 * CONTROLLER LAYER - CategoriesListPloc
 * PLOC para mostrar la lista de categorías del usuario autenticado.
 */

import { Ploc } from '../../Domain/Ploc'
import {
  type ICategoriesListState,
  initialCategoriesListState,
} from '../../Domain'
import type { GetCategoriesUseCase } from '../../Application/UseCases/Category'

export class CategoriesListPloc extends Ploc<ICategoriesListState> {
  private readonly getCategoriesUseCase: GetCategoriesUseCase

  constructor(getCategoriesUseCase: GetCategoriesUseCase) {
    super(initialCategoriesListState)
    this.getCategoriesUseCase = getCategoriesUseCase
  }

  /**
   * Carga todas las categorías del usuario autenticado.
   */
  async loadCategories(): Promise<void> {
    this.changeState({
      ...this.state,
      isLoading: true,
      error: null,
    })

    try {
      const result = await this.getCategoriesUseCase.execute()

      if (result.success) {
        this.changeState({
          ...this.state,
          categories: result.categories,
          isLoading: false,
          error: null,
        })
        return
      }

      this.changeState({
        ...this.state,
        categories: [],
        isLoading: false,
        error: result.error,
      })
    } catch (err: unknown) {
      const error =
        err instanceof Error
          ? { title: 'Error', detail: err.message }
          : {
              title: 'Error',
              detail: 'Error desconocido al cargar las categorías',
            }

      this.changeState({
        ...this.state,
        categories: [],
        isLoading: false,
        error,
      })
    }
  }

  /**
   * Resetea el estado.
   */
  reset(): void {
    this.changeState(initialCategoriesListState)
  }
}
