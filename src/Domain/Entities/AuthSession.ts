/**
 * DOMAIN LAYER - Entities
 * AuthSession: Entidad de dominio inmutable que representa una sesión de autenticación.
 * Ahora usa Value Objects para mayor validación y tipo seguridad.
 */

import { Email, AuthTokens, UserId } from '../ValueObjects';

export interface UserData {
    id: string;
    email: string;
    name?: string;
}

export interface AuthSessionProps {
    tokens: AuthTokens;
    user: UserData;
}

/**
 * Entidad inmutable que encapsula la lógica de negocio de la sesión.
 * Usa Value Objects internamente para garantizar invariancias.
 */
export class AuthSession {
    private readonly _tokens: AuthTokens;
    private readonly _userId: UserId;
    private readonly _email: Email;
    private readonly _name: string | undefined;

    private constructor(props: AuthSessionProps & { userId: UserId; email: Email }) {
        this._tokens = props.tokens;
        this._userId = props.userId;
        this._email = props.email;
        this._name = props.user.name;
    }

    /**
     * Factory method que crea una AuthSession validada.
     * @throws Error si los datos son inválidos
     */
    static create(props: AuthSessionProps): AuthSession {
        // Usar Value Objects para validación
        const userId = UserId.create(props.user.id);
        const email = Email.create(props.user.email);

        return new AuthSession({
            ...props,
            userId,
            email
        });
    }

    /**
     * Crea desde JSON persistido (para recuperar sesión guardada).
     * Soporta formato nuevo (tokens object) y formato legacy (flat).
     */
    static fromJSON(json: string): AuthSession {
        try {
            const data = JSON.parse(json);
            
            // Detectar formato legacy (flat) vs nuevo (tokens object)
            let tokens: AuthTokens;
            
            if (data.tokens && data.tokens.accessToken) {
                // Nuevo formato: { tokens: { accessToken, refreshToken, expiresAt } }
                tokens = AuthTokens.fromJSON({
                    accessToken: data.tokens.accessToken,
                    refreshToken: data.tokens.refreshToken,
                    expiresAt: data.tokens.expiresAt
                });
            } else {
                // Formato legacy: { accessToken, refreshToken, expiresAt }
                tokens = AuthTokens.fromJSON({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    expiresAt: data.expiresAt
                });
            }

            return AuthSession.create({
                tokens,
                user: {
                    id: data.user?.id || data.userId,
                    email: data.user?.email || data.email,
                    name: data.user?.name || data.name
                }
            });
        } catch (error) {
            throw new Error('Formato de sesión inválido: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    // Getters - exponer valores primitivos para compatibilidad
    get accessToken(): string {
        return this._tokens.getAccessToken();
    }

    get refreshToken(): string {
        return this._tokens.getRefreshToken();
    }

    get expiresAt(): number {
        return this._tokens.getExpiresAt();
    }

    get userId(): string {
        return this._userId.toString();
    }

    get email(): string {
        return this._email.toString();
    }

    get name(): string | undefined {
        return this._name;
    }

    get user(): UserData {
        return {
            id: this._userId.toString(),
            email: this._email.toString(),
            name: this._name
        };
    }

    // Delegate methods to AuthTokens
    isExpired(): boolean {
        return this._tokens.isExpired();
    }

    needsRefresh(): boolean {
        return this._tokens.needsRefresh();
    }

    isValid(): boolean {
        return !this.isExpired() && !!this.accessToken && !!this.refreshToken;
    }

    /**
     * Actualiza los tokens manteniendo la inmutabilidad.
     * Retorna una nueva instancia.
     */
    updateTokens(newAccessToken: string, newRefreshToken: string, expiresInSeconds: number): AuthSession {
        const newTokens = this._tokens.updateTokens(newAccessToken, newRefreshToken, expiresInSeconds);
        
        return AuthSession.create({
            tokens: newTokens,
            user: this.user
        });
    }

    /**
     * Serializa a JSON para persistencia.
     */
    toJSON(): string {
        return JSON.stringify({
            tokens: this._tokens.toJSON(),
            user: this.user
        });
    }
}
