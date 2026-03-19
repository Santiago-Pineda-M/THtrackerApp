import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HealthPloc } from '../../../src/Controllers/Health/HealthPloc';
import type { GetHealthUseCase } from '../../../src/Application/UseCases/Health/GetHealthUseCase';

/**
 * TEST - Controllers Layer
 * HealthPloc: Máquina de estados para el health check.
 */
describe('HealthPloc', () => {
    let ploc: HealthPloc;
    let getHealthUseCase: { execute: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        getHealthUseCase = { execute: vi.fn() };
        ploc = new HealthPloc(getHealthUseCase as unknown as GetHealthUseCase);
    });

    it('should start with isAlive=false and isLoading=false', () => {
        expect(ploc.state.isAlive).toBe(false);
        expect(ploc.state.isLoading).toBe(false);
        expect(ploc.state.lastChecked).toBeUndefined();
    });

    it('should set isAlive=true when the health use case returns true', async () => {
        getHealthUseCase.execute.mockResolvedValue(true);

        await ploc.checkHealth();

        expect(ploc.state.isAlive).toBe(true);
        expect(ploc.state.isLoading).toBe(false);
        expect(ploc.state.lastChecked).toBeInstanceOf(Date);
    });

    it('should set isAlive=false when the health use case returns false', async () => {
        getHealthUseCase.execute.mockResolvedValue(false);

        await ploc.checkHealth();

        expect(ploc.state.isAlive).toBe(false);
        expect(ploc.state.isLoading).toBe(false);
    });

    it('should notify the subscriber with loading state during checkHealth', async () => {
        const states: boolean[] = [];
        ploc.subscribe((s) => states.push(s.isLoading));
        getHealthUseCase.execute.mockResolvedValue(true);

        await ploc.checkHealth();

        // First emission: isLoading=true; second: isLoading=false
        expect(states[0]).toBe(true);
        expect(states[states.length - 1]).toBe(false);
    });
});
