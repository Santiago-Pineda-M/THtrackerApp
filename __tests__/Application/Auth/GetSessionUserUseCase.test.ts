import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetSessionUserUseCase } from '../../../src/Application/Auth/GetSessionUserUseCase';
import { createMockHttpClient } from '../../__mocks__/mockHttpClient';

/**
 * TEST - Application Layer
 * GetSessionUserUseCase: Verifica que se obtenga y mapee el perfil del usuario.
 */
describe('GetSessionUserUseCase', () => {
    let useCase: GetSessionUserUseCase;
    let httpClient: ReturnType<typeof createMockHttpClient>;

    beforeEach(() => {
        httpClient = createMockHttpClient();
        useCase = new GetSessionUserUseCase(httpClient);
    });

    it('should call GET /api/v1/users/me', async () => {
        vi.mocked(httpClient.get).mockResolvedValue({
            data: { id: '123', name: 'John Doe', email: 'john@doe.com' },
            status: 200
        });

        await useCase.execute();

        expect(httpClient.get).toHaveBeenCalledWith('/api/v1/users/me');
    });

    it('should correctly map the API response to IUserSession', async () => {
        vi.mocked(httpClient.get).mockResolvedValue({
            data: { id: 'user-1', name: 'Jane Smith', email: 'jane@smith.com' },
            status: 200
        });

        const result = await useCase.execute();

        expect(result).toEqual({
            id: 'user-1',
            name: 'Jane Smith',
            email: 'jane@smith.com'
        });
    });

    it('should propagate errors from the HTTP client', async () => {
        vi.mocked(httpClient.get).mockRejectedValue(new Error('Unauthorized'));
        await expect(useCase.execute()).rejects.toThrow('Unauthorized');
    });
});
