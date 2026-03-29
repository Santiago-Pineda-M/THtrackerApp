/**
 * CONTROLLER LAYER - ActivityValueDefinitionsListPloc
 * PLOC para gestionar la lista de definiciones de valores.
 */

import { Ploc } from "../../Domain/Ploc";
import { 
    type IActivityValueDefinitionsState, 
    initialActivityValueDefinitionsState 
} from "../../Domain";
import type { GetValueDefinitionsUseCase } from "../../Application/UseCases/Activity";

export class ActivityValueDefinitionsListPloc extends Ploc<IActivityValueDefinitionsState> {
    private readonly getValueDefinitionsUseCase: GetValueDefinitionsUseCase;

    constructor(getValueDefinitionsUseCase: GetValueDefinitionsUseCase) {
        super(initialActivityValueDefinitionsState);
        this.getValueDefinitionsUseCase = getValueDefinitionsUseCase;
    }

    /**
     * Carga las definiciones de una actividad.
     */
    async loadDefinitions(activityId: string): Promise<void> {
        this.changeState({
            ...this.state,
            activityId,
            isLoading: true,
            error: null,
        });

        try {
            const result = await this.getValueDefinitionsUseCase.execute({ activityId });

            if (result.success) {
                this.changeState({
                    ...this.state,
                    definitions: result.definitions,
                    isLoading: false,
                });
                return;
            }

            this.changeState({
                ...this.state,
                definitions: [],
                isLoading: false,
                error: result.error,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            this.changeState({
                ...this.state,
                definitions: [],
                isLoading: false,
                error: { title: 'Error', detail: message },
            });
        }
    }

    /**
     * Resetea el estado.
     */
    reset(): void {
        this.changeState(initialActivityValueDefinitionsState);
    }
}
