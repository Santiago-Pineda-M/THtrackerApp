/**
 * INFRASTRUCTURE LAYER - Dependency Injection
 * DependenciesLocator: El único lugar en la aplicación donde se instancian
 * y conectan las clases de todas las capas. Actúa como Service Locator.
 */
import { FetchHttpClient } from "../Adapters/http/FetchHttpClient";
import { SecureStorageAdapter } from "../Adapters/storage/SecureStorageAdapter";

// Health
import { GetHealthUseCase } from "../../Application/Health/GetHealthUseCase";
import { HealthPloc } from "../../Controllers/Health/HealthPloc";

// Auth
import {
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    GetSessionUserUseCase
} from "../../Application/Auth";
import { AuthPloc } from "../../Controllers/Auth/AuthPloc";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STORAGE_SECRET = import.meta.env.VITE_STORAGE_SECRET || "default_local_secret_passphrase";

// ── 1. Adaptadores ──────────────────────────────────────────────────────────
const secureStorage = new SecureStorageAdapter(STORAGE_SECRET);
const httpClient = new FetchHttpClient(API_URL, secureStorage);

// ── 2. Casos de Uso ─────────────────────────────────────────────────────────
// Health
const getHealthUseCase = new GetHealthUseCase(httpClient);

// Auth
const loginUseCase = new LoginUseCase(httpClient);
const registerUseCase = new RegisterUseCase(httpClient);
const refreshTokenUseCase = new RefreshTokenUseCase(httpClient);
const getSessionUserUseCase = new GetSessionUserUseCase(httpClient);

const authPloc = new AuthPloc(
    loginUseCase,
    registerUseCase,
    refreshTokenUseCase,
    getSessionUserUseCase,
    secureStorage
);

// ── 3. Proveedores de Plocs ─────────────────────────────────────────────────
export const dependenciesLocator = {
    // Health
    provideHealthPloc: () => new HealthPloc(getHealthUseCase),

    // Auth
    provideAuthPloc: () => authPloc,

    provideHttpClient: () => httpClient,
};
