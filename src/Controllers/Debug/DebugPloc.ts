/**
 * CONTROLLERS LAYER - Debug Module
 * DebugPloc: Controlador para el estado de debug de la aplicación.
 * Maneja la actualización periódica del estado de debug.
 * 
 * Este Ploc:
 * - Se subscribe al AuthPloc para detectar cambios de autenticación
 * - Actualiza el estado de debug periódicamente (cada segundo)
 * - Notifica a los componentes cuando el estado cambia
 */
import { Ploc } from '../../Domain/Ploc';
import { initialDebugState, type IDebugState, type DebugTokenExpiryInfo } from '../../Domain';
import type { IAuthSessionRepository } from '../../Domain/Repositories/IAuthSessionRepository';

/**
 * Interfaz para tracking de llamadas API
 * Permite al DebugPloc obtener información de la última llamada API
 */
export interface IApiCallTracker {
    getLastApiCall(): {
        timestamp: Date | null;
        endpoint: string | null;
        status: number | null;
        method: string | null;
    };
    setLastApiCall(call: {
        timestamp: Date;
        endpoint: string;
        status: number;
        method: string;
    }): void;
}

/**
 * Implementación simple del tracker de API que se integra con el Ploc
 */
class ApiCallTracker implements IApiCallTracker {
    private lastCall: {
        timestamp: Date | null;
        endpoint: string | null;
        status: number | null;
        method: string | null;
    } = {
        timestamp: null,
        endpoint: null,
        status: null,
        method: null
    };

    getLastApiCall() {
        return this.lastCall;
    }

    // Add a callback so the Ploc can be notified when API calls happen
    private onApiUpdate?: () => void;

    setApiUpdateCallback(callback: () => void) {
        this.onApiUpdate = callback;
    }

    setLastApiCall(call: {
        timestamp: Date;
        endpoint: string;
        status: number;
        method: string;
    }) {
        this.lastCall = {
            timestamp: call.timestamp,
            endpoint: call.endpoint,
            status: call.status,
            method: call.method
        };
        // Notify the Ploc
        if (this.onApiUpdate) {
            this.onApiUpdate();
        }
    }

    /**
     * Configura el interceptor de fetch para rastrear llamadas API
     */
    setupFetchInterceptor(): () => void {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const url = args[0] as string;
            const method = args[1]?.method || 'GET';
            
            try {
                const response = await originalFetch(...args);
                this.setLastApiCall({
                    timestamp: new Date(),
                    endpoint: url,
                    status: response.status,
                    method: method
                });
                return response;
            } catch (error) {
                this.setLastApiCall({
                    timestamp: new Date(),
                    endpoint: url,
                    status: 0,
                    method: method
                });
                throw error;
            }
        };

        // Retornar función de limpieza
        return () => {
            window.fetch = originalFetch;
        };
    }
}

/**
 * DebugPloc: Maneja el estado del panel de debug.
 * 
 * Responsabilidades:
 * 1. Proveer estado inicial de debug
 * 2. Actualizar el estado periódicamente
 * 3. Suscribirse a cambios del AuthPloc
 * 4. Interceptar llamadas fetch para mostrar última API
 */
export class DebugPloc extends Ploc<IDebugState> {
    private readonly authSessionRepo: IAuthSessionRepository;
    private readonly apiCallTracker: ApiCallTracker;
    private unsubscribers: (() => void)[] = [];
    private _isUpdating = false;

    private updateCount: number = 0;

    constructor(authSessionRepo: IAuthSessionRepository) {
        super(initialDebugState);
        this.authSessionRepo = authSessionRepo;
        this.apiCallTracker = new ApiCallTracker();
        
        // When the API tracker has a new update, refresh the PLOC
        this.apiCallTracker.setApiUpdateCallback(() => {
            if (this._isUpdating) {
                this.refresh();
            }
        });
    }

    /**
     * Inicia la suscripción a eventos para el panel de debug.
     * Llama este método al montar el componente.
     */
    startUpdating(): void {
        if (this._isUpdating) {
            return; // Ya está activo
        }

        this._isUpdating = true;

        // Configurar interceptor de fetch
        const cleanupFetch = this.apiCallTracker.setupFetchInterceptor();
        this.unsubscribers.push(cleanupFetch);

        // Actualizar inmediatamente
        this.refresh();
    }

    /**
     * Detiene la actualización periódica.
     * Llama este método al desmontar el componente.
     */
    stopUpdating(): void {
        this._isUpdating = false;

        // Limpiar todos los subscribers
        this.unsubscribers.forEach(cleanup => cleanup());
        this.unsubscribers = [];
    }

    /**
     * Fuerza una actualización del estado de debug.
     */
    async refresh(): Promise<void> {
        try {
            this.updateCount++;

            // Leer repository para obtener datos de sesión/tokens
            const session = await this.authSessionRepo.getSession();
            let tokenExpiry: DebugTokenExpiryInfo = {
                accessTokenExpiry: null,
                refreshTokenExpiry: null,
                isExpired: true,
                needsRefresh: true
            };

            if (session) {
                // El dominio ahora calcula y expone proactivamente el tiempo en milisegundos de ambos tokens
                const accessDate = session.accessTokenExpiresAt > 0 ? new Date(session.accessTokenExpiresAt) : null;
                const refreshDate = session.refreshTokenExpiresAt ? new Date(session.refreshTokenExpiresAt) : null;

                tokenExpiry = {
                    accessTokenExpiry: accessDate,
                    refreshTokenExpiry: refreshDate,
                    isExpired: session.isAccessTokenExpired(),
                    needsRefresh: session.accessTokenNeedsRefresh()
                };
            }

            const storageInfo = this.getStorageInfo();
            const appInfo = this.getAppInfo();
            const navigatorInfo = this.getNavigatorInfo();
            const lastApiCall = this.apiCallTracker.getLastApiCall();

            const debugState: IDebugState = {
                tokenExpiry,
                storageInfo,
                appInfo,
                navigatorInfo,
                lastApiCall,
                renderCount: this.updateCount,
                lastUpdate: new Date()
            };

            this.changeState(debugState);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('[DEBUG PLOC] Error refreshing:', error);
            }
        }
    }

    private getStorageInfo(): IDebugState['storageInfo'] {
        try {
            const keys: string[] = [];
            const contents: Record<string, string> = {};
            let size = 0;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    keys.push(key);
                    const value = localStorage.getItem(key) || '';
                    contents[key] = value;
                    size += key.length + value.length;
                }
            }

            return {
                size: Math.round(size / 1024 * 100) / 100,
                keys,
                contents
            };
        } catch {
            return { size: 0, keys: [], contents: {} };
        }
    }

    private getAppInfo(): IDebugState['appInfo'] {
        return {
            appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
            environment: import.meta.env.MODE || 'development',
            buildTimestamp: import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString()
        };
    }

    private getNavigatorInfo(): IDebugState['navigatorInfo'] {
        return {
            online: navigator.onLine,
            connectionType: 'unknown',
            userAgent: navigator.userAgent
        };
    }
}
