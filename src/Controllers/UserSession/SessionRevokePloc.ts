/**
 * CONTROLLER LAYER - SessionRevokePloc
 * PLOC para revocar una sesión específica del usuario autenticado.
 */

import { Ploc } from "../../Domain/Ploc";
import { 
    type ISessionRevokeState, 
    initialSessionRevokeState
} from "../../Domain";
import type { RevokeSessionUseCase } from "../../Application/UseCases/UserSession";

export class SessionRevokePloc extends Ploc<ISessionRevokeState> {
    private readonly revokeSessionUseCase: RevokeSessionUseCase;

    constructor(revokeSessionUseCase: RevokeSessionUseCase) {
        super(initialSessionRevokeState);
        this.revokeSessionUseCase = revokeSessionUseCase;
    }

    /**
     * Revoca una sesión específica por su ID.
     */
    async revokeSession(sessionId: string): Promise<void> {
        this.changeState({
            ...this.state,
            isRevoking: true,
            error: null,
            success: false,
            revokedSessionId: null,
        });

        try {
            const result = await this.revokeSessionUseCase.execute({ sessionId });

            if (result.success) {
                this.changeState({
                    ...this.state,
                    isRevoking: false,
                    success: true,
                    revokedSessionId: result.revokedSessionId,
                    error: null,
                });
                return;
            }

            this.changeState({
                ...this.state,
                isRevoking: false,
                success: false,
                error: { title: 'Error', detail: 'No se pudo revocar la sesión.' },
                revokedSessionId: null,
            });
        } catch (err: unknown) {
            const error = err instanceof Error 
                ? { title: 'Error', detail: err.message }
                : { title: 'Error', detail: 'Error desconocido al revocar la sesión' };

            this.changeState({
                ...this.state,
                isRevoking: false,
                success: false,
                error,
                revokedSessionId: null,
            });
        }
    }

    /**
     * Resetea el estado.
     */
    reset(): void {
        this.changeState(initialSessionRevokeState);
    }
}
