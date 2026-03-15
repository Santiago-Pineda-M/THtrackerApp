/**
 * INFRASTRUCTURE LAYER - Dependency Injection
 * ─────────────────────────────────────────────────────────────────────────────
 * El único lugar donde se instancian y conectan las clases de todas las capas.
 *
 * Flujo de construcción (dependecias primero):
 *   Storage Adapters → Repositories → HTTP Client (con callbacks del repo)
 *   → Services → Use Cases → Controllers (Plocs)
 *
 * ⚠ REGLA: el storage (localStorage) solo se toca en los Repositories.
 *   FetchHttpClient y TokenRefreshStrategy reciben callbacks que
 *   internamente delegan a AuthSessionRepository.
 */

import { TokenRefreshStrategy } from '../Adapters/http/TokenRefreshStrategy';
import { FetchHttpClient } from '../Adapters/http/FetchHttpClient';
import { SecureStorageAdapter } from '../Adapters/storage';
import { AuthSessionRepository } from '../Repositories/AuthSessionRepository';
import { AuthService } from '../Services/AuthService';

import { GetHealthUseCase } from '../../Application/UseCases/Health/GetHealthUseCase';
import {
    LoginUserUseCase,
    RefreshTokenUseCases,
    RegisterUseCases,
    LogoutUseCase,
    CheckAuthSessionUseCase,
} from '../../Application/UseCases/Auth';

import { AuthPloc } from '../../Controllers/Auth/AuthPloc';
import { HealthPloc } from '../../Controllers/Health/HealthPloc';
import { DebugPloc } from '../../Controllers/Debug/DebugPloc';

const API_URL = import.meta.env.VITE_API_URL || 'https://thtracker-api.onrender.com';

// ── 1. Storage (solo SecureStorageAdapter — única capa de acceso a localStorage) ───────

const secureStorageAdapter = new SecureStorageAdapter();

// ── 2. Repositorios (únicos que leen/escriben en storage) ───────────────────────────

const authSessionRepository = new AuthSessionRepository(secureStorageAdapter);

// ── 3. Callbacks que conectan el HTTP Client con el repositorio ──────────────────────
//    Ni FetchHttpClient ni TokenRefreshStrategy acceden al storage directamente.

const getAccessToken = () =>
    authSessionRepository.getSession().then((s) => s?.accessToken ?? null);

const getRefreshToken = () =>
    authSessionRepository.getSession().then((s) => s?.refreshToken ?? null);

const onSessionRefreshed = async (
    newAccessToken: string,
    response: import('../../Domain').IRefreshTokenResponse
) => {
    const currentSession = await authSessionRepository.getSession();
    if (!currentSession) return;

    const { isoToExpiresInSeconds } = (() => {
        const calc = (iso: string) => {
            const ms = new Date(iso).getTime() - Date.now();
            return Math.max(0, Math.floor(ms / 1000));
        };
        return { isoToExpiresInSeconds: calc };
    })();

    const updatedSession = currentSession.updateTokens(
        newAccessToken,
        response.refreshToken,
        isoToExpiresInSeconds(response.refreshTokenExpiry)
    );

    await authSessionRepository.saveSession(updatedSession);
};

// ── 4. HTTP Client (transportista puro, sin acceso al storage) ──────────────────────

const refreshStrategy = new TokenRefreshStrategy(API_URL, getRefreshToken, onSessionRefreshed);
const httpClient = new FetchHttpClient(API_URL, getAccessToken, refreshStrategy);

// ── 5. Servicios ────────────────────────────────────────────────────────────────────

const authService = new AuthService(httpClient);

// ── 6. Casos de Uso ─────────────────────────────────────────────────────────────────

const getHealthUseCase = new GetHealthUseCase(httpClient);
const loginUserUseCase = new LoginUserUseCase(authService, authSessionRepository);
const registerUseCases = new RegisterUseCases(authService);
const refreshTokenUseCases = new RefreshTokenUseCases(authService, authSessionRepository);
const logoutUseCase = new LogoutUseCase(authSessionRepository);
const checkAuthSessionUseCase = new CheckAuthSessionUseCase(authSessionRepository);

// ── 7. Controllers / Plocs ──────────────────────────────────────────────────────────

const authPloc = new AuthPloc(
    loginUserUseCase,
    registerUseCases,
    refreshTokenUseCases,
    logoutUseCase,
    checkAuthSessionUseCase,
    authSessionRepository
);

const debugPloc = new DebugPloc(authSessionRepository);

// ── 8. Locator público ──────────────────────────────────────────────────────────────

export const dependenciesLocator = {
    provideAuthPloc: () => authPloc,
    provideHealthPloc: () => new HealthPloc(getHealthUseCase),
    provideDebugPloc: () => debugPloc,
    provideAuthSessionRepository: () => authSessionRepository,
};
