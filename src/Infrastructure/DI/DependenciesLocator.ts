// ============================================
// 1. IMPORTACIONES
// ============================================

// Application - Casos de Uso
import {
    LoginUserUseCase,
    RefreshTokenUseCases,
    RegisterUseCases,
    LogoutUseCase,
    CheckAuthSessionUseCase,
    GetSessionUseCase,
} from '../../Application/UseCases/Auth';

// Controllers - Plocs
import { AuthPloc } from '../../Controllers/Auth/AuthPloc';
import { LoginPloc } from '../../Controllers/Auth/LoginPloc';
import { RegisterPloc } from '../../Controllers/Auth/RegisterPloc';
import { RefreshTokenPloc } from '../../Controllers/Auth/RefreshTokenPloc';
import { LogoutPloc } from '../../Controllers/Auth/LogoutPloc';

// Domain
import { isoToExpiresInSeconds } from '../../Domain';

// Infrastructure - Adaptadores y Servicios
import { TokenRefreshStrategy } from '../Adapters/http/TokenRefreshStrategy';
import { FetchHttpClient } from '../Adapters/http/FetchHttpClient';
import { SecureStorageAdapter } from '../Adapters/storage';
import { AuthSessionRepository } from '../Repositories/AuthSessionRepository';
import { AuthService } from '../Services/AuthService';


// ============================================
// 2. CONSTANTES Y CONFIGURACIÓN
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'https://thtracker-api.onrender.com';


// ============================================
// 3. ADAPTADORES (Storage)
// ============================================

const secureStorageAdapter = new SecureStorageAdapter();


// ============================================
// 4. REPOSITORIOS
// ============================================

const authSessionRepository = new AuthSessionRepository(secureStorageAdapter);


// ============================================
// 5. FUNCIONES AUXILIARES PARA HTTP CLIENT
// ============================================

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

    const updatedSession = currentSession.updateTokens(
        newAccessToken,
        response.refreshToken,
        isoToExpiresInSeconds(response.refreshTokenExpiry)
    );

    await authSessionRepository.saveSession(updatedSession);
};


// ============================================
// 6. HTTP CLIENT (con estrategia de refresh)
// ============================================

const refreshStrategy = new TokenRefreshStrategy(API_URL, getRefreshToken, onSessionRefreshed);
const httpClient = new FetchHttpClient(API_URL, getAccessToken, refreshStrategy);


// ============================================
// 7. SERVICIOS
// ============================================

const authService = new AuthService(httpClient);


// ============================================
// 8. CASOS DE USO (Use Cases)
// ============================================

const loginUserUseCase = new LoginUserUseCase(authService, authSessionRepository);
const registerUseCases = new RegisterUseCases(authService);
const refreshTokenUseCases = new RefreshTokenUseCases(authService, authSessionRepository);
const logoutUseCase = new LogoutUseCase(authSessionRepository);
const checkAuthSessionUseCase = new CheckAuthSessionUseCase(authSessionRepository);
const getSessionUseCase = new GetSessionUseCase(authSessionRepository);


// ============================================
// 9. CONTROLLERS / PLOCS
// ============================================

// AuthPloc principal - maneja el estado global de autenticación
const authPloc = new AuthPloc(
    checkAuthSessionUseCase,
    getSessionUseCase
);

// LoginPloc - maneja el flujo de inicio de sesión
const loginPloc = new LoginPloc(loginUserUseCase, authPloc);

// RegisterPloc - maneja el flujo de registro
const registerPloc = new RegisterPloc(registerUseCases);

// RefreshTokenPloc - maneja la renovación de tokens
const refreshTokenPloc = new RefreshTokenPloc(refreshTokenUseCases, getSessionUseCase);

// LogoutPloc - maneja el cierre de sesión
const logoutPloc = new LogoutPloc(logoutUseCase, authPloc);


// ============================================
// 10. INTERFAZ DE DEPENDENCIAS
// ============================================

export interface Dependencies {
    providerLoginPloc: LoginPloc
    providerAuthPloc: AuthPloc
    providerRegisterPloc: RegisterPloc
    providerRefreshTokenPloc: RefreshTokenPloc
    providerLogoutPloc: LogoutPloc
    providerAuthSessionRepository: AuthSessionRepository
}


// ============================================
// 11. FUNCIONES PROVIDER
// ============================================

function provideLoginPloc(): LoginPloc {
    return loginPloc;
}

function provideAuthPloc(): AuthPloc {
    return authPloc;
}

function provideRegisterPloc(): RegisterPloc {
    return registerPloc;
}

function provideRefreshTokenPloc(): RefreshTokenPloc {
    return refreshTokenPloc;
}

function provideLogoutPloc(): LogoutPloc {
    return logoutPloc;
}

function provideAuthSessionRepository(): AuthSessionRepository {
    return authSessionRepository;
}


// ============================================
// 12. LOCATOR PÚBLICO
// ============================================

export const dependenciesLocator: Dependencies = {
    providerLoginPloc: provideLoginPloc(),
    providerAuthPloc: provideAuthPloc(),
    providerRegisterPloc: provideRegisterPloc(),
    providerRefreshTokenPloc: provideRefreshTokenPloc(),
    providerLogoutPloc: provideLogoutPloc(),
    providerAuthSessionRepository: provideAuthSessionRepository(),
};
