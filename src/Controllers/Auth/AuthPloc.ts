import { Ploc } from "../../Domain/Ploc";
import { AuthStatus } from "../../Domain";
import type { IAuthState } from "../../Domain";
import { initialAuthState } from "../../Domain";

// Importar tipos de la nueva arquitectura
import type { IAuthSessionRepository } from "../../Domain/Repositories/IAuthSessionRepository";
import type { LoginUserUseCase, RegisterUseCases, RefreshTokenUseCases, LogoutUseCase, CheckAuthSessionUseCase } from "../../Application/UseCases/Auth";
import type { ILoginRequest, IRegisterRequest, ILoginResponse, ILoginResponseError, IUserSession, UserData } from "../../Domain";

/**
 * CONTROLLERS LAYER - Auth Module
 * Máquina de estados para la gestión de autenticación.
 * Implementa la nueva arquitectura con AuthSessionRepository.
 */
export class AuthPloc extends Ploc<IAuthState> {
    private readonly loginUserUseCase: LoginUserUseCase;
    private readonly registerUseCases: RegisterUseCases;
    private readonly refreshTokenUseCases: RefreshTokenUseCases;
    private readonly logoutUseCase: LogoutUseCase;
    private readonly checkAuthSessionUseCase: CheckAuthSessionUseCase;
    private readonly authSessionRepository: IAuthSessionRepository;

    constructor(
        loginUserUseCase: LoginUserUseCase,
        registerUseCases: RegisterUseCases,
        refreshTokenUseCases: RefreshTokenUseCases,
        logoutUseCase: LogoutUseCase,
        checkAuthSessionUseCase: CheckAuthSessionUseCase,
        authSessionRepository: IAuthSessionRepository
    ) {
        super(initialAuthState);
        this.loginUserUseCase = loginUserUseCase;
        this.registerUseCases = registerUseCases;
        this.refreshTokenUseCases = refreshTokenUseCases;
        this.logoutUseCase = logoutUseCase;
        this.checkAuthSessionUseCase = checkAuthSessionUseCase;
        this.authSessionRepository = authSessionRepository;
    }

    /**
     * Inicializa la sesión verificando la sesión persistida.
     */
    async init(): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.LOADING });

        try {
            const { isAuthenticated, session } = await this.checkAuthSessionUseCase.execute();

            if (!isAuthenticated || !session) {
                this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED });
                return;
            }

            // Verificar si necesita refresh
            if (session.accessTokenNeedsRefresh()) {
                this.changeState({ 
                    ...this.state, 
                    status: AuthStatus.REFRESHING_TOKEN,
                    user: this.mapUserDataToUserSession(session.user)
                });

                try {
                    const result = await this.refreshTokenUseCases.execute({ refreshToken: session.refreshToken });
                    
                    if (!('accessToken' in result)) {
                        console.error('[AuthPloc] Refresh automático fallido durante init:', result);
                        await this.logout();
                        return;
                    }
                } catch (error) {
                    console.error('[AuthPloc] Excepción durante refresh automático en init:', error);
                    // Si falla el refresh, cerrar sesión
                    await this.logout();
                    return;
                }
            }

            // Sesión válida
            this.changeState({
                status: AuthStatus.AUTHENTICATED,
                user: {
                    id: session.user.id,
                    name: session.user.name || '',
                    email: session.user.email
                },
                error: undefined
            });
        } catch {
            this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED });
        }
    }

    /**
     * Proceso de Login usando la nueva arquitectura.
     */
    async login(request: ILoginRequest): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.AUTHENTICATING, error: undefined });

        try {
            const result = await this.loginUserUseCase.execute(request);

            // Verificar si el login fue exitoso
            if (this.isLoginSuccess(result)) {
                // La sesión ya está persistida y los tokens guardados.
                // Obtenemos los datos del usuario de la sesión actual
                const session = await this.authSessionRepository.getSession();
                
                this.changeState({
                    status: AuthStatus.AUTHENTICATED,
                    user: session ? {
                        id: session.userId,
                        name: session.name || '',
                        email: session.email
                    } : undefined,
                    error: undefined
                });
            } else {
                // Login fallido
                const errorMessage = this.formatLoginError(result);
                this.changeState({
                    status: AuthStatus.FAILED,
                    error: errorMessage
                });
            }
        } catch (error) {
            this.changeState({
                ...this.state,
                status: AuthStatus.FAILED,
                error: error instanceof Error ? error.message : 'Error de conexión'
            });
        }
    }

    /**
     * Proceso de Registro.
     */
    async register(request: IRegisterRequest): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.AUTHENTICATING, error: undefined });

        try {
            const result = await this.registerUseCases.execute(request);

            // Verificar si el registro fue exitoso
            if ('message' in result) {
                // Registro exitoso - típicamente requiere confirmación de email (aunque la API actual regrese 200 vacío)
                this.changeState({ 
                    ...this.state, 
                    status: AuthStatus.UNAUTHENTICATED,
                    error: undefined
                });
            } else {
                // Error en registro (result es ILoginResponseError)
                const error = result as ILoginResponseError;
                this.changeState({
                    status: AuthStatus.FAILED,
                    error: error.detail || error.title || 'Error al crear la cuenta'
                });
            }
        } catch (error) {
            this.changeState({
                ...this.state,
                status: AuthStatus.FAILED,
                error: error instanceof Error ? error.message : 'Error al crear la cuenta'
            });
        }
    }

    /**
     * Cierre de sesión usando LogoutUseCase.
     */
    async logout(): Promise<void> {
        this.changeState({ ...this.state, status: AuthStatus.LOGGING_OUT });

        try {
            await this.logoutUseCase.execute();
        } catch {
            // Limpiar sesión local aunque el servidor falle
            await this.authSessionRepository.clearSession();
        }

    this.changeState(initialAuthState);
        this.changeState({ ...this.state, status: AuthStatus.UNAUTHENTICATED });
    }


    /**
     * Verifica si el resultado de login es exitoso.
     */
    private isLoginSuccess(result: unknown): result is ILoginResponse {
        return (
            typeof result === 'object' &&
            result !== null &&
            'accessToken' in result &&
            'refreshToken' in result
        );
    }

    /**
     * Convierte UserData a IUserSession.
     */
    private mapUserDataToUserSession(userData: UserData): IUserSession {
        return {
            id: userData.id,
            name: userData.name || '',
            email: userData.email
        };
    }

    /**
     * Formatea los errores de login según RFC 7807.
     * Muestra errores de campo específicos cuando están disponibles.
     */
    private formatLoginError(result: ILoginResponseError): string {
        // Si hay errores de campo específicos (RFC 7807), mostrarlos
        if (result.errors && Object.keys(result.errors).length > 0) {
            const fieldErrors = Object.entries(result.errors)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('\n');
            return fieldErrors;
        }
        
        // otherwise show the general error
        return result.detail || result.title || 'Credenciales inválidas';
    }
}
