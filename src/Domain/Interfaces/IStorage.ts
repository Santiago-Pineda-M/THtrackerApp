/**
 * DOMAIN LAYER - Interfaces
 * Contrato base para el almacenamiento local.
 * Soporta implementaciones síncronas y asíncronas.
 */
export interface IStorage {
    get<T>(key: string): T | null | Promise<T | null>;
    set<T>(key: string, value: T): void | Promise<void>;
    remove(key: string): void | Promise<void>;
    clear(): void | Promise<void>;
}
