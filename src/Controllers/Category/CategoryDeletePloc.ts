/**
 * CONTROLLER LAYER - CategoryDeletePloc
 * PLOC para eliminar una categoría.
 */

import { Ploc } from "../../Domain/Ploc";

export interface ICategoryDeleteState {
    isLoading: boolean;
    success: boolean;
    error: {
        title?: string;
        detail?: string;
    } | null;
    message: string;
}

export const initialCategoryDeleteState: ICategoryDeleteState = {
    isLoading: false,
    success: false,
    error: null,
    message: '',
};

export class CategoryDeletePloc extends Ploc<ICategoryDeleteState> {
    private readonly deleteCategoryUseCase: import("../../Application/UseCases/Category").DeleteCategoryUseCase;

    constructor(deleteCategoryUseCase: import("../../Application/UseCases/Category").DeleteCategoryUseCase) {
        super(initialCategoryDeleteState);
        this.deleteCategoryUseCase = deleteCategoryUseCase;
    }

    /**
     * Elimina una categoría por su ID.
     */
    async deleteCategory(id: string): Promise<void> {
        this.changeState({
            ...this.state,
            isLoading: true,
            error: null,
            message: '',
        });

        try {
            const result = await this.deleteCategoryUseCase.execute({ id });

            if (result.success) {
                this.changeState({
                    ...this.state,
                    isLoading: false,
                    success: true,
                    message: 'Categoría eliminada correctamente.',
                    error: null,
                });
                return;
            }

            this.changeState({
                ...this.state,
                isLoading: false,
                success: false,
                error: result.error,
                message: result.error.title || 'Error al eliminar la categoría.',
            });
        } catch (err: unknown) {
            const error = err instanceof Error 
                ? { title: 'Error', detail: err.message }
                : { title: 'Error', detail: 'Error desconocido al eliminar la categoría' };

            this.changeState({
                ...this.state,
                isLoading: false,
                success: false,
                error,
                message: error.detail || 'Error desconocido',
            });
        }
    }

    /**
     * Resetea el estado.
     */
    reset(): void {
        this.changeState(initialCategoryDeleteState);
    }
}
