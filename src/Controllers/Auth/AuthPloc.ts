import { Ploc } from "../../Domain/Ploc";
import type { IStorage } from "../../Domain/Interfaces/IStorage";
import type { IAuthToken } from "../../Domain/Auth/AuthEntities";
import { AuthStatus } from "../../Domain";
import type { IAuthState } from "./IAuthState";
import { initialAuthState } from "./IAuthState";
import type {
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    GetSessionUserUseCase,
    LoginRequest,
    RegisterUserRequest
} from "../../Application/Auth";

/**
 * CONTROLLERS LAYER - Auth Module
 * Máquina de estados para la gestión de autenticación.
 */
export class AuthPloc extends Ploc<IAuthState> {
    private static readonly STORAGE_KEY = 'auth_session';
    private readonly loginUseCase: LoginUseCase;
    private readonly registerUseCase: RegisterUseCase;
    private readonly refreshTokenUseCase: RefreshTokenUseCase;
    private readonly getSessionUserUseCase: GetSessionUserUseCase;
    private readonly storage: IStorage;

    constructor(
        loginUseCase: LoginUseCase,
        registerUseCase: RegisterUseCase,
        refreshTokenUseCase: RefreshTokenUseCase,
        getSessionUserUseCase: GetSessionUserUseCase,
        storage: IStorage
    ) {
        super(initialAuthState);
        this.loginUseCase = loginUseCase;
        this.registerUseCase = registerUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.getSessionUserUseCase = getSessionUserUseCase;
        this.storage = storage;
    }

    /**
     * Inicializa la sesión si existe información persistida.
     */
    async init(): Promise<void> {
        const persistedToken = await this.storage.get<IAuthToken>(AuthPloc.STORAGE_KEY);

        if (!persistedToken) {
            this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED });
            return;
        }

        try {
            this.changeState({ ...this.state, status: AuthStatus.REFRESHING_TOKEN, token: persistedToken });
            const newToken = await this.refreshTokenUseCase.execute(persistedToken.refreshToken);
            await this.handleAuthenticationSuccess(newToken);
        } catch {
            this.logout();
        }
    }

    /**
     * Proceso de Login.
     */
    async login(request: LoginRequest): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.AUTHENTICATING, error: undefined });

        try {
            const token = await this.loginUseCase.execute(request);
            await this.handleAuthenticationSuccess(token);
        } catch {
            this.changeState({
                ...this.state,
                status: AuthStatus.FAILED,
                error: 'Credenciales inválidas o error de conexión'
            });
        }
    }

    /**
     * Proceso de Registro.
     */
    async register(request: RegisterUserRequest): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.AUTHENTICATING, error: undefined });

        try {
            await this.registerUseCase.execute(request);
            // Tras registrarse, el flujo habitual es ir a login o login automático
            this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED });
        } catch {
            this.changeState({
                ...this.state,
                status: AuthStatus.FAILED,
                error: 'Error al crear la cuenta'
            });
        }
    }

    /**
     * Cierre de sesión.
     */
    async logout(): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.LOGGING_OUT });
        this.storage.remove(AuthPloc.STORAGE_KEY);
        this.changeState(initialAuthState);
        this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED });
    }

    /**
     * Lógica común tras obtener un token válido.
     */
    private async handleAuthenticationSuccess(token: IAuthToken): Promise<void> {
        await this.storage.set(AuthPloc.STORAGE_KEY, token);

        try {
            const user = await this.getSessionUserUseCase.execute();
            this.changeState({
                status: AuthStatus.AUTHENTICATED,
                token,
                user,
                error: undefined
            });
        } catch {
            this.changeState({
                ...this.state,
                status: AuthStatus.FAILED,
                error: 'Sesión iniciada pero no se pudo obtener el perfil'
            });
        }
    }
}
