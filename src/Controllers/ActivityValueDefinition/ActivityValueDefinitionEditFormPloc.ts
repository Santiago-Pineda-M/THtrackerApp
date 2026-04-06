/**
 * CONTROLLER LAYER - ActivityValueDefinitionEditFormPloc
 * PLOC para el formulario de edición de definiciones de valores.
 */

import { Ploc } from "../../Domain/Ploc";
import {
    type IValueDefinitionEditFormState,
    initialValueDefinitionEditFormState
} from "../../Domain";
import type { GetByIdActivityValueDefinitionUseCase, UpdateActivityValueDefinitionUseCase } from "../../Application/UseCases/ActivityValueDefinition";

export class ActivityValueDefinitionEditFormPloc extends Ploc<IValueDefinitionEditFormState> {
    private readonly getValueDefinitionByIdUseCase: GetByIdActivityValueDefinitionUseCase;
    private readonly updateValueDefinitionUseCase: UpdateActivityValueDefinitionUseCase;

    constructor(
        getValueDefinitionByIdUseCase: GetByIdActivityValueDefinitionUseCase,
        updateValueDefinitionUseCase: UpdateActivityValueDefinitionUseCase
    ) {
        super(initialValueDefinitionEditFormState);
        this.getValueDefinitionByIdUseCase = getValueDefinitionByIdUseCase;
        this.updateValueDefinitionUseCase = updateValueDefinitionUseCase;
    }

    /**
     * Carga la definición para editar.
     */
    async loadDefinition(activityId: string, id: string): Promise<void> {
        this.changeState({
            ...this.state,
            activityId,
            id,
            isLoading: true,
            errors: {},
        });

        try {
            const result = await this.getValueDefinitionByIdUseCase.execute({ activityId, id });

            if (result.success) {
                const definition = result.definition;
                this.changeState({
                    ...this.state,
                    name: definition.name,
                    valueType: definition.valueType,
                    isRequired: definition.isRequired,
                    unit: definition.unit,
                    minValue: definition.minValue,
                    maxValue: definition.maxValue,
                    isLoading: false,
                });
                return;
            }

            this.changeState({
                ...this.state,
                isLoading: false,
                errors: result.error ? { general: [result.error.detail || 'Error al cargar datos'] } : {},
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            this.changeState({
                ...this.state,
                isLoading: false,
                errors: { general: [message] },
            });
        }
    }

    updateName(name: string): void {
        const errors = { ...this.state.errors };
        delete errors.name;
        this.changeState({ ...this.state, name, errors, success: false, message: '' });
    }

    updateValueType(valueType: string): void {
        this.changeState({ ...this.state, valueType, success: false, message: '' });
    }

    updateIsRequired(isRequired: boolean): void {
        this.changeState({ ...this.state, isRequired, success: false, message: '' });
    }

    updateUnit(unit: string): void {
        this.changeState({ ...this.state, unit, success: false, message: '' });
    }

    updateMinValue(minValue: string): void {
        this.changeState({ ...this.state, minValue, success: false, message: '' });
    }

    updateMaxValue(maxValue: string): void {
        this.changeState({ ...this.state, maxValue, success: false, message: '' });
    }

    /**
     * Envía el formulario de edición.
     */
    async submit(): Promise<void> {
        const validationErrors = this.validateForm();
        if (Object.keys(validationErrors).length > 0) {
            this.changeState({
                ...this.state,
                errors: validationErrors,
                success: false,
                message: 'Corrige los errores del formulario.',
                isLoading: false,
            });
            return;
        }

        this.changeState({
            ...this.state,
            isLoading: true,
            errors: {},
            message: '',
        });

        try {
            const request = {
                activityId: this.state.activityId,
                id: this.state.id,
                name: this.state.name?.trim() || null,
                valueType: this.state.valueType || 'Number',
                isRequired: this.state.isRequired,
                unit: this.state.unit?.trim() || null,
                minValue: this.state.minValue?.trim() || null,
                maxValue: this.state.maxValue?.trim() || null,
            };

            const result = await this.updateValueDefinitionUseCase.execute(request);

            if (result.success) {
                this.changeState({
                    ...this.state,
                    success: true,
                    message: 'Definición actualizada correctamente.',
                    isLoading: false,
                });
                return;
            }

            const errorResult = result.error;
            const rawErrors = errorResult.errors ?? { general: [errorResult.title || errorResult.detail] };
            const errors = this.normalizeErrorKeys(rawErrors as Record<string, string[]>);

            this.changeState({
                ...this.state,
                errors,
                success: false,
                message: errorResult.title || 'Error al actualizar la definición.',
                isLoading: false,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            this.changeState({
                ...this.state,
                errors: { general: [message] },
                success: false,
                message,
                isLoading: false,
            });
        }
    }

    /**
     * Resetea el estado del formulario.
     */
    reset(): void {
        this.changeState(initialValueDefinitionEditFormState);
    }

    private validateForm(): Record<string, string[]> {
        const errors: Record<string, string[]> = {};
        if (!this.state.name || this.state.name.trim() === '') {
            errors.name = ['El nombre es requerido'];
        }
        return errors;
    }

    private normalizeErrorKeys(errors: Record<string, string[]>): Record<string, string[]> {
        const normalized: Record<string, string[]> = {};
        for (const [key, value] of Object.entries(errors)) {
            normalized[key.toLowerCase()] = value;
        }
        return normalized;
    }
}