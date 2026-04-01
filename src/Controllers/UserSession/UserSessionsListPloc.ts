/**
 * CONTROLLER LAYER - UserSessionsListPloc
 * PLOC para mostrar la lista de sesiones activas del usuario autenticado.
 */

import { Ploc } from "../../Domain/Ploc";
import { 
    type IUserSessionsListState, 
    initialUserSessionsListState
} from "../../Domain";
import type { GetUserSessionsUseCase } from "../../Application/UseCases/UserSession";

export class UserSessionsListPloc extends Ploc<IUserSessionsListState> {
    private readonly getUserSessionsUseCase: GetUserSessionsUseCase;

    constructor(getUserSessionsUseCase: GetUserSessionsUseCase) {
        super(initialUserSessionsListState);
        this.getUserSessionsUseCase = getUserSessionsUseCase;
    }

    /**
     * Carga todas las sesiones activas del usuario autenticado.
     */
    async loadSessions(): Promise<void> {
        this.changeState({
            ...this.state,
            isLoading: true,
            error: null,
        });

        try {
            const result = await this.getUserSessionsUseCase.execute();

            this.changeState({
                ...this.state,
                sessions: result.sessions,
                isLoading: false,
                error: null,
            });
        } catch (err: unknown) {
            const error = err instanceof Error 
                ? { title: 'Error', detail: err.message }
                : { title: 'Error', detail: 'Error desconocido al cargar las sesiones' };

            this.changeState({
                ...this.state,
                sessions: [],
                isLoading: false,
                error,
            });
        }
    }

    /**
     * Resetea el estado.
     */
    reset(): void {
        this.changeState(initialUserSessionsListState);
    }
}
