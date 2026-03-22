import { Ploc } from "../../Domain/Ploc";
import { AuthStatus } from "../../Domain";
import type { IAuthState } from "../../Domain";
import { initialAuthState } from "../../Domain";

// Importar tipos de la nueva arquitectura
import type { CheckAuthSessionUseCase, GetSessionUseCase } from "../../Application/UseCases/Auth";

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

    async init(): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.LOADING });

        try {
            // CheckAuthSessionUseCase verifica y valida la sesión
            const { isAuthenticated, session } = await this.checkAuthSessionUseCase.execute();

            if (!isAuthenticated || !session) {
                this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED, user: null });
                return;
            }

            // Sesión válida - usuario autenticado
            this.changeState({
                status: AuthStatus.AUTHENTICATED,
                user: session // session ya es AuthSession del use case
            });
        } catch {
            this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED, user: null });
        }
    }

    async onLoginSuccess(): Promise<void> {
        // GetSessionUseCase simplemente retorna lo que hay guardado
        const { session } = await this.getSessionUseCase.execute();
        
        if (session) {
            this.changeState({
                status: AuthStatus.AUTHENTICATED,
                user: session // session ya es AuthSession del use case
            });
        }
    }

    onLogout(): void {
        this.changeState({ ...initialAuthState, status: AuthStatus.UNAUTHENTICATED });
    }
}
