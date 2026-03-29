/**
 * APPLICATION LAYER - Activity Service Interface
 * Puerto para el servicio de gestión de actividades.
 * Refleja los endpoints de /api/v1/activities
 */

import type {
    ActivityResponse,
    ActivityValueDefinitionResponse,
    CreateActivityRequest,
    UpdateActivityRequest,
    CreateValueDefinitionRequest,
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

    // ── Value Definitions ──────────────────────────────────────────

    /**
     * Lista las definiciones de valor de una actividad.
     * GET /api/v1/activities/{activityId}/definitions
     */
    getValueDefinitions(activityId: string): Promise<ActivityValueDefinitionResponse[] | ApiErrorResponse>;

    /**
     * Obtiene una definición de valor por su ID.
     * GET /api/v1/activities/{activityId}/definitions/{definitionId}
     */
    getValueDefinitionById(activityId: string, definitionId: string): Promise<ActivityValueDefinitionResponse | ApiErrorResponse>;

    /**
     * Crea una nueva definición de valor para una actividad.
     * POST /api/v1/activities/{activityId}/definitions
     */
    createValueDefinition(activityId: string, request: CreateValueDefinitionRequest): Promise<ActivityValueDefinitionResponse | ApiErrorResponse>;
}
