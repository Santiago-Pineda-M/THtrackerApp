import type { IHttpClient, HttpResponse } from "../../../Domain/Interfaces/IHttpClient";
import type { IStorage } from "../../../Domain/Interfaces/IStorage";
import type { IAuthToken } from "../../../Domain/Auth/AuthEntities";
import type { TokenResponse } from "../../../Application/Auth/AuthDTOs";

export class FetchHttpClient implements IHttpClient {
    private readonly baseUrl: string;
    private readonly storage: IStorage;
    private static readonly AUTH_STORAGE_KEY = 'auth_session';

    // Gestión de refresco concurrente
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor(baseUrl: string, storage: IStorage) {
        this.baseUrl = baseUrl;
        this.storage = storage;
    }

    private async request<T>(url: string, options: RequestInit): Promise<HttpResponse<T>> {
        // 1. Adjuntar Token automáticamente
        const tokenData = await this.storage.get<IAuthToken>(FetchHttpClient.AUTH_STORAGE_KEY);
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string>),
        };

        if (tokenData?.accessToken) {
            headers["Authorization"] = `Bearer ${tokenData.accessToken}`;
        }

        const response = await fetch(`${this.baseUrl}${url}`, {
            ...options,
            headers,
        });

        // 2. Manejo de 401 (Unauthorized)
        if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
            return this.handleUnauthorized<T>(url, options);
        }

        const data = await response.json().catch(() => ({}));

        return {
            data,
            status: response.status,
        };
    }

    private async handleUnauthorized<T>(url: string, options: RequestInit): Promise<HttpResponse<T>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
                const tokenData = await this.storage.get<IAuthToken>(FetchHttpClient.AUTH_STORAGE_KEY);
                if (!tokenData?.refreshToken) throw new Error("No refresh token");

                // Llamada directa de bajo nivel para evitar loops
                const refreshResponse = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken: tokenData.refreshToken })
                });

                if (refreshResponse.status !== 200) throw new Error("Refresh failed");

                const result: TokenResponse = await refreshResponse.json();
                const newToken: IAuthToken = {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    expiry: new Date(result.refreshTokenExpiry)
                };

                await this.storage.set(FetchHttpClient.AUTH_STORAGE_KEY, newToken);

                this.onTokenRefreshed(newToken.accessToken);
                return this.request<T>(url, options);
            } catch {
                // Si el refresco falla, limpiar sesión y propagar error
                await this.storage.remove(FetchHttpClient.AUTH_STORAGE_KEY);
                return { data: { error: "Session expired" } as unknown as T, status: 401 };
            } finally {
                this.isRefreshing = false;
            }
        }

        // Si ya hay un refresco en curso, encolar esta petición
        return new Promise((resolve) => {
            this.subscribeTokenRefresh((newToken: string) => {
                const newOptions = {
                    ...options,
                    headers: {
                        ...options.headers,
                        "Authorization": `Bearer ${newToken}`
                    }
                };
                resolve(this.request<T>(url, newOptions));
            });
        });
    }

    private subscribeTokenRefresh(cb: (token: string) => void) {
        this.refreshSubscribers.push(cb);
    }

    private onTokenRefreshed(token: string) {
        this.refreshSubscribers.map((cb) => cb(token));
        this.refreshSubscribers = [];
    }

    async get<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>> {
        return this.request<T>(url, { method: "GET", ...config });
    }

    async post<T>(url: string, data?: unknown, config?: RequestInit): Promise<HttpResponse<T>> {
        return this.request<T>(url, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    async put<T>(url: string, data?: unknown, config?: RequestInit): Promise<HttpResponse<T>> {
        return this.request<T>(url, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    async delete<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>> {
        return this.request<T>(url, { method: "DELETE", ...config });
    }
}

