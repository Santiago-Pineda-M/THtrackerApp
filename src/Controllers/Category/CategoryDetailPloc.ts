/**
 * CONTROLLER LAYER - CategoryDetailPloc
 * PLOC para mostrar una categoría específica por su ID.
 */

import { Ploc } from "../../Domain/Ploc";
import { 
    type ICategoryDetailState, 
    initialCategoryDetailState
} from "../../Domain";
import type { GetCategoryByIdUseCase } from "../../Application/UseCases/Category";

export class CategoryDetailPloc extends Ploc<ICategoryDetailState> {
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase;

    constructor(getCategoryByIdUseCase: GetCategoryByIdUseCase) {
        super(initialCategoryDetailState);
        this.getCategoryByIdUseCase = getCategoryByIdUseCase;
    }

    /**
     * Carga una categoría específica por su ID.
     */
    async loadCategory(id: string): Promise<void> {
        this.changeState({
            ...this.state,
            isLoading: true,
            error: null,
        });

        try {
            const result = await this.getCategoryByIdUseCase.execute({ id });

            if (result.success) {
                this.changeState({
                    ...this.state,
                    category: result.category,
                    isLoading: false,
                    error: null,
                });
                return;
            }

            this.changeState({
                ...this.state,
                category: null,
                isLoading: false,
                error: result.error,
            });
        } catch (err: unknown) {
            const error = err instanceof Error 
                ? { title: 'Error', detail: err.message }
                : { title: 'Error', detail: 'Error desconocido al cargar la categoría' };

            this.changeState({
                ...this.state,
                category: null,
                isLoading: false,
                error,
            });
        }
    }

    /**
     * Resetea el estado.
     */
    reset(): void {
        this.changeState(initialCategoryDetailState);
    }
}
