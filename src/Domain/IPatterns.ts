/**
 * DOMAIN LAYER - Pattern Interfaces (IPatterns)
 * Contratos base para los patrones de diseño utilizados en la arquitectura.
 * Estas interfaces definen la estructura fundamental para UseCases, HttpClient y Storage.
 */

import type { HttpResponse } from './Interfaces/IHttpClient';

/**
 * Interfaz base para todos los Casos de Uso (UseCases).
 * I = tipo del input, O = tipo del output.
 */
export interface IUseCase<I, O> {
    execute(input: I): Promise<O>;
}

/**
 * Interfaz para el cliente HTTP.
 * Define los métodos base para realizar peticiones REST.
 */
export interface IHttpClient {
    /**
     * Realiza una petición GET.
     */
    get<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>>;
    
    /**
     * Realiza una petición POST.
     */
    post<T>(url: string, data?: unknown, config?: RequestInit): Promise<HttpResponse<T>>;
    
    /**
     * Realiza una petición PUT.
     */
    put<T>(url: string, data?: unknown, config?: RequestInit): Promise<HttpResponse<T>>;
    
    /**
     * Realiza una petición DELETE.
     */
    delete<T>(url: string, config?: RequestInit): Promise<HttpResponse<T>>;
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
    get(key: string): Promise<string | null>;
    
    /**
     * Almacena un valor.
     */
    set(key: string, value: string): Promise<void>;
    
    /**
     * Elimina un valor almacenado.
     */
    delete(key: string): Promise<void>;
    
    /**
     * Limpia todo el almacenamiento.
     */
    clear(): Promise<void>;
}

/**
 * Interfaz para almacenamiento local genérico.
 * Puede ser síncrono o asíncrono.
 */
export interface IStorage {
    get<T>(key: string): T | null | Promise<T | null>;
    set<T>(key: string, value: T): void | Promise<void>;
    remove(key: string): void | Promise<void>;
    clear(): void | Promise<void>;
}

/**
 * Resultado genérico para UseCases que pueden fallar.
 */
export type UseCaseResult<T, E = Error> = 
    | { success: true; value: T; error: null }
    | { success: false; value: null; error: E };

/**
 * Helper para crear resultado de éxito.
 */
export const successResult = <T>(value: T): UseCaseResult<T, never> => {
    return { success: true, value, error: null };
}

/**
 * Helper para crear resultado de error.
 */
export const errorResult = <E>(error: E): UseCaseResult<never, E> => {
    return { success: false, value: null, error };
}
