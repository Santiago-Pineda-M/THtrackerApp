/**
 * CONTROLLER LAYER - ActivityValueDefinitionDeletePloc
 * PLOC para la eliminación de definiciones de valores.
 */

import { Ploc } from "../../Domain/Ploc";
import {
    type IValueDefinitionDeleteState,
    initialValueDefinitionDeleteState
} from "../../Domain";
import type { DeleteActivityValueDefinitionUseCase } from "../../Application/UseCases/ActivityValueDefinition";

export class ActivityValueDefinitionDeletePloc extends Ploc<IValueDefinitionDeleteState> {
    private readonly deleteValueDefinitionUseCase: DeleteActivityValueDefinitionUseCase;

    constructor(deleteValueDefinitionUseCase: DeleteActivityValueDefinitionUseCase) {
        super(initialValueDefinitionDeleteState);
        this.deleteValueDefinitionUseCase = deleteValueDefinitionUseCase;
    }

    /**
     * Elimina una definición de valor por su ID.
     */
    async deleteValueDefinition(activityId: string, id: string): Promise<void> {
        this.changeState({
            ...this.state,
            isLoading: true,
            success: false,
            error: null,
        });

        try {
            const result = await this.deleteValueDefinitionUseCase.execute({ activityId, id });

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
        this.changeState(initialValueDefinitionDeleteState);
    }
}