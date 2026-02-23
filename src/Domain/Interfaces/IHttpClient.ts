/**
 * DOMAIN LAYER - Interfaces
 * Contrato base para el cliente HTTP. Los adaptadores (FetchHttpClient, etc.)
 * implementan esta interfaz para desacoplar el dominio de librerías externas.
 */
export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
}

export interface IHttpClient {
    get<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>>;
    post<T>(url: string, data?: unknown, config?: RequestInit): Promise<HttpResponse<T>>;
    put<T>(url: string, data?: unknown, config?: RequestInit): Promise<HttpResponse<T>>;
    delete<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>>;
}
