/**
 * INFRASTRUCTURE LAYER - In-Memory Request Cache
 * ─────────────────────────────────────────────────────────────────────────────
 * Almacena respuestas HTTP GET en memoria con tiempo de vida (TTL) configurable.
 *
 * Responsabilidades:
 *  - Guardar respuestas GET con un timestamp y TTL asignado.
 *  - Devolver null si la entrada expiró o no existe.
 *  - Invalidar entradas por patrón de URL (usado tras mutaciones POST/PUT/DELETE).
 *  - Limpieza total del caché (usado en logout).
 *
 * SRP: no conoce fetch, no conoce React, no conoce tokens.
 * La configuración de TTL por endpoint vive en FetchHttpClient.
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class RequestCache {
  private readonly store = new Map<string, CacheEntry<unknown>>()

  /**
   * Devuelve el dato cacheado si existe y no ha expirado.
   * Si la entrada expiró, la elimina automáticamente y devuelve null.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.store.delete(key)
      return null
    }

    return entry.data
  }

  /** Almacena una respuesta con su TTL en milisegundos. */
  set<T>(key: string, data: T, ttl: number): void {
    this.store.set(key, { data, timestamp: Date.now(), ttl })
  }

  /**
   * Invalida todas las entradas cuya clave contenga el patrón dado.
   * Se llama desde los Services tras operaciones de escritura exitosas.
   *
   * @example
   * cache.invalidate('/api/v1/categories')
   * // Elimina: '/api/v1/categories', '/api/v1/categories/123', etc.
   */
  invalidate(pattern: string): void {
    this.store.forEach((_, key) => {
      if (key.includes(pattern)) {
        this.store.delete(key)
      }
    })
  }

  /**
   * Limpia todo el caché.
   * Debe llamarse al hacer logout para no dejar datos de un usuario
   * accesibles a otro que inicie sesión en el mismo navegador/tab.
   */
  clear(): void {
    this.store.clear()
  }
}
