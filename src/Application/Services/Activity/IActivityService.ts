/**
 * APPLICATION LAYER - Activity Service Interface
 * Puerto para el servicio de gestión de actividades.
 * Refleja los endpoints de /api/v1/activities
 */

import type { ApiActivitiesTypes } from '../../../Domain'

type ActivityResponse = ApiActivitiesTypes['ActivityResponse']
type ActivityResponsePaginated = ApiActivitiesTypes['ActivityPaginatedResponse']
type CreateActivityRequest = ApiActivitiesTypes['CreateActivityCommand']
type UpdateActivityRequest = ApiActivitiesTypes['UpdateActivityCommand']
type ApiErrorResponse = ApiActivitiesTypes['ProblemDetails']

// parametros de path
type GetActivitiesFilters = ApiActivitiesTypes['GetActivitiesFilters']
type GetActivityIdPath = ApiActivitiesTypes['GetActivityIdPath']
type DeleteActivityPath = ApiActivitiesTypes['DeleteActivityPath']
type UpdateActivityPath = ApiActivitiesTypes['UpdateActivityPath']
/**
 * Contrato del servicio de actividades.
 * Implementado en Infrastructure por ActivityService.
 */
export interface IActivityService {
  /**
   * Obtiene todas las actividades del usuario autenticado.
   * GET /api/v1/activities
   */
  getActivities(
    filters?: GetActivitiesFilters
  ): Promise<ActivityResponsePaginated | ApiErrorResponse>

  /**
   * Obtiene una actividad específica por su ID.
   * GET /api/v1/activities/{id}
   */
  getActivityById(
    id: GetActivityIdPath
  ): Promise<ActivityResponse | ApiErrorResponse>

  /**
   * Crea una nueva actividad para el usuario autenticado.
   * POST /api/v1/activities
   */
  createActivity(
    request: CreateActivityRequest
  ): Promise<ActivityResponse | ApiErrorResponse>

  /**
   * Actualiza una actividad existente.
   * PUT /api/v1/activities/{id}
   */
  updateActivity(
    id: UpdateActivityPath,
    request: UpdateActivityRequest
  ): Promise<ActivityResponse | ApiErrorResponse>

  /**
   * Elimina una actividad existente.
   * DELETE /api/v1/activities/{id}
   */
  deleteActivity(id: DeleteActivityPath): Promise<void | ApiErrorResponse>
}
