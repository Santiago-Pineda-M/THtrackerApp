import { Ploc } from "../../Domain/Ploc";
import { AuthStatus } from "../../Domain";
import type { IAuthState } from "../../Domain";
import { initialAuthState } from "../../Domain";

// Importar tipos de la nueva arquitectura
import type { CheckAuthSessionUseCase, GetSessionUseCase } from "../../Application/UseCases/Auth";

/**
 * CONTROLLER LAYER - AuthPloc
 * Maneja el estado global de autenticación.
 * Solo se encarga de verificar y mantener la sesión activa.
 * 
 * SOLO recibe Use Cases - no repositorios ni servicios.
 */
export class AuthPloc extends Ploc<IAuthState> {
    private readonly checkAuthSessionUseCase: CheckAuthSessionUseCase;
    private readonly getSessionUseCase: GetSessionUseCase;

    constructor(
        checkAuthSessionUseCase: CheckAuthSessionUseCase,
        getSessionUseCase: GetSessionUseCase
    ) {
        super(initialAuthState);
        this.checkAuthSessionUseCase = checkAuthSessionUseCase;
        this.getSessionUseCase = getSessionUseCase;
    }

    /**
     * Inicializa la sesión verificando la sesión persistida.
     * Método llamado al iniciar la aplicación.
     * 
     * Flujo:
     * 1. Cambia estado a LOADING
     * 2. Usa CheckAuthSessionUseCase que:
     *    - Lee la sesión del storage
     *    - Verifica si el token está expirado
     *    - Si expirado, limpia la sesión
     * 3. Cambia estado a AUTHENTICATED o UNAUTHENTICATED
     */
    async init(): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.LOADING });

        try {
            // CheckAuthSessionUseCase verifica y valida la sesión
            const { isAuthenticated, session } = await this.checkAuthSessionUseCase.execute();

            if (!isAuthenticated || !session) {
                this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED });
                return;
            }

            // Sesión válida - usuario autenticado
            this.changeState({
                status: AuthStatus.AUTHENTICATED,
                user: {
                    id: session.userId,
                    name: session.name || '',
                    email: session.email,
                }
            });
        } catch {
            this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED });
        }
    }

    /**
     * Actualiza el estado cuando el usuario inicia sesión exitosamente.
     * Método llamado por LoginPloc después de un login exitoso.
     * 
     * Flujo:
     * 1. Usa GetSessionUseCase para obtener la sesión guardada
     * 2. Extrae los datos del usuario
     * 3. Cambia estado a AUTHENTICATED
     */
    async onLoginSuccess(): Promise<void> {
        // GetSessionUseCase simplemente retorna lo que hay guardado
        const { session } = await this.getSessionUseCase.execute();
        
        if (session) {
            this.changeState({
                status: AuthStatus.AUTHENTICATED,
                user: {
                    id: session.userId,
                    name: session.name || '',
                    email: session.email,
                }
            });
        }
    }

    /**
     * Actualiza el estado cuando el usuario cierra sesión.
     * Este método es llamado por LogoutPloc después de un logout exitoso.
     */
    onLogout(): void {
        this.changeState({ ...initialAuthState, status: AuthStatus.UNAUTHENTICATED });
    }
}
