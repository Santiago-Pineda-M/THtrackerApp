/**
 * DOMAIN LAYER - Pattern Interfaces (IPatterns)
 * Contratos base para los patrones de diseño utilizados en la arquitectura.
 * Estas interfaces definen la estructura fundamental para UseCases, HttpClient y Storage.
 */

/**
 * Contrato base para todos los Casos de Uso.
 * I = tipo del input, O = tipo del output.
 */
export interface IUseCase<I, O> {
  execute(input: I): Promise<O>
}

/**
 * Contrato base para el cliente HTTP. Los adaptadores (FetchHttpClient, etc.)
 * implementan esta interfaz para desacoplar el dominio de librerías externas.
 */
export interface HttpResponse<T = unknown> {
  data: T
  status: number
}

/**
 * Extiende RequestInit con una opción de caché opcional.
 * Cada Service que llama a get() decide su propia política de caché.
 *
 * @property cacheTtl - Time-to-live en milisegundos. Omitir o 0 = sin caché.
 *
 * @example
 * // En CategoryService — cachear 5 minutos:
 * this.httpClient.get(url, { cacheTtl: 5 * 60 * 1000 })
 *
 * // En ActiveLogsService — nunca cachear:
 * this.httpClient.get(url) // sin cacheTtl
 */
export interface HttpRequestConfig extends RequestInit {
  cacheTtl?: number
}

export interface IHttpClient {
  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>
  post<T>(
    url: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<HttpResponse<T>>
  put<T>(
    url: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<HttpResponse<T>>
  patch<T>(
    url: string,
    data?: unknown,
    config?: RequestInit
  ): Promise<HttpResponse<T>>
  delete<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>>

  /**
   * Invalida entradas de caché cuya clave contenga el patrón.
   * Llamar desde los Services tras POST/PUT/DELETE exitosos.
   */
  invalidateCache(pattern: string): void

  /**
   * Limpia todo el caché en memoria.
   * Llamar al hacer logout.
   */
  clearCache(): void
}

/**
 * Contrato base para el almacenamiento local.
 * Soporta implementaciones síncronas y asíncronas.
 */
export interface IStorage {
  get<T>(key: string): T | null | Promise<T | null>
  set<T>(key: string, value: T): void | Promise<void>
  remove(key: string): void | Promise<void>
  clear(): void | Promise<void>
}

/**
 * Interfaz para almacenamiento seguro.
 * Define los métodos para persistir datos sensibles (tokens, etc.).
 */
export interface ISecureStorage {
  /**
   * Obtiene un valor almacenado.
   * @returns El valor como string o null si no existe.
   */
  get(key: string): Promise<string | null>

  /**
   * Almacena un valor.
   */
  set(key: string, value: string): Promise<void>

  /**
   * Elimina un valor almacenado.
   */
  delete(key: string): Promise<void>

  /**
   * Limpia todo el almacenamiento.
   */
  clear(): Promise<void>
}
