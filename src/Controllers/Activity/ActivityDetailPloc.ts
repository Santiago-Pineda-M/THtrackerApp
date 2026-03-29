/**
 * CONTROLLER LAYER - ActivityDetailPloc
 * PLOC para mostrar los detalles de una actividad individual.
 */

import { Ploc } from "../../Domain/Ploc";
import { 
    type IActivityDetailState, 
    initialActivityDetailState 
} from "../../Domain";
import type { GetActivityByIdUseCase } from "../../Application/UseCases/Activity";

export class ActivityDetailPloc extends Ploc<IActivityDetailState> {
    private readonly getActivityByIdUseCase: GetActivityByIdUseCase;

    constructor(getActivityByIdUseCase: GetActivityByIdUseCase) {
        super(initialActivityDetailState);
        this.getActivityByIdUseCase = getActivityByIdUseCase;
    }

    /**
     * Carga una actividad por su ID.
     */
    async loadActivity(id: string): Promise<void> {
        this.changeState({
            ...this.state,
            isLoading: true,
            error: null,
        });

        try {
            const result = await this.getActivityByIdUseCase.execute({ id });

            if (result.success) {
                this.changeState({
                    ...this.state,
                    activity: result.activity,
                    isLoading: false,
                });
                return;
            }

            this.changeState({
                ...this.state,
                activity: null,
                isLoading: false,
                error: result.error,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            this.changeState({
                ...this.state,
                activity: null,
                isLoading: false,
                error: { title: 'Error', detail: message },
            });
        }
    }

    /**
     * Resetea el estado.
     */
    reset(): void {
        this.changeState(initialActivityDetailState);
    }
}
