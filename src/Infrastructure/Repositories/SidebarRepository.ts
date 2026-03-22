/**
 * INFRASTRUCTURE LAYER - SidebarRepository
 * Implementación de ISidebarRepository que usa IStorage (localStorage).
 */

import type { ISidebarRepository } from '../../Domain/Repositories/ISidebarRepository';
import { SidebarState } from '../../Domain/Entities/SidebarState';
import type { IStorage } from '../../Domain/IPatterns';

const SIDEBAR_STATE_KEY = 'sidebar_state';

export class SidebarRepository implements ISidebarRepository {
    private readonly storage: IStorage;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    getState(): SidebarState {
        try {
            const dataString = this.storage.get<string>(SIDEBAR_STATE_KEY);
            // Manejar caso asíncrono
            if (dataString instanceof Promise) {
                // Si es asíncrónico, retornar estado por defecto
                // (El estado se cargará correctamente cuando se llame desde el Ploc de forma async)
                return SidebarState.default();
            }
            if (!dataString) {
                return SidebarState.default();
            }
            return SidebarState.fromJSON(dataString);
        } catch {
            return SidebarState.default();
        }
    }

    saveState(state: SidebarState): void {
        try {
            const jsonStr = state.toJSON();
            this.storage.set(SIDEBAR_STATE_KEY, jsonStr);
        } catch (error) {
            console.error('[SidebarRepository] Error al guardar el estado:', error);
        }
    }
}
