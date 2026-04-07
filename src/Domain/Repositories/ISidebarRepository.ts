/**
 * DOMAIN LAYER - ISidebarRepository
 * Interfaz del repositorio para persistir el estado del Sidebar.
 */

import { SidebarState } from '../Entities/SidebarState'

export interface ISidebarRepository {
  /**
   * Obtiene el estado del Sidebar persistido.
   * @returns El estado guardado o el estado por defecto si no existe.
   */
  getState(): SidebarState

  /**
   * Persiste el estado del Sidebar.
   * @param state El estado a guardar.
   */
  saveState(state: SidebarState): void
}
