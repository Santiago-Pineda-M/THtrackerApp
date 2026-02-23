import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RefreshTokenUseCase } from '../../../src/Application/Auth/RefreshTokenUseCase';
import { createMockHttpClient } from '../../__mocks__/mockHttpClient';

/**
 * TEST - Application Layer
 * RefreshTokenUseCase: Verifica el refresco del access token.
 */
describe('RefreshTokenUseCase', () => {
    let useCase: RefreshTokenUseCase;
    let httpClient: ReturnType<typeof createMockHttpClient>;

    beforeEach(() => {
        httpClient = createMockHttpClient();
        useCase = new RefreshTokenUseCase(httpClient);
    });

    it('should call POST /api/v1/auth/refresh with the refresh token', async () => {
        const refreshToken = 'old-refresh-token';
        const mockResponse = {
            data: {
                accessToken: 'new-access-token',
                refreshToken: 'new-refresh-token',
                refreshTokenExpiry: new Date().toISOString()
            },
            status: 200
        };

        vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

        await useCase.execute(refreshToken);

        expect(httpClient.post).toHaveBeenCalledWith(
            '/api/v1/auth/refresh',
            { refreshToken }
        );
    });

    it('should return a new IAuthToken with updated tokens', async () => {
        const expiryString = '2027-06-01T00:00:00Z';
        vi.mocked(httpClient.post).mockResolvedValue({
            data: {
                accessToken: 'new-at',
                refreshToken: 'new-rt',
                refreshTokenExpiry: expiryString
            },
            status: 200
        });

        const result = await useCase.execute('old-rt');

        expect(result.accessToken).toBe('new-at');
        expect(result.refreshToken).toBe('new-rt');
        expect(result.expiry).toBeInstanceOf(Date);
    });

    it('should propagate errors when refresh fails', async () => {
        vi.mocked(httpClient.post).mockRejectedValue(new Error('Token expired'));
        await expect(useCase.execute('invalid-rt')).rejects.toThrow('Token expired');
    });
});
