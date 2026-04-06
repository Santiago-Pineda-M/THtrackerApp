/**
 * INFRASTRUCTURE LAYER - ActivityService
 * Implementación de IActivityService que conecta con el API de actividades.
 */

import type {
    IHttpClient,
    ActivityResponse,
    CreateActivityRequest,
    UpdateActivityRequest,
    ApiErrorResponse,
} from '../../Domain';
import type { IActivityService } from '../../Application/Services/Activity/IActivityService';

export class ActivityService implements IActivityService {
    private readonly httpClient: IHttpClient;
    private readonly baseUrl = '/api/v1/activities';

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    async getActivities(): Promise<ActivityResponse[] | ApiErrorResponse> {
        try {
            const response = await this.httpClient.get<ActivityResponse[] | ApiErrorResponse>(this.baseUrl);
            if (response.status === 200) return response.data as ActivityResponse[];
            return response.data as ApiErrorResponse;
        } catch (error) {
            return this.toNetworkError(error);
        }
    }

    async getActivityById(id: string): Promise<ActivityResponse | ApiErrorResponse> {
        try {
            const response = await this.httpClient.get<ActivityResponse | ApiErrorResponse>(`${this.baseUrl}/${id}`);
            if (response.status === 200) return response.data as ActivityResponse;
            return response.data as ApiErrorResponse;
        } catch (error) {
            return this.toNetworkError(error);
        }
    }

    async createActivity(request: CreateActivityRequest): Promise<ActivityResponse | ApiErrorResponse> {
        try {
            const response = await this.httpClient.post<ActivityResponse | ApiErrorResponse>(this.baseUrl, request);
            if (response.status === 201) return response.data as ActivityResponse;
            return response.data as ApiErrorResponse;
        } catch (error) {
            return this.toNetworkError(error);
        }
    }

    async updateActivity(id: string, request: UpdateActivityRequest): Promise<ActivityResponse | ApiErrorResponse> {
        try {
            const response = await this.httpClient.put<ActivityResponse | ApiErrorResponse>(`${this.baseUrl}/${id}`, request);
            if (response.status === 200) return response.data as ActivityResponse;
            return response.data as ApiErrorResponse;
        } catch (error) {
            return this.toNetworkError(error);
        }
    }

    async deleteActivity(id: string): Promise<void | ApiErrorResponse> {
        try {
            const response = await this.httpClient.delete<void | ApiErrorResponse>(`${this.baseUrl}/${id}`);
            if (response.status === 204) return;
            return response.data as ApiErrorResponse;
        } catch (error) {
            return this.toNetworkError(error);
        }
    }

    private toNetworkError(error: unknown): ApiErrorResponse {
        return {
            title: 'Network Error',
            status: 0,
            detail: error instanceof Error ? error.message : 'Error de conexión',
        };
    }
}
