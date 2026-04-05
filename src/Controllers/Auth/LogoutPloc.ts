import { Ploc } from "../../Domain/Ploc";
import { type ILogoutState, initialLogoutState } from "../../Domain/IStates";
import type { LogoutUseCase } from "../../Application/UseCases/Auth";
import { AuthPloc } from "./AuthPloc";

export class LogoutPloc extends Ploc<ILogoutState> {
    private readonly logoutUseCase: LogoutUseCase;
    private readonly authPloc: AuthPloc;

    constructor(logoutUseCase: LogoutUseCase, authPloc: AuthPloc) {
        super(initialLogoutState);
        this.logoutUseCase = logoutUseCase;
        this.authPloc = authPloc;
    }

    /**
     * Cierra la sesión del usuario.
     */
    async logout(): Promise<void> {
        this.changeState({
            ...this.state,
            isLoggingOut: true,
            success: false,
            error: undefined,
        });

        try {
            await this.logoutUseCase.execute();
            // Notificar al AuthPloc que el logout fue exitoso
            this.authPloc.onLogout();
            
            this.changeState({
                ...this.state,
                isLoggingOut: false,
                success: true,
                error: undefined,
            });
        } catch {
            // Limpiar sesión local aunque el servidor falle
            this.authPloc.onLogout();
            this.changeState({
                ...this.state,
                isLoggingOut: false,
                success: true, // Consideramos éxito porque la sesión local se limpia
                error: undefined,
            });
        }
    }

    /**
     * Resetea el estado.
     */
    reset(): void {
        this.changeState(initialLogoutState);
    }
}
