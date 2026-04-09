/**
 * INFRASTRUCTURE LAYER - HTTP Client
 * ─────────────────────────────────────────────────────────────────────────────
 * Implementación de IHttpClient usando la Fetch API.
 *
 * Responsabilidades:
 *  - Adjuntar el access token en cada petición (via callback inyectado).
 *  - Delegar el manejo de 401 al TokenRefreshStrategy inyectado.
 *  - Transporte HTTP puro: GET, POST, PUT, DELETE.
 *  - [ESTRATEGIA 3] Retry con backoff exponencial ante errores de red.
 *  - [ESTRATEGIA 1+2] Cache + Deduplication en GET (inyectados, TTL por config).
 *
 * SRP:
 *  - No accede al storage, no persiste tokens, no refresca directamente.
 *  - No conoce qué endpoints existen ni cuánto cachear cada uno.
 *    Esa decisión la toma cada Service al llamar get() con su propio cacheTtl.
 *
 * OCP:
 *  - Agregar un nuevo endpoint cacheado no requiere modificar esta clase.
 *    Solo el Service correspondiente define su cacheTtl.
 *
 * DIP:
 *  - RequestCache e InflightDeduplicator se inyectan desde DependenciesLocator,
 *    no se instancian aquí. Esto permite testearlos de forma independiente.
 */

import type {
  IHttpClient,
  HttpResponse,
  HttpRequestConfig,
} from '../../../Domain'
import type { TokenRefreshStrategy } from './TokenRefreshStrategy'
import type { RequestCache } from './RequestCache'
import type { InflightDeduplicator } from './InflightDeduplicator'

export type GetAccessTokenFn = () => Promise<string | null>

export class FetchHttpClient implements IHttpClient {
  private readonly baseUrl: string
  private readonly getAccessToken: GetAccessTokenFn
  private readonly refreshStrategy: TokenRefreshStrategy
  private readonly cache: RequestCache
  private readonly deduplicator: InflightDeduplicator

  constructor(
    baseUrl: string,
    getAccessToken: GetAccessTokenFn,
    refreshStrategy: TokenRefreshStrategy,
    cache: RequestCache,
    deduplicator: InflightDeduplicator
  ) {
    this.baseUrl = baseUrl
    this.getAccessToken = getAccessToken
    this.refreshStrategy = refreshStrategy
    this.cache = cache
    this.deduplicator = deduplicator
  }

  // ─── ESTRATEGIA 3: Retry con Backoff Exponencial ──────────────────────────
  // Solo reintenta ante errores de RED (TypeError: Failed to fetch).
  // Las respuestas HTTP con error (4xx, 5xx) llegan normales — no se reintentan.
  // Esperas: 1s → 2s → 4s (backoff exponencial).
  // Crítico para Render.com: el servidor tarda 30-60s en despertar (cold start).

  private async fetchWithRetry(
    fetchUrl: string,
    options: RequestInit,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<Response> {
    let lastError: unknown

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fetch(fetchUrl, options)
      } catch (error) {
        lastError = error
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt)
          console.warn(
            `[FetchHttpClient] 🔁 Error de red (intento ${attempt + 1}/${maxRetries + 1}). Reintentando en ${delay}ms...`
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
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
      response = await this.fetchWithRetry(`${this.baseUrl}${url}`, {
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

  /** Ejecuta una petición con un token ya conocido (usado por el retry de 401). */
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

  // ─── ESTRATEGIAS 1 + 2: Cache + Deduplication en GET ─────────────────────
  // El Service que llama define su política de caché via config.cacheTtl.
  // FetchHttpClient no sabe nada de qué endpoints existen — solo aplica
  // la mecánica de caché/deduplicación con el TTL que recibe.
  //
  // Orden de ejecución:
  //   1. ¿cacheTtl > 0 y hay caché válido? → devolver inmediatamente (sin red)
  //   2. ¿Hay un request idéntico en vuelo? → reutilizar su Promise (deduplication)
  //   3. Lanzar fetch real → guardar en caché si status 200 y cacheTtl > 0

  async get<T>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const { cacheTtl, ...fetchConfig } = config ?? {}

    // 1. Cache hit
    if (cacheTtl && cacheTtl > 0) {
      const cached = this.cache.get<HttpResponse<T>>(url)
      if (cached) {
        console.log(`[Cache HIT] ${url}`)
        return cached
      }
    }

    // 2 + 3. Deduplication + fetch real con guardado en caché
    return this.deduplicator.dedupe(url, async () => {
      const response = await this.request<T>(url, {
        method: 'GET',
        ...fetchConfig,
      })
      if (cacheTtl && cacheTtl > 0 && response.status === 200) {
        this.cache.set(url, response, cacheTtl)
        console.log(`[Cache SET] ${url} (TTL: ${cacheTtl / 1000}s)`)
      }
      return response
    })
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

  // ─── MÉTODOS DE CACHÉ (IHttpClient contract) ──────────────────────────────

  /**
   * Invalida entradas de caché cuya clave contenga el patrón.
   * Llamar desde los Services tras POST/PUT/DELETE exitosos para forzar
   * que el próximo GET traiga datos frescos del servidor.
   *
   * @example
   * // En CategoryService.createCategory() tras 201:
   * this.httpClient.invalidateCache('/api/v1/categories')
   */
  invalidateCache(pattern: string): void {
    this.cache.invalidate(pattern)
    console.log(`[Cache INVALIDATE] pattern: ${pattern}`)
  }

  /**
   * Limpia todo el caché en memoria.
   * Llamar al hacer logout para no dejar datos de un usuario
   * accesibles si otro inicia sesión en el mismo tab.
   */
  clearCache(): void {
    this.cache.clear()
    console.log('[Cache CLEAR] Todo el caché fue limpiado')
  }
}
