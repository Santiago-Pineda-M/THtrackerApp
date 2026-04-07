/**
 * INFRASTRUCTURE LAYER - HTTP Client
 * ─────────────────────────────────────────────────────────────────────────────
 * Implementación de IHttpClient usando la Fetch API.
 *
 * Responsabilidades:
 *  - Adjuntar el access token en cada petición (via callback inyectado).
 *  - Delegar el manejo de 401 al TokenRefreshStrategy inyectado.
 *  - Transporte HTTP puro: GET, POST, PUT, DELETE.
 *
 * SRP: no accede al storage, no persiste tokens, no refresca directamente.
 * El access token se obtiene a través de un callback que lo lee del AuthSessionRepository.
 */

import type { IHttpClient, HttpResponse } from '../../../Domain'
import type { TokenRefreshStrategy } from './TokenRefreshStrategy'

export type GetAccessTokenFn = () => Promise<string | null>

export class FetchHttpClient implements IHttpClient {
  private readonly baseUrl: string
  private readonly getAccessToken: GetAccessTokenFn
  private readonly refreshStrategy: TokenRefreshStrategy

  constructor(
    baseUrl: string,
    getAccessToken: GetAccessTokenFn,
    refreshStrategy: TokenRefreshStrategy
  ) {
    this.baseUrl = baseUrl
    this.getAccessToken = getAccessToken
    this.refreshStrategy = refreshStrategy
  }

  private async request<T>(
    url: string,
    options: RequestInit
  ): Promise<HttpResponse<T>> {
    const accessToken = await this.getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers,
        credentials: 'include',
      })
    } catch (error) {
      console.error(`[FetchHttpClient] Network error on ${url}:`, error)
      throw error
    }

    // Delegar refresco al strategy cuando el servidor responde 401
    const isAuthEndpoint =
      url.includes('/auth/refresh') || url.includes('/auth/login')
    if (response.status === 401 && !isAuthEndpoint) {
      console.warn(
        `[AuthHttpClient] 🔑 401 Detectado en ${url}. Disparando estrategia de refresco...`
      )
      return this.refreshStrategy.attemptRefresh((newToken) =>
        this.executeWithToken<T>(url, options, newToken)
      )
    }

    return this.parseResponse<T>(response)
  }

  /** Ejecuta una petición con un token ya conocido (usado por el retry). */
  private async executeWithToken<T>(
    url: string,
    options: RequestInit,
    token: string
  ): Promise<HttpResponse<T>> {
    const headers = {
      ...(options.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    }
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    })
    return this.parseResponse<T>(response)
  }

  private async parseResponse<T>(response: Response): Promise<HttpResponse<T>> {
    const data = await response.json().catch(() => ({}))
    return { data, status: response.status }
  }

  async get<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>> {
    return this.request<T>(url, { method: 'GET', ...config })
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    })
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    })
  }

  async delete<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>> {
    return this.request<T>(url, { method: 'DELETE', ...config })
  }
}
