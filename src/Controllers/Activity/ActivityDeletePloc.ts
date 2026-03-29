/**
 * CONTROLLER LAYER - ActivityDeletePloc
 * PLOC para la eliminación de actividades.
 */

import { Ploc } from "../../Domain/Ploc";
import { 
    type IActivityDeleteState, 
    initialActivityDeleteState 
} from "../../Domain";
import type { DeleteActivityUseCase } from "../../Application/UseCases/Activity";

export class ActivityDeletePloc extends Ploc<IActivityDeleteState> {
    private readonly deleteActivityUseCase: DeleteActivityUseCase;

    constructor(deleteActivityUseCase: DeleteActivityUseCase) {
        super(initialActivityDeleteState);
        this.deleteActivityUseCase = deleteActivityUseCase;
    }

    /**
     * Elimina una actividad por su ID.
     */
    async deleteActivity(id: string): Promise<void> {
        this.changeState({
            ...this.state,
            isLoading: true,
            success: false,
            error: null,
        });

        try {
            const result = await this.deleteActivityUseCase.execute({ id });

            if (result.success) {
                this.changeState({
                    ...this.state,
                    isLoading: false,
                    success: true,
                });
                return;
            }

            this.changeState({
                ...this.state,
                isLoading: false,
                success: false,
                error: result.error,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            this.changeState({
                ...this.state,
                isLoading: false,
                success: false,
                error: { title: 'Error', detail: message },
            });
        }
    }

    /**
     * Resetea el estado.
     */
    reset(): void {
        this.changeState(initialActivityDeleteState);
    }
}
