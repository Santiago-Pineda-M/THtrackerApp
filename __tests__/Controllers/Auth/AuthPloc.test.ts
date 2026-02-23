import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthPloc } from '../../../src/Controllers/Auth/AuthPloc';
import { AuthStatus } from '../../../src/Domain';
import type { LoginUseCase } from '../../../src/Application/Auth/LoginUseCase';
import type { RegisterUseCase } from '../../../src/Application/Auth/RegisterUseCase';
import type { RefreshTokenUseCase } from '../../../src/Application/Auth/RefreshTokenUseCase';
import type { GetSessionUserUseCase } from '../../../src/Application/Auth/GetSessionUserUseCase';
import { createMockStorage } from '../../__mocks__/mockStorage';

/**
 * TEST - Controllers Layer
 * AuthPloc: Máquina de estados de autenticación.
 * Prueba las transiciones de estado sin tocar React ni el DOM.
 */
describe('AuthPloc', () => {
    let ploc: AuthPloc;
    let loginUseCase: { execute: ReturnType<typeof vi.fn> };
    let registerUseCase: { execute: ReturnType<typeof vi.fn> };
    let refreshTokenUseCase: { execute: ReturnType<typeof vi.fn> };
    let getSessionUserUseCase: { execute: ReturnType<typeof vi.fn> };
    let storage: ReturnType<typeof createMockStorage>;

    const mockToken = { accessToken: 'access-token', refreshToken: 'refresh-token' };
    const mockUser = { id: 'u1', name: 'Test User', email: 'test@test.com' };

    beforeEach(() => {
        loginUseCase = { execute: vi.fn() };
        registerUseCase = { execute: vi.fn() };
        refreshTokenUseCase = { execute: vi.fn() };
        getSessionUserUseCase = { execute: vi.fn() };
        storage = createMockStorage();

        ploc = new AuthPloc(
            loginUseCase as unknown as LoginUseCase,
            registerUseCase as unknown as RegisterUseCase,
            refreshTokenUseCase as unknown as RefreshTokenUseCase,
            getSessionUserUseCase as unknown as GetSessionUserUseCase,
            storage
        );
    });

    // ── Estado inicial ──────────────────────────────────────────────
    it('should start with IDLE status', () => {
        expect(ploc.state.status).toBe(AuthStatus.IDLE);
        expect(ploc.state.user).toBeUndefined();
        expect(ploc.state.error).toBeUndefined();
    });

    // ── init() ─────────────────────────────────────────────────────
    describe('init()', () => {
        it('should set UNAUTHENTICATED when no persisted token exists', async () => {
            vi.mocked(storage.get).mockResolvedValue(null);
            await ploc.init();
            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });

        it('should refresh token and authenticate if a persisted token exists', async () => {
            vi.mocked(storage.get).mockResolvedValue(mockToken);
            refreshTokenUseCase.execute.mockResolvedValue(mockToken);
            getSessionUserUseCase.execute.mockResolvedValue(mockUser);

            await ploc.init();

            expect(refreshTokenUseCase.execute).toHaveBeenCalledWith(mockToken.refreshToken);
            expect(ploc.state.status).toBe(AuthStatus.AUTHENTICATED);
            expect(ploc.state.user).toEqual(mockUser);
        });

        it('should logout if token refresh fails', async () => {
            vi.mocked(storage.get).mockResolvedValue(mockToken);
            refreshTokenUseCase.execute.mockRejectedValue(new Error('Expired'));

            await ploc.init();

            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });
    });

    // ── login() ─────────────────────────────────────────────────────
    describe('login()', () => {
        it('should authenticate the user successfully', async () => {
            loginUseCase.execute.mockResolvedValue(mockToken);
            getSessionUserUseCase.execute.mockResolvedValue(mockUser);

            await ploc.login({ email: 'test@test.com', password: 'password' });

            expect(ploc.state.status).toBe(AuthStatus.AUTHENTICATED);
            expect(ploc.state.user).toEqual(mockUser);
            expect(ploc.state.token).toEqual(mockToken);
            expect(storage.set).toHaveBeenCalled();
        });

        it('should set FAILED status on invalid credentials', async () => {
            loginUseCase.execute.mockRejectedValue(new Error('Unauthorized'));

            await ploc.login({ email: 'x@x.com', password: 'wrong' });

            expect(ploc.state.status).toBe(AuthStatus.FAILED);
            expect(ploc.state.error).toBeDefined();
        });

        it('should set FAILED if token succeeds but getSessionUser fails', async () => {
            loginUseCase.execute.mockResolvedValue(mockToken);
            getSessionUserUseCase.execute.mockRejectedValue(new Error('Profile error'));

            await ploc.login({ email: 'test@test.com', password: 'pass' });

            expect(ploc.state.status).toBe(AuthStatus.FAILED);
            expect(ploc.state.error).toBeDefined();
        });
    });

    // ── register() ─────────────────────────────────────────────────
    describe('register()', () => {
        it('should set UNAUTHENTICATED after successful registration', async () => {
            registerUseCase.execute.mockResolvedValue(undefined);

            await ploc.register({ name: 'New User', email: 'new@test.com', password: 'pass' });

            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });

        it('should set FAILED status if registration fails', async () => {
            registerUseCase.execute.mockRejectedValue(new Error('Email taken'));

            await ploc.register({ name: 'New User', email: 'taken@test.com', password: 'pass' });

            expect(ploc.state.status).toBe(AuthStatus.FAILED);
            expect(ploc.state.error).toBeDefined();
        });
    });

    // ── logout() ───────────────────────────────────────────────────
    describe('logout()', () => {
        it('should clear storage and set UNAUTHENTICATED status', async () => {
            await ploc.logout();

            expect(storage.remove).toHaveBeenCalled();
            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });
    });

    // ── Observer Pattern ───────────────────────────────────────────
    describe('Observer / subscribe()', () => {
        it('should notify subscribers on state change', async () => {
            const listener = vi.fn();
            ploc.subscribe(listener);

            loginUseCase.execute.mockRejectedValue(new Error('Fail'));
            await ploc.login({ email: 'x@x.com', password: 'p' });

            expect(listener).toHaveBeenCalled();
            ploc.unsubscribe(listener);
        });

        it('should stop notifying after unsubscribe', async () => {
            const listener = vi.fn();
            ploc.subscribe(listener);
            ploc.unsubscribe(listener);

            loginUseCase.execute.mockRejectedValue(new Error('Fail'));
            await ploc.login({ email: 'x@x.com', password: 'p' });

            // El listener fue registrado y desregistrado antes del login,
            // pero el Ploc emite durante el login → no debería llamarse después.
            const callsAfterUnsub = listener.mock.calls.length;
            expect(callsAfterUnsub).toBe(0);
        });
    });
});
