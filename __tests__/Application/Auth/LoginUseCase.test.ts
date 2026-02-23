import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUseCase } from '../../../src/Application/Auth/LoginUseCase';
import { createMockHttpClient } from '../../__mocks__/mockHttpClient';

/**
 * TEST - Application Layer
 * LoginUseCase: Verifica que el caso de uso llame al endpoint correcto
 * y mapee la respuesta al tipo IAuthToken.
 */
describe('LoginUseCase', () => {
    let useCase: LoginUseCase;
    let httpClient: ReturnType<typeof createMockHttpClient>;

    beforeEach(() => {
        httpClient = createMockHttpClient();
        useCase = new LoginUseCase(httpClient);
    });

    it('should call POST /api/v1/auth/login with the provided credentials', async () => {
        const request = { email: 'test@test.com', password: 'password123' };
        const mockResponse = {
            data: {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                refreshTokenExpiry: new Date().toISOString()
            },
            status: 200
        };

        vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

        await useCase.execute(request);

        expect(httpClient.post).toHaveBeenCalledWith('/api/v1/auth/login', request);
    });

    it('should return a correctly mapped IAuthToken', async () => {
        const request = { email: 'test@test.com', password: 'password123' };
        const expiryString = '2027-01-01T00:00:00Z';
        const mockResponse = {
            data: {
                accessToken: 'my-access-token',
                refreshToken: 'my-refresh-token',
                refreshTokenExpiry: expiryString
            },
            status: 200
        };

        vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

        const result = await useCase.execute(request);

        expect(result.accessToken).toBe('my-access-token');
        expect(result.refreshToken).toBe('my-refresh-token');
        expect(result.expiry).toBeInstanceOf(Date);
    });

    it('should propagate errors from the HTTP client', async () => {
        vi.mocked(httpClient.post).mockRejectedValue(new Error('Network Error'));
        await expect(
            useCase.execute({ email: 'x@x.com', password: 'pass' })
        ).rejects.toThrow('Network Error');
    });
});
