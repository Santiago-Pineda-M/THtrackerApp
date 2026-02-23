import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUseCase } from '../../../src/Application/Auth/RegisterUseCase';
import { createMockHttpClient } from '../../__mocks__/mockHttpClient';

/**
 * TEST - Application Layer
 * RegisterUseCase: Verifica que el caso de uso llame al endpoint correcto.
 */
describe('RegisterUseCase', () => {
    let useCase: RegisterUseCase;
    let httpClient: ReturnType<typeof createMockHttpClient>;

    beforeEach(() => {
        httpClient = createMockHttpClient();
        useCase = new RegisterUseCase(httpClient);
    });

    it('should call POST /api/v1/auth/register with the provided data', async () => {
        const request = {
            name: 'Test User',
            email: 'test@test.com',
            password: 'securePassword'
        };

        vi.mocked(httpClient.post).mockResolvedValue({ data: undefined, status: 201 });

        await useCase.execute(request);

        expect(httpClient.post).toHaveBeenCalledWith('/api/v1/auth/register', request);
    });

    it('should propagate errors from the HTTP client', async () => {
        vi.mocked(httpClient.post).mockRejectedValue(new Error('Conflict: Email already exists'));
        await expect(
            useCase.execute({ name: 'Test', email: 'existing@test.com', password: 'pass' })
        ).rejects.toThrow('Conflict: Email already exists');
    });

    it('should complete without returning a value on success (void)', async () => {
        vi.mocked(httpClient.post).mockResolvedValue({ data: undefined, status: 201 });
        const result = await useCase.execute({ name: 'T', email: 'a@b.com', password: 'p' });
        expect(result).toBeUndefined();
    });
});
