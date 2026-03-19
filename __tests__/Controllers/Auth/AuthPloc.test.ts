/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthPloc } from '../../../src/Controllers/Auth/AuthPloc';
import { AuthStatus } from '../../../src/Domain';
import type { IAuthSessionRepository } from '../../../src/Domain/Repositories/IAuthSessionRepository';
import type { LoginUserUseCase, RefreshTokenUseCases } from '../../../src/Application/UseCases/Auth/LoginUseCases';
import type { RegisterUseCases } from '../../../src/Application/UseCases/Auth/RegisterUsesCase';
import type { LogoutUseCase } from '../../../src/Application/UseCases/Auth/LogoutUseCase';
import type { CheckAuthSessionUseCase } from '../../../src/Application/UseCases/Auth';

/**
 * TEST - Controllers Layer
 * AuthPloc: Máquina de estados de autenticación.
 * Prueba las transiciones de estado sin tocar React ni el DOM.
 */
describe('AuthPloc', () => {
    let ploc: AuthPloc;
    let loginUserUseCase: { execute: ReturnType<typeof vi.fn> };
    let registerUseCases: { execute: ReturnType<typeof vi.fn> };
    let refreshTokenUseCases: { execute: ReturnType<typeof vi.fn> };
    let logoutUseCase: { execute: ReturnType<typeof vi.fn> };
    let checkAuthSessionUseCase: { execute: ReturnType<typeof vi.fn> };
    let authSessionRepository: IAuthSessionRepository;

    const mockUser = { id: 'u1', name: 'Test User', email: 'test@test.com' };

    beforeEach(() => {
        loginUserUseCase = { execute: vi.fn() };
        registerUseCases = { execute: vi.fn() };
        refreshTokenUseCases = { execute: vi.fn() };
        logoutUseCase = { execute: vi.fn() };
        checkAuthSessionUseCase = { execute: vi.fn() };

        // Mock de IAuthSessionRepository
        authSessionRepository = {
            getSession: vi.fn().mockResolvedValue(null),
            saveSession: vi.fn().mockResolvedValue(undefined),
            clearSession: vi.fn().mockResolvedValue(undefined)
        };

        ploc = new AuthPloc(
            loginUserUseCase as unknown as LoginUserUseCase,
            registerUseCases as unknown as RegisterUseCases,
            refreshTokenUseCases as unknown as RefreshTokenUseCases,
            logoutUseCase as unknown as LogoutUseCase,
            checkAuthSessionUseCase as unknown as CheckAuthSessionUseCase,
            authSessionRepository
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
        it('should set UNAUTHENTICATED when no session exists', async () => {
            checkAuthSessionUseCase.execute.mockResolvedValue({ isAuthenticated: false, session: null });
            await ploc.init();
            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });

        it('should set AUTHENTICATED when valid session exists without refresh', async () => {
            const mockSession = {
                user: mockUser,
                accessToken: 'token',
                refreshToken: 'refresh',
                accessTokenNeedsRefresh: () => false
            };
            checkAuthSessionUseCase.execute.mockResolvedValue({ isAuthenticated: true, session: mockSession as any });

            await ploc.init();

            expect(ploc.state.status).toBe(AuthStatus.AUTHENTICATED);
            expect(ploc.state.user).toEqual(mockUser);
        });

        it('should refresh token if session needs refresh', async () => {
            const mockSession = {
                user: mockUser,
                accessToken: 'old-token',
                refreshToken: 'refresh-token',
                accessTokenNeedsRefresh: () => true
            };
            checkAuthSessionUseCase.execute.mockResolvedValue({ isAuthenticated: true, session: mockSession as any });
            refreshTokenUseCases.execute.mockResolvedValue({ accessToken: 'new-token', refreshToken: 'new-refresh' });

            await ploc.init();

            expect(refreshTokenUseCases.execute).toHaveBeenCalledWith({ refreshToken: 'refresh-token' });
            expect(ploc.state.status).toBe(AuthStatus.AUTHENTICATED);
        });

        it('should logout if token refresh fails', async () => {
            const mockSession = {
                user: mockUser,
                accessToken: 'old-token',
                refreshToken: 'refresh-token',
                accessTokenNeedsRefresh: () => true
            };
            checkAuthSessionUseCase.execute.mockResolvedValue({ isAuthenticated: true, session: mockSession as any });
            refreshTokenUseCases.execute.mockResolvedValue({ type: 'error', detail: 'Expired' });

            await ploc.init();

            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });
    });

    // ── login() ─────────────────────────────────────────────────────
    describe('login()', () => {
        it('should authenticate the user successfully', async () => {
            loginUserUseCase.execute.mockResolvedValue({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                user: mockUser
            });
            vi.mocked(authSessionRepository.getSession).mockResolvedValue({
                userId: mockUser.id,
                name: mockUser.name,
                email: mockUser.email
            } as any);

            await ploc.login({ email: 'test@test.com', password: 'password', deviceInfo: 'test-device' });

            expect(ploc.state.status).toBe(AuthStatus.AUTHENTICATED);
            expect(ploc.state.user).toEqual(mockUser);
        });

        it('should set FAILED status on invalid credentials', async () => {
            loginUserUseCase.execute.mockRejectedValue(new Error('Unauthorized'));

            await ploc.login({ email: 'x@x.com', password: 'wrong', deviceInfo: 'test-device' });

            expect(ploc.state.status).toBe(AuthStatus.FAILED);
            expect(ploc.state.error).toBeDefined();
        });
    });

    // ── register() ─────────────────────────────────────────────────
    describe('register()', () => {
        it('should set UNAUTHENTICATED after successful registration', async () => {
            registerUseCases.execute.mockResolvedValue({ message: 'Registration successful' });

            // Password debe tener al menos 8 caracteres, una mayúscula y un número
            await ploc.register({ name: 'New User', email: 'new@test.com', password: 'Password1', confirmPassword: 'Password1' });

            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });

        it('should set FAILED status if registration fails', async () => {
            registerUseCases.execute.mockRejectedValue(new Error('Email taken'));

            await ploc.register({ name: 'New User', email: 'taken@test.com', password: 'pass' });

            expect(ploc.state.status).toBe(AuthStatus.FAILED);
            expect(ploc.state.error).toBeDefined();
        });
    });

    // ── logout() ───────────────────────────────────────────────────
    describe('logout()', () => {
        it('should call logout use case and set UNAUTHENTICATED status', async () => {
            logoutUseCase.execute.mockResolvedValue(undefined);

            await ploc.logout();

            expect(logoutUseCase.execute).toHaveBeenCalled();
            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });

        it('should clear session even if server notification fails', async () => {
            logoutUseCase.execute.mockRejectedValue(new Error('Network error'));

            await ploc.logout();

            expect(authSessionRepository.clearSession).toHaveBeenCalled();
            expect(ploc.state.status).toBe(AuthStatus.UNAUTHENTICATED);
        });
    });

    // ── Observer Pattern ───────────────────────────────────────────
    describe('Observer / subscribe()', () => {
        it('should notify subscribers on state change', async () => {
            const listener = vi.fn();
            ploc.subscribe(listener);

            loginUserUseCase.execute.mockRejectedValue(new Error('Fail'));
            await ploc.login({ email: 'x@x.com', password: 'p', deviceInfo: 'test' });

            expect(listener).toHaveBeenCalled();
            ploc.unsubscribe(listener);
        });

        it('should stop notifying after unsubscribe', async () => {
            const listener = vi.fn();
            ploc.subscribe(listener);
            ploc.unsubscribe(listener);

            loginUserUseCase.execute.mockRejectedValue(new Error('Fail'));
            await ploc.login({ email: 'x@x.com', password: 'p', deviceInfo: 'test' });

            // El listener fue registrado y desregistrado antes del login,
            // pero el Ploc emite durante el login → no debería llamarse después.
            const callsAfterUnsub = listener.mock.calls.length;
            expect(callsAfterUnsub).toBe(0);
        });
    });
});
