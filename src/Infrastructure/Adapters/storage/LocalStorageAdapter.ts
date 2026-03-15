/**
 * INFRASTRUCTURE LAYER - Storage Adapter
 * ─────────────────────────────────────────────────────────────────────────────
 * Implementación concreta de IStorage usando la Web API localStorage.
 *
 * Características:
 *  - Sincrónico y simple (ideal para preferencias de UI, flags de app).
 *  - Límite ~5MB por origen.
 *  - Los datos persisten entre sesiones del navegador.
 *  - NO cifra los datos: no usar para tokens de autenticación sensibles.
 *    → Para eso usar SecureStorageAdapter.
 *
 * Uso recomendado: preferencias de usuario, tema, idioma, caché offline.
 */
import type { IStorage } from '../../../Domain';

export class LocalStorageAdapter implements IStorage {
    private readonly prefix: string;

    /**
     * @param prefix Prefijo opcional para evitar colisiones de claves.
     *               Por defecto: 'app'.
     * @example
     *   const storage = new LocalStorageAdapter('myApp');
     *   storage.set('theme', 'dark'); // guarda como "myApp:theme"
     */
    constructor(prefix = 'app') {
        this.prefix = prefix;
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private buildKey(key: string): string {
        return `${this.prefix}:${key}`;
    }

    // ─── IStorage Implementation ──────────────────────────────────────────────

    /**
     * Obtiene un valor del localStorage y lo deserializa desde JSON.
     * @returns El valor tipado `T`, o `null` si la clave no existe o hay error.
     */
    get<T>(key: string): T | null {
        try {
            const raw = localStorage.getItem(this.buildKey(key));
            if (raw === null) return null;
            return JSON.parse(raw) as T;
        } catch {
            console.warn(`[LocalStorageAdapter] Error al leer la clave "${key}".`);
            return null;
        }
    }

    /**
     * Serializa el valor a JSON y lo guarda en localStorage.
     */
    set<T>(key: string, value: T): void {
        try {
            const fullKey = this.buildKey(key);
            const stringValue = JSON.stringify(value);
            localStorage.setItem(fullKey, stringValue);
        } catch (error) {
            // Puede fallar si se llena el cupo (QuotaExceededError)
            console.error(`[LocalStorageAdapter] Error al escribir la clave "${key}":`, error);
        }
    }

    /**
     * Elimina la entrada asociada a la clave.
     */
    remove(key: string): void {
        localStorage.removeItem(this.buildKey(key));
    }

    /**
     * Elimina TODAS las entradas que tengan el prefijo de esta instancia.
     */
    clear(): void {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const rawKey = localStorage.key(i);
            if (rawKey?.startsWith(`${this.prefix}:`)) {
                keysToRemove.push(rawKey);
            }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
    }
}
