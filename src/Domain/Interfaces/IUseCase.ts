/**
 * DOMAIN LAYER - Interfaces
 * Contrato base para todos los Casos de Uso.
 * I = tipo del input, O = tipo del output.
 */
export interface IUseCase<I, O> {
    execute(input: I): Promise<O>;
}
