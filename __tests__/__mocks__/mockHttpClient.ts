import { vi } from 'vitest';
import type { IHttpClient } from '../../src/Domain/Interfaces/IHttpClient';

/**
 * Fábrica de mock para IHttpClient.
 * Devuelve un objeto con todas las funciones mockeadas de Vitest.
 * Uso: const httpClient = createMockHttpClient();
 */
export const createMockHttpClient = (): IHttpClient => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
});
