/**
 * APPLICATION LAYER - Activity Service Interface
 * Puerto para el servicio de gestión de actividades.
 * Refleja los endpoints de /api/v1/activities
 */

import type {
    ActivityResponse,
    CreateActivityRequest,
    UpdateActivityRequest,
    ApiErrorResponse,
} from '../../../Domain';

/**
 * Contrato del servicio de actividades.
 * Implementado en Infrastructure por ActivityService.
 */
export interface IActivityService {
    /**
     * Obtiene todas las actividades del usuario autenticado.
     * GET /api/v1/activities
     */
    getActivities(): Promise<ActivityResponse[] | ApiErrorResponse>;

    /**
     * Obtiene una actividad específica por su ID.
     * GET /api/v1/activities/{id}
     */
    getActivityById(id: string): Promise<ActivityResponse | ApiErrorResponse>;

    /**
     * Crea una nueva actividad para el usuario autenticado.
     * POST /api/v1/activities
     */
    createActivity(request: CreateActivityRequest): Promise<ActivityResponse | ApiErrorResponse>;

    /**
     * Actualiza una actividad existente.
     * PUT /api/v1/activities/{id}
     */
    updateActivity(id: string, request: UpdateActivityRequest): Promise<ActivityResponse | ApiErrorResponse>;

    /**
     * Elimina una actividad existente.
     * DELETE /api/v1/activities/{id}
     */
    deleteActivity(id: string): Promise<void | ApiErrorResponse>;
}
