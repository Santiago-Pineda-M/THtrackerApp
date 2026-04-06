/**
 * DOMAIN LAYER - Activity Request Interfaces
 */

/**
 * Request para el endpoint POST /api/v1/activities
 * Solicitud para crear una nueva actividad
 */
export interface CreateActivityRequest {
    categoryId: string;   // UUID
    name: string | null;
    color: string | null;
    allowOverlap: boolean;
}

/**
 * Request para el endpoint PUT /api/v1/activities/{id}
 * Solicitud para actualizar una actividad existente
 */
export interface UpdateActivityRequest {
    name: string | null;
    color: string | null;
    allowOverlap: boolean;
}

/**
 * Request para el endpoint POST /api/v1/activities/{activityId}/definitions
 * Solicitud para crear una definición de valor para una actividad
 */
export interface CreateValueDefinitionRequest {
    name: string | null;
    valueType: string | null;  // p.ej. "Number", "Text", "Boolean", "Duration"
    isRequired: boolean;
    unit: string | null;
    minValue: string | null;
    maxValue: string | null;
}

/**
 * Request para el endpoint PUT /api/v1/activities/{activityId}/definitions/{id}
 * Solicitud para actualizar una definición de valor existente
 */
export interface UpdateValueDefinitionRequest {
    name: string | null;
    valueType: string | null;  // p.ej. "Number", "Text", "Boolean", "Duration"
    isRequired: boolean;
    unit: string | null;
    minValue: string | null;
    maxValue: string | null;
}
