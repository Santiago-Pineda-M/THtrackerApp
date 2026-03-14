import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetHealthUseCase } from '../../../src/Application/Health/GetHealthUseCase';
import { createMockHttpClient } from '../../__mocks__/mockHttpClient';

/**
 * TEST - Application Layer
 * GetHealthUseCase: Verifica chequeó de salud del API.
 */
describe('GetHealthUseCase', () => {
    let useCase: GetHealthUseCase;
    let httpClient: ReturnType<typeof createMockHttpClient>;

    beforeEach(() => {
        httpClient = createMockHttpClient();
        useCase = new GetHealthUseCase(httpClient);
    });

    it('should return true when API responds with status 200', async () => {
        vi.mocked(httpClient.get).mockResolvedValue({ data: {}, status: 200 });

        const result = await useCase.execute();

        expect(result).toBe(true);
        expect(httpClient.get).toHaveBeenCalledWith('/api/v1/health');
    });

    it('should return false when API responds with a non-200 status', async () => {
        vi.mocked(httpClient.get).mockResolvedValue({ data: {}, status: 503 });

        const result = await useCase.execute();

        expect(result).toBe(false);
    });

    it('should return false and not throw when HTTP client throws an error', async () => {
        vi.mocked(httpClient.get).mockRejectedValue(new Error('Network unreachable'));

        const result = await useCase.execute();

        expect(result).toBe(false);
    });
});
