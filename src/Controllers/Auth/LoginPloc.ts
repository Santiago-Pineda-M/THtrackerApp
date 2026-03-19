import { Ploc } from "../../Domain/Ploc";
import { type ILoginState, initialLoginState } from "../../Domain/IStates";
import type { ILoginRequest, ILoginResponse, ILoginResponseError } from "../../Domain";
import type { LoginUserUseCase } from "../../Application/UseCases/Auth";
import { AuthPloc } from "./AuthPloc";

export class LoginPloc extends Ploc<ILoginState> {
    private readonly loginUserUseCase: LoginUserUseCase;
    private readonly authPloc: AuthPloc;

    constructor(loginUserUseCase: LoginUserUseCase, authPloc: AuthPloc) {
        super(initialLoginState);
        this.loginUserUseCase = loginUserUseCase;
        this.authPloc = authPloc;
    }

    async login(email: string, password: string, deviceInfo: string): Promise<void> {
        const validationErrors = this.validateForm(email, password);
        if (Object.keys(validationErrors).length > 0) {
            this.changeState({
                ...this.state,
                email,
                password,
                errors: validationErrors,
                success: false,
                message: 'Corrige los errores del formulario.',
                isLoading: false,
            });
            return;
        }

        this.changeState({
            ...this.state,
            email,
            password,
            errors: {},
            message: '',
            isLoading: true,
        });

        try {
            const request: ILoginRequest = { email: email.trim(), password, deviceInfo };
            const result = await this.loginUserUseCase.execute(request);

            if (this.isLoginSuccess(result)) {
                await this.authPloc.onLoginSuccess();
                
                this.changeState({
                    ...this.state,
                    email,
                    password,
                    errors: {},
                    success: true,
                    message: 'Sesión iniciada correctamente.',
                    isLoading: false,
                });
                return;
            }

            const errorResult = result as ILoginResponseError;
            console.log('[LoginPloc] Login failed, errorResult:', errorResult);
            const rawErrors = errorResult.errors ?? { general: [errorResult.title] };
            const errors = this.normalizeErrorKeys(rawErrors);
            this.changeState({
                ...this.state,
                email,
                password,
                errors,
                success: false,
                message: errorResult.title,
                isLoading: false,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al iniciar sesión.';
            this.changeState({
                ...this.state,
                email,
                password,
                errors: { general: [message] },
                success: false,
                message,
                isLoading: false,
            });
        }
    }

    updateEmail(email: string): void {
        const newErrors = { ...this.state.errors };
        delete newErrors.email;
        this.changeState({ ...this.state, email, errors: newErrors });
    }

    updatePassword(password: string): void {
        const newErrors = { ...this.state.errors };
        delete newErrors.password;
        delete newErrors.general;
        this.changeState({ ...this.state, password, errors: newErrors });
    }

    /**
     * Resetea el estado del formulario de login.
     * Se llama cuando el componente se monta para limpiar el estado anterior.
     */
    reset(): void {
        this.changeState(initialLoginState);
    }

    private isLoginSuccess(result: ILoginResponse | ILoginResponseError): result is ILoginResponse {
        return (
            typeof (result as ILoginResponse).accessToken === 'string' &&
            typeof (result as ILoginResponse).refreshToken === 'string'
        );
    }

    private validateForm(email: string, password: string): Record<string, string[]> {
        const errors: Record<string, string[]> = {};
        if (!email || email.trim() === '') {
            errors.email = ['El correo es requerido'];
        } else if (!this.isValidEmail(email.trim())) {
            errors.email = ['El formato del correo no es válido'];
        }
        if (!password || password === '') {
            errors.password = ['La contraseña es requerida'];
        }
        return errors;
    }

    private isValidEmail(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    private normalizeErrorKeys(errors: Record<string, string[]>): Record<string, string[]> {
        const normalized: Record<string, string[]> = {};
        for (const [key, value] of Object.entries(errors)) {
            normalized[key.toLowerCase()] = value;
        }
        return normalized;
    }
}
