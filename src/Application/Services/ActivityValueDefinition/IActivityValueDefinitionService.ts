/**
 * APPLICATION LAYER - ActivityValueDefinition Service Interface
 * Puerto para el servicio de gestión de definiciones de valor de actividades.
 * Refleja los endpoints de /api/v1/activities/{activityId}/definitions
 */

import type {
  ActivityValueDefinitionResponse,
  CreateValueDefinitionRequest,
  UpdateValueDefinitionRequest,
  ApiErrorResponse,
} from '../../../Domain'

/**
 * Contrato del servicio de definiciones de valor de actividades.
 * Implementado en Infrastructure por ActivityValueDefinitionService.
 */
export interface IActivityValueDefinitionService {
  /**
   * Lista las definiciones de valor de una actividad.
   * GET /api/v1/activities/{activityId}/definitions
   */
  getValueDefinitions(
    activityId: string
  ): Promise<ActivityValueDefinitionResponse[] | ApiErrorResponse>

  /**
   * Obtiene una definición de valor por su ID.
   * GET /api/v1/activities/{activityId}/definitions/{definitionId}
   */
  getValueDefinitionById(
    activityId: string,
    definitionId: string
  ): Promise<ActivityValueDefinitionResponse | ApiErrorResponse>

  /**
   * Crea una nueva definición de valor para una actividad.
   * POST /api/v1/activities/{activityId}/definitions
   */
  createValueDefinition(
    activityId: string,
    request: CreateValueDefinitionRequest
  ): Promise<ActivityValueDefinitionResponse | ApiErrorResponse>

  /**
   * Actualiza una definición de valor existente para una actividad.
   * PUT /api/v1/activities/{activityId}/definitions/{id}
   */
  updateValueDefinition(
    activityId: string,
    id: string,
    request: UpdateValueDefinitionRequest
  ): Promise<ActivityValueDefinitionResponse | ApiErrorResponse>

  /**
   * Elimina una definición de valor existente para una actividad.
   * DELETE /api/v1/activities/{activityId}/definitions/{id}
   */
  deleteValueDefinition(
    activityId: string,
    id: string
  ): Promise<void | ApiErrorResponse>
}
