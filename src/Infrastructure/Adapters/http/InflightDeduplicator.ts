/**
 * INFRASTRUCTURE LAYER - Inflight Request Deduplicator
 * ─────────────────────────────────────────────────────────────────────────────
 * Evita que se lancen peticiones HTTP duplicadas para el mismo endpoint
 * cuando dos o más componentes lo solicitan al mismo tiempo.
 *
 * Problema que resuelve:
 *  - UserProfileDisplay y UserProfileForm se montan simultáneamente y ambos
 *    llaman a GET /users/me → sin deduplicación = 2 requests en paralelo.
 *  - Con esta clase, el segundo request reutiliza la Promise del primero.
 *
 * Funcionamiento:
 *  1. Si ya hay una petición en vuelo para la URL dada, devuelve la misma Promise.
 *  2. Cuando la Promise resuelve (éxito o error), la entrada se elimina del mapa
 *     para que el siguiente request sea una petición real.
 *
 * SRP: solo sabe si hay una petición en vuelo. No conoce caché, fetch, ni React.
 */

export class InflightDeduplicator {
  private readonly inflight = new Map<string, Promise<unknown>>()

  /**
   * Si ya existe una petición en vuelo para `key`, devuelve su Promise.
   * Si no, ejecuta `requestFn`, registra la Promise y la devuelve.
   *
   * @param key     Identificador único de la petición (típicamente la URL).
   * @param requestFn Función que lanza la petición real.
   */
  dedupe<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    const existing = this.inflight.get(key)
    if (existing) {
      return existing as Promise<T>
    }

    const promise = requestFn().finally(() => {
      this.inflight.delete(key)
    })

    this.inflight.set(key, promise)
    return promise
  }
}
