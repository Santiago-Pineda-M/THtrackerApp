/**
 * DOMAIN LAYER - Interfaces de solicitud (request) a la API para Activity Logs
 */

export interface StartActivityLogRequest {
    activityId: string;
}

export interface UpdateActivityLogRequest {
    startedAt: string; // ISO 8601 string date-time
    endedAt: string | null; // ISO 8601 string date-time
}

export interface LogValueRequest {
    valueDefinitionId: string;
    value: string | null;
}
