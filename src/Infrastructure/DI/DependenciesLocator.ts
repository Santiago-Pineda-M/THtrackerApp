/**
 * INFRASTRUCTURE LAYER - Dependency Injection
 * DependenciesLocator: El único lugar en la aplicación donde se instancian
 * y conectan las clases de todas las capas. Actúa como Service Locator.
 */
import { FetchHttpClient } from "../Adapters/http/FetchHttpClient";
import { LocalStorageAdapter, SecureStorageAdapter } from "../Adapters/storage";

// Repositories
import { AuthSessionRepository } from "../Repositories/AuthSessionRepository";

// Services
import { AuthService } from "../Services/AuthService";

// Health
import { GetHealthUseCase } from "../../Application/Health/GetHealthUseCase";
import { HealthPloc } from "../../Controllers/Health/HealthPloc";

// Auth - Nueva Arquitectura
import {
    LoginUserUseCase,
    RefreshTokenUseCases,
    RegisterUseCases,
    LogoutUseCase,
    CheckAuthSessionUseCase
} from "../../Application/AuthUsesCase";

import { AuthPloc } from "../../Controllers/Auth/AuthPloc";


const API_URL = import.meta.env.VITE_API_URL || "https://thtracker-api.onrender.com";

// ── 1. Adaptadores ──────────────────────────────────────────────────────────

const localStorageAdapter = new LocalStorageAdapter('thtracker');
const secureStorageAdapter = new SecureStorageAdapter();
const httpClient = new FetchHttpClient(API_URL, localStorageAdapter);

// ── 2. Repositorios ───────────────────────────────────────────────────────────

const authSessionRepository = new AuthSessionRepository(secureStorageAdapter);

// El HTTP Client obtiene tokens directamente del repositorio (sin duplicación)

// ── 3. Servicios ─────────────────────────────────────────────────────────────

const authService = new AuthService(httpClient);

// ── 4. Casos de Uso ─────────────────────────────────────────────────────────
// Health
const getHealthUseCase = new GetHealthUseCase(httpClient);

// Auth - Nueva Arquitectura
const loginUserUseCase = new LoginUserUseCase(authService, authSessionRepository);
const registerUseCases = new RegisterUseCases(authService);
const refreshTokenUseCases = new RefreshTokenUseCases(authService, authSessionRepository);
const logoutUseCase = new LogoutUseCase(authSessionRepository, authService);
const checkAuthSessionUseCase = new CheckAuthSessionUseCase(authSessionRepository);

// ── 5. Controllers/Plocs ───────────────────────────────────────────────────

// AuthPloc con nueva arquitectura (usando AuthSessionRepository via SecureStorage)
const authPloc = new AuthPloc(
    loginUserUseCase,
    registerUseCases,
    refreshTokenUseCases,
    logoutUseCase,
    checkAuthSessionUseCase,
    authSessionRepository
);

// ── 6. Proveedores de Plocs ─────────────────────────────────────────────────
export const dependenciesLocator = {
    // Health
    provideHealthPloc: () => new HealthPloc(getHealthUseCase),

    // Auth - Nueva arquitectura
    provideAuthPloc: () => authPloc,

    // HTTP Client
    provideHttpClient: () => httpClient,

    // Storage
    provideLocalStorageAdapter: () => localStorageAdapter,
    provideSecureStorageAdapter: () => secureStorageAdapter,

    // Repositories
    provideAuthSessionRepository: () => authSessionRepository,

    // Services
    provideAuthService: () => authService,

    // Use Cases - Nueva arquitectura
    provideLoginUserUseCase: () => loginUserUseCase,
    provideRegisterUseCases: () => registerUseCases,
    provideRefreshTokenUseCases: () => refreshTokenUseCases,
    provideLogoutUseCase: () => logoutUseCase,
    provideCheckAuthSessionUseCase: () => checkAuthSessionUseCase,
};
